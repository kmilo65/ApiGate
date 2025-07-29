-- Integrated User Schema: NextAuth + Custom App Users
-- This creates a seamless integration between NextAuth and your custom user data

-- ========================================
-- 1. NEXTAUTH TABLES (Required by SupabaseAdapter)
-- ========================================

-- NextAuth users table (for authentication)
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text,
  "email" text,
  "emailVerified" timestamp with time zone,
  "image" text
);

-- NextAuth accounts table (OAuth provider connections)
CREATE TABLE IF NOT EXISTS "public"."accounts" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" bigint,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  UNIQUE("provider", "providerAccountId")
);

-- NextAuth sessions table
CREATE TABLE IF NOT EXISTS "public"."sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
  "expires" timestamp with time zone NOT NULL
);

-- NextAuth verification tokens table
CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  PRIMARY KEY("identifier", "token")
);

-- ========================================
-- 2. CUSTOM APP USERS TABLE (Your Business Logic)
-- ========================================

-- Custom app users table (extends NextAuth user data)
CREATE TABLE IF NOT EXISTS "public"."app_users" (
  -- Link to NextAuth user
  "nextauth_user_id" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE PRIMARY KEY,
  
  -- Basic Information (from NextAuth, but can be overridden)
  "name" text,
  "email" text NOT NULL UNIQUE,
  "image" text,
  
  -- Authentication & Provider Info
  "provider" text DEFAULT 'google',
  "provider_id" text, -- Original OAuth provider ID
  
  -- User Status & Role (Your custom fields)
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
  
  -- Timestamps
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT "app_users_email_valid" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT "app_users_api_keys_valid" CHECK (api_keys_used >= 0 AND api_keys_used <= api_keys_limit)
);

-- ========================================
-- 3. INDEXES FOR PERFORMANCE
-- ========================================

-- NextAuth indexes
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "public"."accounts"("userId");
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "public"."sessions"("userId");
CREATE INDEX IF NOT EXISTS "sessions_sessionToken_idx" ON "public"."sessions"("sessionToken");

-- App users indexes
CREATE INDEX IF NOT EXISTS "app_users_email_idx" ON "public"."app_users"("email");
CREATE INDEX IF NOT EXISTS "app_users_provider_provider_id_idx" ON "public"."app_users"("provider", "provider_id");
CREATE INDEX IF NOT EXISTS "app_users_role_idx" ON "public"."app_users"("role");
CREATE INDEX IF NOT EXISTS "app_users_status_idx" ON "public"."app_users"("status");
CREATE INDEX IF NOT EXISTS "app_users_created_at_idx" ON "public"."app_users"("created_at");

-- ========================================
-- 4. TRIGGERS
-- ========================================

-- Updated at trigger for app_users
CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_users_updated_at 
    BEFORE UPDATE ON "public"."app_users" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_app_users_updated_at();

-- ========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."app_users" ENABLE ROW LEVEL SECURITY;

-- NextAuth RLS Policies
CREATE POLICY "Service role can manage all users" ON "public"."users"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all accounts" ON "public"."accounts"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all sessions" ON "public"."sessions"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all verification tokens" ON "public"."verification_tokens"
    FOR ALL USING (auth.role() = 'service_role');

-- App users RLS Policies
CREATE POLICY "Users can view own profile" ON "public"."app_users"
    FOR SELECT USING (auth.uid() = nextauth_user_id);

CREATE POLICY "Users can update own profile" ON "public"."app_users"
    FOR UPDATE USING (auth.uid() = nextauth_user_id);

CREATE POLICY "Service role can manage all app users" ON "public"."app_users"
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 6. VIEW FOR SEAMLESS DATA ACCESS
-- ========================================

-- Create a view that combines NextAuth and app user data
CREATE OR REPLACE VIEW "public"."integrated_users" AS
SELECT 
    u.id as nextauth_user_id,
    u.name as nextauth_name,
    u.email as nextauth_email,
    u."emailVerified" as nextauth_email_verified,
    u.image as nextauth_image,
    au.name as app_name,
    au.email as app_email,
    au.image as app_image,
    au.provider,
    au.provider_id,
    au.role,
    au.status,
    au.first_name,
    au.last_name,
    au.display_name,
    au.bio,
    au.location,
    au.website,
    au.company,
    au.job_title,
    au.phone,
    au.timezone,
    au.language,
    au.preferences,
    au.settings,
    au.api_keys_limit,
    au.api_keys_used,
    au.login_count,
    au.last_login_at,
    au.last_activity_at,
    au.two_factor_enabled,
    au.created_at,
    au.updated_at
FROM "public"."users" u
LEFT JOIN "public"."app_users" au ON u.id = au.nextauth_user_id;

-- ========================================
-- 7. HELPER FUNCTIONS
-- ========================================

-- Function to get integrated user data by email
CREATE OR REPLACE FUNCTION get_integrated_user_by_email(user_email text)
RETURNS TABLE (
    nextauth_user_id uuid,
    nextauth_name text,
    nextauth_email text,
    app_name text,
    app_email text,
    role text,
    status text,
    api_keys_limit integer,
    api_keys_used integer,
    login_count integer,
    last_login_at timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        iu.nextauth_user_id,
        iu.nextauth_name,
        iu.nextauth_email,
        iu.app_name,
        iu.app_email,
        iu.role,
        iu.status,
        iu.api_keys_limit,
        iu.api_keys_used,
        iu.login_count,
        iu.last_login_at
    FROM "public"."integrated_users" iu
    WHERE iu.nextauth_email = user_email OR iu.app_email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Function to update login stats
CREATE OR REPLACE FUNCTION update_user_login_stats(user_email text)
RETURNS void AS $$
BEGIN
    UPDATE "public"."app_users"
    SET 
        login_count = login_count + 1,
        last_login_at = now(),
        last_activity_at = now()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;