-- Fix Schema Issue: Ensure NextAuth tables are in public schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist in wrong schema
DROP TABLE IF EXISTS "auth"."users" CASCADE;
DROP TABLE IF EXISTS "auth"."accounts" CASCADE;
DROP TABLE IF EXISTS "auth"."sessions" CASCADE;
DROP TABLE IF EXISTS "auth"."verification_tokens" CASCADE;

-- Create NextAuth tables in public schema
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text,
  "email" text,
  "emailVerified" timestamp with time zone,
  "image" text
);

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

CREATE TABLE IF NOT EXISTS "public"."sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
  "expires" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  PRIMARY KEY("identifier", "token")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "public"."accounts"("userId");
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "public"."sessions"("userId");
CREATE INDEX IF NOT EXISTS "sessions_sessionToken_idx" ON "public"."sessions"("sessionToken");

-- Enable RLS
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Service role can manage all users" ON "public"."users";
CREATE POLICY "Service role can manage all users" ON "public"."users"
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage all accounts" ON "public"."accounts";
CREATE POLICY "Service role can manage all accounts" ON "public"."accounts"
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage all sessions" ON "public"."sessions";
CREATE POLICY "Service role can manage all sessions" ON "public"."sessions"
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage all verification tokens" ON "public"."verification_tokens";
CREATE POLICY "Service role can manage all verification tokens" ON "public"."verification_tokens"
    FOR ALL USING (auth.role() = 'service_role');

-- Verify tables exist
SELECT 
  'users' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') as exists
UNION ALL
SELECT 
  'accounts' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'accounts') as exists
UNION ALL
SELECT 
  'sessions' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') as exists
UNION ALL
SELECT 
  'verification_tokens' as table_name,
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verification_tokens') as exists; 