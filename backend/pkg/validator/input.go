// Package validator provides strict input validation utilities.
//
// All user-supplied input MUST pass through these validators before
// being used in database queries, API responses, or container configuration.
// This prevents injection attacks (SQL, XSS, command injection) at the
// application boundary.
package validator

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"github.com/microcosm-cc/bluemonday"
)

var (
	// Strict sanitizer that strips ALL HTML tags
	strictSanitizer = bluemonday.StrictPolicy()

	// Regex patterns for input validation
	emailRegex    = regexp.MustCompile(`^[a-zA-Z0-9.!#$%&'*+/=?^_` + "`" + `{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`)
	usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_-]{3,30}$`)
	uuidRegex     = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`)
	slugRegex     = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

	// Blocked patterns for command injection prevention
	dangerousPatterns = []string{
		"$(", "`", "&&", "||", ";", "|", ">", "<", "\n", "\r",
		"../", "..\\", "%00", "\x00",
	}
)

// --- Text Sanitization ---

// SanitizeText strips all HTML tags and trims whitespace.
// Use for all user-submitted text fields (usernames, display names, etc.)
func SanitizeText(input string) string {
	sanitized := strictSanitizer.Sanitize(input)
	return strings.TrimSpace(sanitized)
}

// SanitizeAndLimit sanitizes text and enforces a maximum length.
func SanitizeAndLimit(input string, maxLen int) string {
	sanitized := SanitizeText(input)
	if len(sanitized) > maxLen {
		return sanitized[:maxLen]
	}
	return sanitized
}

// --- Validation Functions ---

// ValidateEmail checks if the email is valid and within length bounds.
func ValidateEmail(email string) error {
	email = strings.TrimSpace(strings.ToLower(email))
	if len(email) < 5 || len(email) > 254 {
		return fmt.Errorf("email must be between 5 and 254 characters")
	}
	if !emailRegex.MatchString(email) {
		return fmt.Errorf("invalid email format")
	}
	return nil
}

// ValidateUsername checks if the username matches allowed characters and length.
func ValidateUsername(username string) error {
	if !usernameRegex.MatchString(username) {
		return fmt.Errorf("username must be 3-30 characters, containing only letters, numbers, hyphens, and underscores")
	}
	return nil
}

// ValidateUUID checks if the string is a valid UUID v4 format.
func ValidateUUID(id string) error {
	if !uuidRegex.MatchString(strings.ToLower(id)) {
		return fmt.Errorf("invalid UUID format")
	}
	return nil
}

// ValidateSlug checks if the string is a valid URL slug.
func ValidateSlug(slug string) error {
	if len(slug) < 1 || len(slug) > 100 {
		return fmt.Errorf("slug must be 1-100 characters")
	}
	if !slugRegex.MatchString(slug) {
		return fmt.Errorf("invalid slug format")
	}
	return nil
}

// ValidatePassword enforces password strength requirements.
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}
	if len(password) > 128 {
		return fmt.Errorf("password must be at most 128 characters")
	}

	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, r := range password {
		switch {
		case unicode.IsUpper(r):
			hasUpper = true
		case unicode.IsLower(r):
			hasLower = true
		case unicode.IsDigit(r):
			hasDigit = true
		case unicode.IsPunct(r) || unicode.IsSymbol(r):
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasDigit || !hasSpecial {
		return fmt.Errorf("password must contain uppercase, lowercase, digit, and special character")
	}

	return nil
}

// --- Security Validators ---

// IsSafeInput checks if the input contains potentially dangerous patterns
// that could be used for command injection, path traversal, or null byte attacks.
func IsSafeInput(input string) bool {
	lower := strings.ToLower(input)
	for _, pattern := range dangerousPatterns {
		if strings.Contains(lower, pattern) {
			return false
		}
	}
	return true
}

// ValidateLabFlag validates that a submitted flag is in a safe format.
// Flags should be alphanumeric with optional braces and underscores.
// Example valid flags: FLAG{example_flag_123}, HTB{s0m3_fl4g}
func ValidateLabFlag(flag string) error {
	flag = strings.TrimSpace(flag)
	if len(flag) < 3 || len(flag) > 256 {
		return fmt.Errorf("flag must be 3-256 characters")
	}

	// Ensure no dangerous characters
	if !IsSafeInput(flag) {
		return fmt.Errorf("flag contains invalid characters")
	}

	return nil
}

// ValidateLocale checks if the locale code is from the allowed list.
func ValidateLocale(locale string) error {
	allowed := map[string]bool{
		"en": true, "id": true, "ja": true, "ko": true,
		"zh": true, "es": true, "fr": true, "de": true,
		"pt": true, "ar": true, "hi": true, "ru": true,
	}
	if !allowed[locale] {
		return fmt.Errorf("unsupported locale: %s", locale)
	}
	return nil
}

// ValidateTheme checks if the theme is valid.
func ValidateTheme(theme string) error {
	if theme != "light" && theme != "dark" {
		return fmt.Errorf("theme must be 'light' or 'dark'")
	}
	return nil
}

// ValidatePagination validates page and limit parameters.
func ValidatePagination(page, limit int) error {
	if page < 1 {
		return fmt.Errorf("page must be >= 1")
	}
	if limit < 1 || limit > 100 {
		return fmt.Errorf("limit must be between 1 and 100")
	}
	return nil
}
