package admin

import (
	"encoding/json"
	"net/http"

	"mayleneee-code/backend/internal/db"
	"mayleneee-code/backend/internal/modules"
)

func HandleCreateModule(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	var m modules.Module
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Insert into DB
	_, err := db.Pool.Exec(r.Context(), `
		INSERT INTO modules (id, title, description, category, difficulty, access_tier, points_reward, order_index, is_published)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, m.ID, m.Title, m.Description, m.Category, m.Difficulty, m.AccessTier, m.PointsReward, m.OrderIndex, m.IsPublished)

	if err != nil {
		http.Error(w, `{"error":"Failed to create module: `+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Module created"})
}

// In a real application you would define structs for incoming payloads.
type CreateLabRequest struct {
	ID                 string  `json:"id"`
	ModuleID           string  `json:"moduleId"`
	Title              string  `json:"title"`
	Description        string  `json:"description"`
	DockerImage        string  `json:"dockerImage"`
	FlagHash           string  `json:"flagHash"`
	Hint               string  `json:"hint"`
	HintCost           int     `json:"hintCost"`
	MaxDurationSeconds int     `json:"maxDurationSeconds"`
	MaxMemoryMB        int     `json:"maxMemoryMb"`
	MaxCPU             float64 `json:"maxCpu"`
}

func HandleCreateLab(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	var req CreateLabRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Insert into DB
	_, err := db.Pool.Exec(r.Context(), `
		INSERT INTO labs (id, module_id, title, description, docker_image, flag_hash, hint, hint_cost, max_duration_seconds, max_memory_mb, max_cpu)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`, req.ID, req.ModuleID, req.Title, req.Description, req.DockerImage, req.FlagHash, req.Hint, req.HintCost, req.MaxDurationSeconds, req.MaxMemoryMB, req.MaxCPU)

	if err != nil {
		http.Error(w, `{"error":"Failed to create lab: `+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Lab created"})
}
