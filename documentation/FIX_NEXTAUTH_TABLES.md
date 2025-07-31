# 🔧 Fix NextAuth Tables Error (PGRST106)

## 🚨 **Current Error**
```
The schema must be one of the following: public, graphql_public
```

This error occurs because the NextAuth.js SupabaseAdapter requires specific tables in the `public` schema that don't exist yet.

## 🎯 **Solution Steps**

### **Step 1: Verify Current State**

First, let's check what tables exist in your Supabase database:

```bash
curl http://localhost:3000/api/verify-nextauth-tables
```

This will tell us exactly which tables are missing.

### **Step 2: Create NextAuth Tables**

**Copy and paste this SQL into your Supabase SQL Editor:**

```sql
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
```

### **Step 3: Verify Tables Were Created**

After running the SQL, verify the tables exist:

```bash
curl http://localhost:3000/api/verify-nextauth-tables
```

You should see:
```json
{
  "success": true,
  "message": "All NextAuth tables exist in public schema",
  "allTablesExist": true
}
```

### **Step 4: Restart Your Development Server**

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### **Step 5: Test Authentication**

Try signing in with Google again. The error should be resolved.

## 🔍 **What These Tables Do**

- **`users`**: Stores NextAuth user data (id, name, email, image)
- **`accounts`**: Stores OAuth provider connections (Google, GitHub, etc.)
- **`sessions`**: Stores active user sessions
- **`verification_tokens`**: Stores email verification tokens

## 🐛 **If You Still Get Errors**

### **Check Supabase Schema**
Make sure you're running the SQL in the **public** schema, not the **auth** schema.

### **Check RLS Policies**
The tables need RLS policies for the service role to access them.

### **Check Environment Variables**
Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## ✅ **Success Criteria**

After completing these steps:
- ✅ No more PGRST106 errors
- ✅ Google OAuth sign-in works
- ✅ User data appears in NextAuth tables
- ✅ Session management works correctly

## 🚀 **Next Steps**

Once the NextAuth tables are working, you can implement the integrated solution with your custom `app_users` table for business logic.