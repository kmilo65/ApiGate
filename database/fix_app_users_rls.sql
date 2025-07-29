-- Fix RLS Policies for app_users table
-- Run this in Supabase SQL Editor to allow service role to create users

-- ========================================
-- 1. DROP EXISTING POLICIES (if they exist)
-- ========================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON "public"."app_users";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."app_users";
DROP POLICY IF EXISTS "Service role can manage all app users" ON "public"."app_users";

-- ========================================
-- 2. CREATE PROPER RLS POLICIES FOR APP_USERS
-- ========================================

-- Enable all access for service role (for NextAuth operations)
CREATE POLICY "Service role can manage all app users" ON "public"."app_users"
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to view their own profile
CREATE POLICY "Users can view own profile" ON "public"."app_users"
    FOR SELECT USING (auth.uid() = nextauth_user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile" ON "public"."app_users"
    FOR UPDATE USING (auth.uid() = nextauth_user_id);

-- Allow service role to insert new users (for NextAuth user creation)
CREATE POLICY "Service role can insert app users" ON "public"."app_users"
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ========================================
-- 3. VERIFY POLICIES
-- ========================================

-- Check current policies
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
    AND tablename = 'app_users';

-- ========================================
-- 4. TEST SERVICE ROLE ACCESS
-- ========================================

-- This will be tested by the API endpoint
-- The service role should be able to:
-- 1. Insert into app_users table
-- 2. Select from app_users table
-- 3. Update app_users table

-- ========================================
-- 5. ALTERNATIVE: DISABLE RLS TEMPORARILY (if needed)
-- ========================================

-- If the above policies don't work, you can temporarily disable RLS:
-- ALTER TABLE "public"."app_users" DISABLE ROW LEVEL SECURITY;

-- Note: This is less secure but can help isolate the issue
-- Remember to re-enable RLS after fixing the authentication flow
-- ALTER TABLE "public"."app_users" ENABLE ROW LEVEL SECURITY; 