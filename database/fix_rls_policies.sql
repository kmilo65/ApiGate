-- Fix RLS Policies for NextAuth Adapter
-- Run this in Supabase SQL Editor to ensure proper access

-- ========================================
-- 1. DROP EXISTING POLICIES (if they exist)
-- ========================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Service role can manage all users" ON "public"."users";
DROP POLICY IF EXISTS "Service role can manage all accounts" ON "public"."accounts";
DROP POLICY IF EXISTS "Service role can manage all sessions" ON "public"."sessions";
DROP POLICY IF EXISTS "Service role can manage all verification tokens" ON "public"."verification_tokens";

-- ========================================
-- 2. CREATE PROPER RLS POLICIES FOR NEXTAUTH
-- ========================================

-- Users table policies
CREATE POLICY "Enable all access for service role" ON "public"."users"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON "public"."users"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Accounts table policies
CREATE POLICY "Enable all access for service role" ON "public"."accounts"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON "public"."accounts"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Sessions table policies
CREATE POLICY "Enable all access for service role" ON "public"."sessions"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON "public"."sessions"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Verification tokens table policies
CREATE POLICY "Enable all access for service role" ON "public"."verification_tokens"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON "public"."verification_tokens"
    FOR SELECT USING (auth.role() = 'authenticated');

-- ========================================
-- 3. VERIFY TABLES EXIST AND ARE ACCESSIBLE
-- ========================================

-- Check if tables exist
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'accounts', 'sessions', 'verification_tokens');

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'accounts', 'sessions', 'verification_tokens');

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'accounts', 'sessions', 'verification_tokens');

-- ========================================
-- 4. TEST SERVICE ROLE ACCESS
-- ========================================

-- This will be tested by the API endpoint
-- The service role should be able to:
-- 1. Insert into users table
-- 2. Insert into sessions table
-- 3. Query all tables without restrictions

-- ========================================
-- 5. ALTERNATIVE: DISABLE RLS TEMPORARILY (if needed)
-- ========================================

-- If the above policies don't work, you can temporarily disable RLS:
-- ALTER TABLE "public"."users" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "public"."accounts" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "public"."sessions" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "public"."verification_tokens" DISABLE ROW LEVEL SECURITY;

-- Note: This is less secure but can help isolate the issue
-- Remember to re-enable RLS after fixing the authentication flow