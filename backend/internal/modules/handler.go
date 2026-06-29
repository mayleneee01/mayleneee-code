package modules

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"mayleneee-code/backend/internal/db"
)

type Module struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	Category     string    `json:"category"`
	Difficulty   string    `json:"difficulty"`
	AccessTier   string    `json:"accessTier"`
	PointsReward int       `json:"pointsReward"`
	OrderIndex   int       `json:"orderIndex"`
	IsPublished  bool      `json:"isPublished"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Lab struct {
	ID                 string    `json:"id"`
	ModuleID           string    `json:"moduleId"`
	Title              string    `json:"title"`
	Description        string    `json:"description"`
	Hint               string    `json:"hint,omitempty"` // Hiding flagHash and dockerImage for security
	HintCost           int       `json:"hintCost"`
	MaxDurationSeconds int       `json:"maxDurationSeconds"`
	CreatedAt          time.Time `json:"createdAt"`
}

func HandleGetModules(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	rows, err := db.Pool.Query(r.Context(), `
		SELECT id, title, description, category, difficulty, access_tier, points_reward, order_index, is_published, created_at
		FROM modules
		WHERE is_published = true
		ORDER BY order_index ASC
	`)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch modules"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var modules []Module
	for rows.Next() {
		var m Module
		if err := rows.Scan(&m.ID, &m.Title, &m.Description, &m.Category, &m.Difficulty, &m.AccessTier, &m.PointsReward, &m.OrderIndex, &m.IsPublished, &m.CreatedAt); err != nil {
			http.Error(w, `{"error":"Failed to parse modules"}`, http.StatusInternalServerError)
			return
		}
		modules = append(modules, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(modules)
}

func HandleGetLabsByModule(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	moduleID := chi.URLParam(r, "moduleID")

	rows, err := db.Pool.Query(r.Context(), `
		SELECT id, module_id, title, description, hint, hint_cost, max_duration_seconds, created_at
		FROM labs
		WHERE module_id = $1
	`, moduleID)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch labs"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var labs []Lab
	for rows.Next() {
		var l Lab
		if err := rows.Scan(&l.ID, &l.ModuleID, &l.Title, &l.Description, &l.Hint, &l.HintCost, &l.MaxDurationSeconds, &l.CreatedAt); err != nil {
			http.Error(w, `{"error":"Failed to parse labs"}`, http.StatusInternalServerError)
			return
		}
		labs = append(labs, l)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(labs)
}
