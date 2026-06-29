-- ==========================================
-- Migration: Add password_resets table
-- Run this in your Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS password_resets (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

-- ==========================================
-- Admin Credentials Seed
-- Use this to create an admin account with
-- username: admin
-- email: admin@mayleneee.code
-- password: Admin@2024!
-- ==========================================
-- Password hash for "Admin@2024!" (bcrypt cost 12)
INSERT INTO users (
    id,
    username,
    email,
    display_name,
    avatar_url,
    password_hash,
    oauth_provider,
    oauth_id,
    role,
    tier,
    locale,
    theme,
    is_active,
    created_at
) VALUES (
    uuid_generate_v4(),
    'admin',
    'admin@mayleneee.code',
    'Administrator',
    NULL,
    '$2a$12$fl9ONyM04Vod40qbU.BLFuyNUCs4jc2FJhyaf7tTTU9jIrbVuFfFW',
    NULL,
    NULL,
    'admin',
    'premium',
    'en',
    'dark',
    true,
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    tier = 'premium';

-- ==========================================
-- Also promote mayleneee7@gmail.com to admin
-- if they have already registered
-- ==========================================
UPDATE users SET role = 'admin', tier = 'premium' WHERE email = 'mayleneee7@gmail.com';

-- ==========================================
-- Verify admin users
-- ==========================================
SELECT id, username, email, role, tier, created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at;
