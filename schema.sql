-- ==========================================
-- Mayleneee.code Database Schema (PostgreSQL)
-- ==========================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    password_hash VARCHAR(255) NOT NULL,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CONSTRAINT chk_users_role CHECK (role IN ('student', 'instructor', 'admin', 'super_admin')),
    tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'enterprise')),
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    theme VARCHAR(10) NOT NULL DEFAULT 'light',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL AND oauth_id IS NOT NULL;
-- ==========================================
-- MODULES TABLE (Learning Paths)
-- ==========================================
CREATE TABLE modules (
    id VARCHAR(50) PRIMARY KEY,
    -- e.g., 'html-basics', 'sql-injection'
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('coding', 'asd', 'hacking')),
    difficulty VARCHAR(20) NOT NULL CHECK (
        difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')
    ),
    access_tier VARCHAR(20) NOT NULL DEFAULT 'free',
    points_reward INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_modules_category ON modules(category);
-- ==========================================
-- LABS TABLE (Containerized Challenges)
-- ==========================================
CREATE TABLE labs (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    docker_image VARCHAR(255) NOT NULL,
    flag_hash VARCHAR(255) NOT NULL,
    -- SHA-256 of the flag
    hint TEXT,
    hint_cost INTEGER DEFAULT 0,
    -- Points deducted for using hint
    max_duration_seconds INTEGER DEFAULT 7200,
    max_memory_mb INTEGER DEFAULT 512,
    max_cpu NUMERIC(3, 1) DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_labs_module_id ON labs(module_id);
-- ==========================================
-- USER PROGRESS TABLE
-- ==========================================
CREATE TABLE user_progress (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(50) REFERENCES modules(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (
        status IN ('not_started', 'in_progress', 'completed')
    ),
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, module_id)
);
-- ==========================================
-- LAB SESSIONS TABLE (Audit Log / Active)
-- ==========================================
CREATE TABLE lab_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lab_id VARCHAR(50) REFERENCES labs(id) ON DELETE CASCADE,
    container_id VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'provisioning',
            'running',
            'completed',
            'expired',
            'error'
        )
    ),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_lab_sessions_user_status ON lab_sessions(user_id, status);
-- ==========================================
-- GLOBAL LEADERBOARD VIEW
-- ==========================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT u.id AS user_id,
    u.username,
    u.display_name,
    u.avatar_url,
    COALESCE(SUM(up.score), 0) AS total_points,
    COUNT(
        CASE
            WHEN up.status = 'completed' THEN 1
        END
    ) AS modules_completed
FROM users u
    LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.role = 'student'
GROUP BY u.id,
    u.username,
    u.display_name,
    u.avatar_url
ORDER BY total_points DESC,
    modules_completed DESC;
-- ==========================================
-- TRIGGERS
-- ==========================================
-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';
CREATE TRIGGER update_users_modtime BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();