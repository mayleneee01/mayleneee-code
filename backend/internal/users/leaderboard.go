package users

import (
	"encoding/json"
	"net/http"
)

type LeaderboardEntry struct {
	UserID           string `json:"user_id"`
	Username         string `json:"username"`
	DisplayName      string `json:"display_name"`
	AvatarURL        string `json:"avatar_url"`
	TotalPoints      int    `json:"total_points"`
	ModulesCompleted int    `json:"modules_completed"`
}

func (h *Handler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Limit to top 50 users
	query := `
		SELECT user_id, username, display_name, COALESCE(avatar_url, ''), total_points, modules_completed
		FROM leaderboard
		ORDER BY total_points DESC, modules_completed DESC
		LIMIT 50
	`
	rows, err := h.DB.Query(r.Context(), query)
	if err != nil {
		h.Logger.Printf("[ERROR] Failed to fetch leaderboard: %v", err)
		writeError(w, http.StatusInternalServerError, "server_error", "Failed to fetch leaderboard")
		return
	}
	defer rows.Close()

	var leaderboard []LeaderboardEntry
	for rows.Next() {
		var entry LeaderboardEntry
		if err := rows.Scan(&entry.UserID, &entry.Username, &entry.DisplayName, &entry.AvatarURL, &entry.TotalPoints, &entry.ModulesCompleted); err != nil {
			h.Logger.Printf("[ERROR] Failed to scan leaderboard row: %v", err)
			continue
		}
		leaderboard = append(leaderboard, entry)
	}

	if leaderboard == nil {
		leaderboard = []LeaderboardEntry{}
	}

	json.NewEncoder(w).Encode(leaderboard)
}
