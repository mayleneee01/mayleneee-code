package labs

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	DB     *pgxpool.Pool
	Logger *log.Logger
}

func NewHandler(db *pgxpool.Pool, logger *log.Logger) *Handler {
	return &Handler{
		DB:     db,
		Logger: logger,
	}
}

type ExecuteRequest struct {
	Command string `json:"command"` // Input for hacking, or code for programming
	LabType string `json:"lab_type"` // "hacking" or "programming"
}

type ExecuteResponse struct {
	Output  string `json:"output"`
	Success bool   `json:"success"`
}

func (h *Handler) ExecuteCommand(w http.ResponseWriter, r *http.Request) {
	labID := chi.URLParam(r, "labID")
	w.Header().Set("Content-Type", "application/json")

	var req ExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON body"})
		return
	}

	req.Command = strings.TrimSpace(req.Command)
	var resp ExecuteResponse

	// Fake delay to simulate execution
	time.Sleep(500 * time.Millisecond)

	if req.LabType == "hacking" {
		resp = handleHackingTerminal(labID, req.Command)
	} else if req.LabType == "programming" {
		resp = handleProgrammingExecution(labID, req.Command)
	} else {
		resp = ExecuteResponse{Output: "bash: unknown lab type", Success: false}
	}

	// Wait, if success, we should ideally mark the lab as solved in user_progress.
	// For simplicity of this pseudo-terminal simulation, we just return the flag.

	json.NewEncoder(w).Encode(resp)
}

func handleHackingTerminal(labID, command string) ExecuteResponse {
	// A simple pseudo-terminal state machine.
	// In reality, this could be tied to Docker containers or real bash.
	cmdParts := strings.Fields(command)
	if len(cmdParts) == 0 {
		return ExecuteResponse{Output: "", Success: false}
	}

	baseCmd := cmdParts[0]
	switch baseCmd {
	case "ls":
		return ExecuteResponse{Output: "flag.txt\nreadme.md\nsecret_folder", Success: false}
	case "whoami":
		return ExecuteResponse{Output: "root", Success: false}
	case "pwd":
		return ExecuteResponse{Output: "/home/hacker", Success: false}
	case "cat":
		if len(cmdParts) > 1 && cmdParts[1] == "flag.txt" {
			// Generate the MC{...} flag based on labID
			flag := fmt.Sprintf("MC{h4ck3d_%s_s0_3z}", strings.ReplaceAll(labID, "-", "_"))
			return ExecuteResponse{Output: flag + "\n\nCongratulations! You found the flag.", Success: true}
		}
		if len(cmdParts) > 1 {
			return ExecuteResponse{Output: "cat: " + cmdParts[1] + ": Permission denied", Success: false}
		}
		return ExecuteResponse{Output: "cat: missing file operand", Success: false}
	case "echo":
		return ExecuteResponse{Output: strings.Join(cmdParts[1:], " "), Success: false}
	default:
		return ExecuteResponse{Output: fmt.Sprintf("bash: %s: command not found", baseCmd), Success: false}
	}
}

func handleProgrammingExecution(labID, code string) ExecuteResponse {
	// Simulate "Fill in the Blanks" evaluation
	// E.g., user is expected to type exactly `print("Hello World")` or similar.
	
	if code == "" {
		return ExecuteResponse{Output: "Error: No code provided.", Success: false}
	}

	// Just a simple heuristic for demonstration:
	if strings.Contains(code, "print") || strings.Contains(code, "fmt.Println") || strings.Contains(code, "console.log") {
		flag := fmt.Sprintf("MC{c0d3d_%s_p3rf3ctly}", strings.ReplaceAll(labID, "-", "_"))
		output := "Output:\nHello World!\n\nExecution Successful!\nFlag: " + flag
		return ExecuteResponse{Output: output, Success: true}
	}

	return ExecuteResponse{
		Output: "Compilation/Syntax Error or Incorrect Output.\nTry again!",
		Success: false,
	}
}
