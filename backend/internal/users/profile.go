package users

import (
	"encoding/json"
	"net/http"
	"strings"

	"mayleneee-code/backend/internal/db"

	"github.com/go-chi/chi/v5"
)

type UpdateProfileRequest struct {
	DisplayName string `json:"display_name"`
	Theme       string `json:"theme"`
}

func HandleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	userID := chi.URLParam(r, "userID")
	if userID == "" {
		http.Error(w, `{"error":"User ID is required"}`, http.StatusBadRequest)
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	req.DisplayName = strings.TrimSpace(req.DisplayName)
	if req.DisplayName == "" {
		http.Error(w, `{"error":"Display name cannot be empty"}`, http.StatusBadRequest)
		return
	}

	_, err := db.Pool.Exec(r.Context(), `
		UPDATE users 
		SET display_name = $1, theme = $2
		WHERE id = $3
	`, req.DisplayName, req.Theme, userID)

	if err != nil {
		http.Error(w, `{"error":"Failed to update profile: `+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "success",
		"message": "Profile updated successfully",
	})
}
