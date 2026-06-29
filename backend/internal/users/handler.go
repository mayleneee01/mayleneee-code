package users

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

// ==========================================
// Handler Struct
// ==========================================

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

// ==========================================
// Request & Response Structs
// ==========================================

type CreateUserRequest struct {
	Username    string `json:"username"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	Password    string `json:"password"`
	Locale      string `json:"locale"`
	Theme       string `json:"theme"`
}

type CreateUserResponse struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	Role        string `json:"role"`
	Tier        string `json:"tier"`
}

type ErrorResponse struct {
	Error   string            `json:"error"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}

// ==========================================
// Validation Helpers
// ==========================================

var (
	usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_]{3,30}$`)
	emailRegex    = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
)

func validateCreateUserRequest(req CreateUserRequest) map[string]string {
	fieldErrors := make(map[string]string)

	req.Username = strings.TrimSpace(req.Username)
	if req.Username == "" {
		fieldErrors["username"] = "username is required"
	} else if !usernameRegex.MatchString(req.Username) {
		fieldErrors["username"] = "username must be 3-30 chars, alphanumeric or underscore only"
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" {
		fieldErrors["email"] = "email is required"
	} else if !emailRegex.MatchString(req.Email) {
		fieldErrors["email"] = "invalid email format"
	}

	req.DisplayName = strings.TrimSpace(req.DisplayName)
	if req.DisplayName == "" {
		fieldErrors["display_name"] = "display_name is required"
	} else if utf8.RuneCountInString(req.DisplayName) > 100 {
		fieldErrors["display_name"] = "display_name must be 100 characters or less"
	}

	if req.Password == "" {
		fieldErrors["password"] = "password is required"
	} else if len(req.Password) < 8 {
		fieldErrors["password"] = "password must be at least 8 characters"
	}

	validLocales := map[string]bool{"en": true, "id": true, "ja": true}
	if req.Locale != "" && !validLocales[req.Locale] {
		fieldErrors["locale"] = "locale must be one of: en, id, ja"
	}

	if req.Theme != "" && req.Theme != "light" && req.Theme != "dark" {
		fieldErrors["theme"] = "theme must be 'light' or 'dark'"
	}

	return fieldErrors
}

// ==========================================
// Handler: POST /api/users
// ==========================================

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "bad_request", "Invalid JSON body")
		return
	}

	fieldErrors := validateCreateUserRequest(req)
	if len(fieldErrors) > 0 {
		writeValidationError(w, fieldErrors)
		return
	}

	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.DisplayName = strings.TrimSpace(req.DisplayName)
	if req.Locale == "" {
		req.Locale = "en"
	}
	if req.Theme == "" {
		req.Theme = "light"
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		h.Logger.Printf("[ERROR] bcrypt error: %v", err)
		writeError(w, http.StatusInternalServerError, "server_error", "Failed to process password")
		return
	}

	var newUserID string
	query := `
		INSERT INTO users (username, email, display_name, password_hash, locale, theme)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err = h.DB.QueryRow(
		r.Context(),
		query,
		req.Username,
		req.Email,
		req.DisplayName,
		string(passwordHash),
		req.Locale,
		req.Theme,
	).Scan(&newUserID)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case "23505": // unique_violation
				field := extractDuplicateField(pgErr.ConstraintName)
				writeError(w, http.StatusConflict, "conflict", field+" already exists")
				return
			case "23502": // not_null_violation
				writeError(w, http.StatusBadRequest, "bad_request", "Missing required field: "+pgErr.ColumnName)
				return
			case "23514": // check_violation
				writeError(w, http.StatusBadRequest, "bad_request", "Invalid value for field: "+pgErr.ConstraintName)
				return
			}
		}

		h.Logger.Printf("[ERROR] CreateUser DB error: %v", err)
		writeError(w, http.StatusInternalServerError, "server_error", "Failed to create user account")
		return
	}

	resp := CreateUserResponse{
		ID:          newUserID,
		Username:    req.Username,
		Email:       req.Email,
		DisplayName: req.DisplayName,
		Role:        "student",
		Tier:        "free",
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

// ==========================================
// Helpers
// ==========================================

func writeError(w http.ResponseWriter, status int, errCode, message string) {
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   errCode,
		Message: message,
	})
}

func writeValidationError(w http.ResponseWriter, fields map[string]string) {
	w.WriteHeader(http.StatusUnprocessableEntity)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   "validation_error",
		Message: "One or more fields are invalid",
		Fields:  fields,
	})
}

func extractDuplicateField(constraint string) string {
	if strings.Contains(constraint, "email") {
		return "email"
	}
	if strings.Contains(constraint, "username") {
		return "username"
	}
	if strings.Contains(constraint, "oauth") {
		return "oauth account"
	}
	return "field"
}
