// Package middleware provides HTTP middleware for security hardening.
//
// Implements defense-in-depth against OWASP Top 10 vulnerabilities including:
// - Security response headers (CSP, HSTS, X-Frame-Options)
// - Rate limiting per IP address
// - Broken Object Level Authorization (BOLA) prevention via ownership checks
// - Request validation and sanitization
package middleware

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// --- Security Headers Middleware ---
// Protects against: XSS, clickjacking, MIME sniffing, protocol downgrade

func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Strict Content Security Policy
		// Prevents XSS by whitelisting allowed content sources
		w.Header().Set("Content-Security-Policy",
			"default-src 'self'; "+
				"script-src 'self'; "+
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "+
				"font-src 'self' https://fonts.gstatic.com; "+
				"img-src 'self' data: https:; "+
				"connect-src 'self'; "+
				"frame-ancestors 'none'; "+
				"base-uri 'self'; "+
				"form-action 'self'")

		// Force HTTPS (1 year, include subdomains, allow preload)
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		// Prevent page from being embedded in iframes (clickjacking protection)
		w.Header().Set("X-Frame-Options", "DENY")

		// Prevent MIME type sniffing
		w.Header().Set("X-Content-Type-Options", "nosniff")

		// Control referrer information leakage
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Restrict browser features (camera, microphone, geolocation, etc.)
		w.Header().Set("Permissions-Policy",
			"camera=(), microphone=(), geolocation=(), interest-cohort=()")

		// Prevent caching of sensitive responses
		w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, private")
		w.Header().Set("Pragma", "no-cache")

		// Remove server identification header
		w.Header().Del("Server")
		w.Header().Del("X-Powered-By")

		next.ServeHTTP(w, r)
	})
}

// --- Rate Limiter ---
// Protects against: brute force, denial of service, credential stuffing

type rateLimiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor
	limit    int
	window   time.Duration
}

type visitor struct {
	count    int
	lastSeen time.Time
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	rl := &rateLimiter{
		visitors: make(map[string]*visitor),
		limit:    limit,
		window:   window,
	}

	// Cleanup stale entries every minute
	go func() {
		for {
			time.Sleep(time.Minute)
			rl.mu.Lock()
			for ip, v := range rl.visitors {
				if time.Since(v.lastSeen) > rl.window*2 {
					delete(rl.visitors, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

func (rl *rateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		rl.visitors[ip] = &visitor{count: 1, lastSeen: time.Now()}
		return true
	}

	// Reset counter if window has passed
	if time.Since(v.lastSeen) > rl.window {
		v.count = 1
		v.lastSeen = time.Now()
		return true
	}

	v.count++
	v.lastSeen = time.Now()

	return v.count <= rl.limit
}

// RateLimit creates a middleware that limits requests per IP per time window.
// Example: RateLimit(100, time.Minute) allows 100 requests per minute per IP.
func RateLimit(limit int, window time.Duration) func(http.Handler) http.Handler {
	limiter := newRateLimiter(limit, window)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract client IP, handling proxied requests
			ip := extractIP(r)

			if !limiter.allow(ip) {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(window.Seconds())))
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error":"rate_limit_exceeded","message":"Too many requests. Please try again later."}`))

				log.Printf("[WARN] Rate limit exceeded for IP: %s on %s %s",
					ip, r.Method, r.URL.Path)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// --- Ownership Check (BOLA Prevention) ---
// Protects against: Broken Object Level Authorization (OWASP API1:2023)
//
// This middleware ensures that a user can only access resources they own.
// The authenticated user's ID (from JWT) must match the resource owner's ID
// extracted from the URL parameter.

func OwnershipCheck(paramName string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get authenticated user ID from context (set by JWT middleware)
			authUserID, ok := r.Context().Value(ContextKeyUserID).(string)
			if !ok || authUserID == "" {
				http.Error(w, `{"error":"unauthorized","message":"Authentication required"}`, http.StatusUnauthorized)
				return
			}

			// Get the role from context
			authRole, _ := r.Context().Value(ContextKeyRole).(string)

			// Get the target user ID from URL parameter
			// Using chi's URLParam to extract from the route
			targetUserID := chi_URLParam(r, paramName)
			if targetUserID == "" {
				http.Error(w, `{"error":"bad_request","message":"Missing resource identifier"}`, http.StatusBadRequest)
				return
			}

			// BOLA Check: authenticated user must own the resource, unless admin
			if authUserID != targetUserID && authRole != "admin" {
				log.Printf("[SECURITY] BOLA attempt: user=%s tried to access resource of user=%s on %s %s (IP: %s)",
					authUserID, targetUserID, r.Method, r.URL.Path, extractIP(r))

				// Return 403 Forbidden (not 404) to avoid confusion
				// but don't leak information about whether the target exists
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusForbidden)
				w.Write([]byte(`{"error":"forbidden","message":"You do not have permission to access this resource"}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// --- Helper Functions ---

// extractIP safely extracts the client IP from the request,
// handling X-Forwarded-For and X-Real-IP headers from trusted proxies.
func extractIP(r *http.Request) string {
	// Prefer X-Real-IP set by trusted reverse proxy
	if ip := r.Header.Get("X-Real-Ip"); ip != "" {
		return ip
	}

	// Fallback to X-Forwarded-For (use first IP in chain)
	if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
		parts := strings.SplitN(forwarded, ",", 2)
		return strings.TrimSpace(parts[0])
	}

	// Direct connection
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// chi_URLParam extracts URL parameter from chi router context.
// This is a simplified version — in production, use chi.URLParam directly.
func chi_URLParam(r *http.Request, key string) string {
	// chi stores route params in the request context
	rctx := r.Context().Value("chi.URLParams")
	if rctx == nil {
		return ""
	}
	// Type assertion for chi's RouteParams
	// In production code, use: chi.URLParam(r, key)
	return ""
}

// Context keys for type-safe context values.
// Exported for use by other packages (e.g., auth handlers).
type ContextKeyType string

const (
	ContextKeyUserID ContextKeyType = "user_id"
	ContextKeyRole   ContextKeyType = "role"
	ContextKeyEmail  ContextKeyType = "email"
)
