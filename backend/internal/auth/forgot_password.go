package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"mayleneee-code/backend/internal/db"
)

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

// HandleForgotPassword generates a password reset token and "sends" it (logs to console if no SMTP).
func HandleForgotPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid_request", "message": "Invalid JSON body"})
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "validation_error", "message": "Email is required"})
		return
	}

	// Check if user exists
	var userID string
	var displayName string
	err := db.Pool.QueryRow(context.Background(),
		`SELECT id, display_name FROM users WHERE email = $1 AND is_active = true`, req.Email,
	).Scan(&userID, &displayName)

	// Always return 200 to prevent email enumeration attacks
	w.WriteHeader(http.StatusOK)

	if err != nil {
		// User not found — still return success (security best practice)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "sent",
			"message": "If that email is registered, you will receive a reset link shortly.",
		})
		return
	}

	// Generate secure random token
	tokenBytes := make([]byte, 32)
	rand.Read(tokenBytes)
	token := hex.EncodeToString(tokenBytes)
	expiresAt := time.Now().Add(1 * time.Hour)

	// Store token in password_resets table
	_, err = db.Pool.Exec(context.Background(), `
		INSERT INTO password_resets (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3, created_at = NOW()
	`, userID, token, expiresAt)

	if err != nil {
		log.Printf("[WARN] Failed to store reset token for %s: %v", req.Email, err)
		// Still return success
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "sent",
			"message": "If that email is registered, you will receive a reset link shortly.",
		})
		return
	}

	// Log the reset link (in production this would be emailed via SMTP/SendGrid)
	frontendURL := "https://mayleneee-code.vercel.app"
	resetLink := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, token)
	log.Printf("[RESET PASSWORD] User: %s (%s) | Link: %s", displayName, req.Email, resetLink)

	json.NewEncoder(w).Encode(map[string]string{
		"status":  "sent",
		"message": "If that email is registered, you will receive a reset link shortly.",
		// Only include in dev for testing — remove in production
		"dev_token": token,
		"dev_link":  resetLink,
	})
}

// HandleResetPassword validates the token and sets a new password.
func HandleResetPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid_request", "message": "Invalid JSON body"})
		return
	}

	req.Token = strings.TrimSpace(req.Token)
	req.Password = strings.TrimSpace(req.Password)

	if req.Token == "" || req.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "validation_error", "message": "Token and new password are required"})
		return
	}

	if len(req.Password) < 8 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "validation_error", "message": "Password must be at least 8 characters"})
		return
	}

	// Look up token
	var userID string
	var expiresAt time.Time
	err := db.Pool.QueryRow(context.Background(),
		`SELECT user_id, expires_at FROM password_resets WHERE token = $1`, req.Token,
	).Scan(&userID, &expiresAt)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid_token", "message": "Reset link is invalid or has expired"})
		return
	}

	if time.Now().After(expiresAt) {
		// Clean up expired token
		db.Pool.Exec(context.Background(), `DELETE FROM password_resets WHERE token = $1`, req.Token)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "expired_token", "message": "Reset link has expired. Please request a new one."})
		return
	}

	// Hash new password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "server_error", "message": "Failed to hash password"})
		return
	}

	// Update user password
	_, err = db.Pool.Exec(context.Background(),
		`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, string(hash), userID,
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "server_error", "message": "Failed to update password"})
		return
	}

	// Delete used token
	db.Pool.Exec(context.Background(), `DELETE FROM password_resets WHERE token = $1`, req.Token)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Password has been reset successfully. You can now log in.",
	})
}
