-- NextAuth.js Required Tables for SupabaseAdapter
-- Run this in Supabase SQL Editor to fix the PGRST106 error

-- Create NextAuth users table
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text,
  "email" text,
  "emailVerified" timestamp with time zone,
  "image" text
);

-- Create NextAuth accounts table
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

-- Create NextAuth sessions table
CREATE TABLE IF NOT EXISTS "public"."sessions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
  "expires" timestamp with time zone NOT NULL
);

-- Create NextAuth verification tokens table
CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  PRIMARY KEY("identifier", "token")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "public"."accounts"("userId");
CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "public"."sessions"("userId");
CREATE INDEX IF NOT EXISTS "sessions_sessionToken_idx" ON "public"."sessions"("sessionToken");

-- Enable Row Level Security
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public schema
CREATE POLICY "Service role can manage all users" ON "public"."users"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all accounts" ON "public"."accounts"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all sessions" ON "public"."sessions"
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all verification tokens" ON "public"."verification_tokens"
    FOR ALL USING (auth.role() = 'service_role');