-- Enhanced Users Table for KeyGate
-- This table includes all fields from the UserModel

-- Drop existing table if it exists (be careful in production!)
-- DROP TABLE IF EXISTS "users" CASCADE;

-- Create enhanced users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp with time zone,
  "image" text,
  
  -- Authentication & Provider Info
  "provider" text DEFAULT 'google',
  "provider_id" text,
  
  -- User Status & Role
  "role" text DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  "status" text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  
  -- Profile Information
  "first_name" text,
  "last_name" text,
  "display_name" text,
  "bio" text,
  "location" text,
  "website" text,
  "company" text,
  "job_title" text,
  
  -- Contact Information
  "phone" text,
  "timezone" text DEFAULT 'UTC',
  "language" text DEFAULT 'en',
  
  -- Preferences
  "preferences" jsonb DEFAULT '{}',
  "settings" jsonb DEFAULT '{}',
  
  -- API Key Management
  "api_keys_limit" integer DEFAULT 10,
  "api_keys_used" integer DEFAULT 0,
  
  -- Statistics & Tracking
  "login_count" integer DEFAULT 0,
  "last_login_at" timestamp with time zone,
  "last_activity_at" timestamp with time zone,
  
  -- Security
  "two_factor_enabled" boolean DEFAULT false,
  "two_factor_secret" text,
  "password_hash" text,
  
  -- Timestamps
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT "users_email_valid" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT "users_api_keys_valid" CHECK (api_keys_used >= 0 AND api_keys_used <= api_keys_limit)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_provider_provider_id_idx" ON "users"("provider", "provider_id");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON "users" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own profile" ON "users"
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON "users"
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow service role to manage all users
CREATE POLICY "Service role can manage all users" ON "users"
    FOR ALL USING (auth.role() = 'service_role');

-- Insert some default data (optional)
-- INSERT INTO "users" (id, name, email, role, status) VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@keygate.com', 'admin', 'active'),
--   ('00000000-0000-0000-0000-000000000002', 'Demo User', 'demo@keygate.com', 'user', 'active');

-- Grant permissions (adjust based on your Supabase setup)
-- GRANT ALL ON "users" TO authenticated;
-- GRANT ALL ON "users" TO service_role;