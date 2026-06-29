package admin

import (
	"encoding/json"
	"net/http"

	"mayleneee-code/backend/internal/db"

	"github.com/go-chi/chi/v5"
)

func HandlePromoteUser(w http.ResponseWriter, r *http.Request) {
	if db.Pool == nil {
		http.Error(w, `{"error":"Database not connected"}`, http.StatusInternalServerError)
		return
	}

	userID := chi.URLParam(r, "id")
	if userID == "" {
		http.Error(w, `{"error":"User ID is required"}`, http.StatusBadRequest)
		return
	}

	_, err := db.Pool.Exec(r.Context(), `
		UPDATE users 
		SET role = 'admin'
		WHERE id = $1
	`, userID)

	if err != nil {
		http.Error(w, `{"error":"Failed to promote user: `+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "success",
		"message": "User promoted to admin successfully",
	})
}
