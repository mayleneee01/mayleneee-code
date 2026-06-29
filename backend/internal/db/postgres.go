package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

// Connect initializes the PostgreSQL connection pool.
// It expects the DB_URL environment variable to be set.
func Connect() error {
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		return fmt.Errorf("DB_URL environment variable is not set")
	}

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return fmt.Errorf("error parsing DB_URL: %w", err)
	}

	// Connect to the database
	ctx := context.Background()
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return fmt.Errorf("error connecting to database: %w", err)
	}

	// Test the connection
	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("error pinging database: %w", err)
	}

	Pool = pool
	log.Println("Successfully connected to PostgreSQL database")
	return nil
}

// Close gracefully closes the database connection pool.
func Close() {
	if Pool != nil {
		Pool.Close()
		log.Println("Database connection closed")
	}
}
