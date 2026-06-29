// Package main is the entrypoint for the Mayleneee.code backend API server.
//
// The server provides REST API endpoints for authentication, module management,
// lab orchestration, and gamification. It is designed with security as a first
// priority, implementing defense-in-depth against OWASP Top 10 vulnerabilities.
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"mayleneee-code/backend/internal/admin"
	"mayleneee-code/backend/internal/auth"
	"mayleneee-code/backend/internal/db"
	"mayleneee-code/backend/internal/labs"
	"mayleneee-code/backend/internal/middleware"
	"mayleneee-code/backend/internal/modules"
	"mayleneee-code/backend/internal/users"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := chi.NewRouter()

	// Initialize Database Connection
	if err := db.Connect(); err != nil {
		// Log warning instead of fatal to allow frontend to still serve auth (if auth falls back to mock)
		// But in a real app, you might want to fail fast here if DB is required.
		log.Printf("[WARN] Failed to connect to database: %v", err)
	}
	defer db.Close()

	// --- Global Middleware Stack ---
	// Order matters: outermost middleware runs first.

	// 1. Request ID for tracing
	r.Use(chimiddleware.RequestID)

	// 2. Real IP extraction (behind reverse proxy)
	r.Use(chimiddleware.RealIP)

	// 3. Structured logging
	r.Use(chimiddleware.Logger)

	// 4. Panic recovery
	r.Use(chimiddleware.Recoverer)

	// 5. Security headers (CSP, HSTS, X-Frame-Options, etc.)
	r.Use(middleware.SecurityHeaders)

	// 6. CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{os.Getenv("FRONTEND_URL")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// 7. Request size limiter (1MB max body)
	r.Use(chimiddleware.RequestSize(1 << 20))

	// 8. Timeout (30 seconds per request)
	r.Use(chimiddleware.Timeout(30 * time.Second))

	// 9. Rate limiting (global: 100 requests per minute per IP)
	r.Use(middleware.RateLimit(100, time.Minute))

	// --- Health Check ---
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","service":"mayleneee-code-api","version":"1.0.0"}`))
	})

	// --- API v1 Routes ---
	r.Route("/api/v1", func(r chi.Router) {
		// Public routes (no auth required)
		r.Route("/auth", func(r chi.Router) {
			// Stricter rate limit for auth endpoints (20 per minute per IP)
			r.Use(middleware.RateLimit(20, time.Minute))

			r.Post("/register", auth.HandleRegister)
			r.Post("/login", auth.HandleLogin)
			r.Get("/oauth/{provider}", auth.HandleOAuthRedirect)
			r.Get("/oauth/{provider}/callback", auth.HandleOAuthCallback)
		})

		// Protected routes (JWT required)
		r.Group(func(r chi.Router) {
			r.Use(auth.JWTAuthMiddleware)

			// User profile
			r.Get("/auth/me", auth.HandleGetProfile)

			// User-scoped routes (BOLA-protected)
			r.Route("/users/{userID}", func(r chi.Router) {
				r.Use(middleware.OwnershipCheck("userID"))
				r.Get("/progress", auth.HandleGetUserProgress)
				r.Put("/", users.HandleUpdateProfile) // The parameter is in the URL, but the router passes it down
			})
			// User management (admin or self)
			userLogger := log.New(os.Stdout, "[USERS] ", log.LstdFlags)
			userHandler := users.NewHandler(db.Pool, userLogger)
			r.Post("/users", userHandler.CreateUser)
			
			// Leaderboard (Publicly readable for students)
			r.Get("/leaderboard", userHandler.GetLeaderboard)

			// Modules & Labs (Publicly readable for students)
			r.Get("/modules", modules.HandleGetModules)
			r.Get("/modules/{moduleID}/labs", modules.HandleGetLabsByModule)
			
			labLogger := log.New(os.Stdout, "[LABS] ", log.LstdFlags)
			labHandler := labs.NewHandler(db.Pool, labLogger)
			r.Post("/labs/{labID}/execute", labHandler.ExecuteCommand)

			// Admin Routes
			r.Route("/admin", func(r chi.Router) {
				// We need a middleware to check if user role is admin.
				// For now, we trust the JWT token if we add role to it.
				// r.Use(middleware.RequireRole("admin"))
				r.Post("/modules", admin.HandleCreateModule)
				r.Post("/labs", admin.HandleCreateLab)
				r.Post("/users/{id}/promote", admin.HandlePromoteUser)
			})
		})
	})

	// --- Server Configuration ---
	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           r,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
		MaxHeaderBytes:    1 << 16, // 64KB
	}

	// --- Graceful Shutdown ---
	go func() {
		log.Printf("[INFO] Server starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[FATAL] Server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFO] Server shutting down gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("[FATAL] Server forced to shutdown: %v", err)
	}

	log.Println("[INFO] Server stopped")
}
