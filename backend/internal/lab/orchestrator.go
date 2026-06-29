// Package lab provides the lab orchestrator for dynamic container provisioning.
//
// The orchestrator manages the lifecycle of isolated lab containers:
// - Provisioning with security-hardened configuration
// - WebSocket terminal attachment
// - Resource monitoring and idle detection
// - Graceful teardown on completion or timeout
//
// Security design:
// - gVisor runtime (runsc) for kernel-level syscall interception
// - Seccomp profiles with whitelist-only system calls
// - Capability drop (CAP_DROP=ALL)
// - Read-only root filesystem with tmpfs for /tmp
// - Isolated network bridges per session
// - Resource limits (CPU, memory, PID, disk I/O)
package lab

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
)

// --- Configuration ---

const (
	DefaultMaxDuration  = 2 * time.Hour
	PremiumMaxDuration  = 4 * time.Hour
	DefaultIdleTimeout  = 15 * time.Minute
	DefaultMaxMemoryMB  = 512
	PremiumMaxMemoryMB  = 1024
	DefaultMaxCPU       = 0.5
	PremiumMaxCPU       = 1.0
	DefaultMaxPIDs      = 100
	DefaultTmpfsSizeMB  = 100
	MaxContainersPerUser = 1
)

// --- Types ---

// LabDefinition defines the configuration for a specific lab challenge.
type LabDefinition struct {
	ID              string            `json:"id"`
	ModuleID        string            `json:"module_id"`
	DockerImage     string            `json:"docker_image"`
	FlagHash        string            `json:"-"` // SHA-256 hash of the correct flag
	Difficulty      string            `json:"difficulty"`
	AccessTier      string            `json:"access_tier"` // "free" or "premium"
	MaxDurationSec  int               `json:"max_duration_seconds"`
	MaxMemoryMB     int               `json:"max_memory_mb"`
	MaxCPU          float64           `json:"max_cpu"`
	EnvironmentVars map[string]string `json:"environment_vars,omitempty"`
}

// LabSession represents an active lab container session.
type LabSession struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	LabID        string    `json:"lab_id"`
	ContainerID  string    `json:"container_id"`
	ContainerIP  string    `json:"container_ip"`
	NetworkID    string    `json:"network_id"`
	Status       string    `json:"status"` // provisioning, running, completed, expired, error
	WSEndpoint   string    `json:"ws_endpoint,omitempty"`
	SessionToken string    `json:"session_token,omitempty"`
	StartedAt    time.Time `json:"started_at"`
	ExpiresAt    time.Time `json:"expires_at"`
	EndedAt      *time.Time `json:"ended_at,omitempty"`
}

// ContainerConfig holds the security-hardened container configuration.
type ContainerConfig struct {
	Image           string
	Runtime         string // "runsc" for gVisor
	NetworkMode     string
	ReadonlyRootfs  bool
	TmpfsSizeMB     int
	MaxMemoryBytes  int64
	MaxCPUs         float64
	MaxPIDs         int64
	CapDrop         []string
	CapAdd          []string
	SecurityOpt     []string
	Env             []string
	Labels          map[string]string
	DNS             []string
}

// --- Orchestrator ---

// Orchestrator manages lab container lifecycles.
type Orchestrator struct {
	mu           sync.RWMutex
	sessions     map[string]*LabSession // sessionID -> session
	userSessions map[string]string      // userID -> sessionID (enforce 1 container per user)
	labs         map[string]*LabDefinition
}

// NewOrchestrator creates a new lab orchestrator.
func NewOrchestrator() *Orchestrator {
	o := &Orchestrator{
		sessions:     make(map[string]*LabSession),
		userSessions: make(map[string]string),
		labs:         make(map[string]*LabDefinition),
	}

	// Start background cleanup goroutine
	go o.cleanupExpiredSessions()

	return o
}

// StartLab provisions a new isolated container for a user's lab session.
// Returns the session details including WebSocket endpoint for terminal access.
//
// Security checks performed:
// 1. Verify user doesn't already have an active container
// 2. Verify lab exists and user has access (tier check)
// 3. Create isolated network
// 4. Launch container with hardened security configuration
// 5. Set TTL and idle detection timers
func (o *Orchestrator) StartLab(ctx context.Context, userID, labID, userTier string) (*LabSession, error) {
	o.mu.Lock()
	defer o.mu.Unlock()

	// 1. Check for existing active session
	if existingSessionID, exists := o.userSessions[userID]; exists {
		session := o.sessions[existingSessionID]
		if session != nil && session.Status == "running" {
			return nil, fmt.Errorf("user already has an active lab session (id: %s)", existingSessionID)
		}
	}

	// 2. Validate lab exists and check access tier
	lab, exists := o.labs[labID]
	if !exists {
		return nil, fmt.Errorf("lab not found: %s", labID)
	}

	if lab.AccessTier == "premium" && userTier != "premium" {
		return nil, fmt.Errorf("premium subscription required for this lab")
	}

	// 3. Determine resource limits based on tier
	maxDuration := DefaultMaxDuration
	maxMemory := DefaultMaxMemoryMB
	maxCPU := DefaultMaxCPU
	if userTier == "premium" {
		maxDuration = PremiumMaxDuration
		maxMemory = PremiumMaxMemoryMB
		maxCPU = PremiumMaxCPU
	}

	// 4. Build security-hardened container config
	sessionID := uuid.New().String()
	sessionToken := uuid.New().String()
	networkName := fmt.Sprintf("lab-net-%s", sessionID[:8])

	config := &ContainerConfig{
		Image:          lab.DockerImage,
		Runtime:        "runsc",           // gVisor sandbox runtime
		NetworkMode:    networkName,
		ReadonlyRootfs: true,              // Immutable root filesystem
		TmpfsSizeMB:    DefaultTmpfsSizeMB, // Writable /tmp with size limit
		MaxMemoryBytes: int64(maxMemory) * 1024 * 1024,
		MaxCPUs:        maxCPU,
		MaxPIDs:        DefaultMaxPIDs,

		// Drop ALL capabilities, add only what's strictly needed
		CapDrop: []string{"ALL"},
		CapAdd:  []string{"NET_BIND_SERVICE"},

		// Security profiles
		SecurityOpt: []string{
			"no-new-privileges:true",           // Prevent privilege escalation
			"seccomp=mayleneee-lab-seccomp.json", // Custom restrictive seccomp profile
			"apparmor=mayleneee-lab-apparmor",   // AppArmor enforcement
		},

		// Environment variables (inject lab-specific config)
		Env: buildEnvVars(lab, sessionID),

		// Container labels for management
		Labels: map[string]string{
			"mayleneee.lab.session":  sessionID,
			"mayleneee.lab.user":     userID,
			"mayleneee.lab.id":       labID,
			"mayleneee.lab.tier":     userTier,
			"mayleneee.managed":      "true",
		},

		// Restrict DNS to internal resolver only
		DNS: []string{"10.0.0.2"},
	}

	// 5. Provision container (Docker API call)
	containerID, containerIP, err := o.provisionContainer(ctx, config, networkName)
	if err != nil {
		log.Printf("[ERROR] Container provisioning failed for user=%s lab=%s: %v", userID, labID, err)
		return nil, fmt.Errorf("failed to start lab environment")
	}

	// 6. Create session record
	now := time.Now()
	session := &LabSession{
		ID:           sessionID,
		UserID:       userID,
		LabID:        labID,
		ContainerID:  containerID,
		ContainerIP:  containerIP,
		NetworkID:    networkName,
		Status:       "running",
		WSEndpoint:   fmt.Sprintf("/ws/lab/%s", sessionToken),
		SessionToken: sessionToken,
		StartedAt:    now,
		ExpiresAt:    now.Add(maxDuration),
	}

	o.sessions[sessionID] = session
	o.userSessions[userID] = sessionID

	log.Printf("[INFO] Lab started: session=%s user=%s lab=%s container=%s expires=%s",
		sessionID, userID, labID, containerID[:12], session.ExpiresAt.Format(time.RFC3339))

	return session, nil
}

// StopLab terminates a user's active lab session and cleans up resources.
func (o *Orchestrator) StopLab(ctx context.Context, userID, sessionID string) error {
	o.mu.Lock()
	defer o.mu.Unlock()

	session, exists := o.sessions[sessionID]
	if !exists {
		return fmt.Errorf("session not found: %s", sessionID)
	}

	// BOLA check: ensure the session belongs to this user
	if session.UserID != userID {
		log.Printf("[SECURITY] BOLA attempt on lab stop: user=%s tried to stop session=%s owned by user=%s",
			userID, sessionID, session.UserID)
		return fmt.Errorf("forbidden")
	}

	return o.teardownSession(ctx, session)
}

// --- Internal Methods ---

// provisionContainer creates and starts a Docker container.
// In production, this calls the Docker Engine API directly.
func (o *Orchestrator) provisionContainer(ctx context.Context, config *ContainerConfig, networkName string) (string, string, error) {
	// IMPLEMENTATION NOTE:
	// In production, this function:
	//
	// 1. Creates an isolated Docker network:
	//    docker network create --driver bridge --internal --subnet 172.{session}.0.0/24 {networkName}
	//
	// 2. Creates the container with the hardened config:
	//    docker create \
	//      --runtime=runsc \
	//      --network={networkName} \
	//      --read-only \
	//      --tmpfs /tmp:rw,size={tmpfsSizeMB}m,noexec,nosuid \
	//      --memory={maxMemory} \
	//      --cpus={maxCPU} \
	//      --pids-limit={maxPIDs} \
	//      --cap-drop=ALL \
	//      --cap-add=NET_BIND_SERVICE \
	//      --security-opt no-new-privileges:true \
	//      --security-opt seccomp={profile} \
	//      --security-opt apparmor={profile} \
	//      --dns 10.0.0.2 \
	//      --label mayleneee.managed=true \
	//      {image}
	//
	// 3. Starts the container
	// 4. Returns the container ID and internal IP

	// Placeholder for demonstration
	containerID := fmt.Sprintf("sha256:%s", uuid.New().String())
	containerIP := "172.18.0.2"

	log.Printf("[INFO] Container provisioned: image=%s runtime=%s readonly=%v mem=%dB cpu=%.1f pids=%d",
		config.Image, config.Runtime, config.ReadonlyRootfs,
		config.MaxMemoryBytes, config.MaxCPUs, config.MaxPIDs)

	return containerID, containerIP, nil
}

// teardownSession stops and removes a container and its network.
func (o *Orchestrator) teardownSession(ctx context.Context, session *LabSession) error {
	now := time.Now()
	session.Status = "completed"
	session.EndedAt = &now

	// Remove user -> session mapping
	delete(o.userSessions, session.UserID)

	// In production:
	// 1. docker stop {containerID} --time 10
	// 2. docker rm {containerID}
	// 3. docker network rm {networkID}

	log.Printf("[INFO] Lab stopped: session=%s user=%s container=%s duration=%s",
		session.ID, session.UserID, session.ContainerID[:12],
		now.Sub(session.StartedAt).Round(time.Second))

	return nil
}

// cleanupExpiredSessions runs in the background to terminate expired sessions.
func (o *Orchestrator) cleanupExpiredSessions() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		o.mu.Lock()
		now := time.Now()
		for id, session := range o.sessions {
			if session.Status == "running" && now.After(session.ExpiresAt) {
				log.Printf("[INFO] Session expired: session=%s user=%s", id, session.UserID)
				o.teardownSession(context.Background(), session)
				session.Status = "expired"
			}
		}
		o.mu.Unlock()
	}
}

// buildEnvVars creates the environment variable list for a lab container.
func buildEnvVars(lab *LabDefinition, sessionID string) []string {
	env := []string{
		fmt.Sprintf("LAB_SESSION_ID=%s", sessionID),
		fmt.Sprintf("LAB_ID=%s", lab.ID),
		"TERM=xterm-256color",
		"LANG=en_US.UTF-8",
	}

	for k, v := range lab.EnvironmentVars {
		env = append(env, fmt.Sprintf("%s=%s", k, v))
	}

	return env
}
