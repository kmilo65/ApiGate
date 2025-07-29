# 🚨 IMMEDIATE FIX: NextAuth Schema Error

## 🔍 **Current Error**
```
The schema must be one of the following: public, graphql_public
```

This error occurs because the **SupabaseAdapter** expects NextAuth tables in the `public` schema, but they don't exist.

## 🚀 **Step-by-Step Fix**

### **Step 1: Create NextAuth Tables in Supabase**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run this SQL script:**

```sql
-- NextAuth.js Required Tables for SupabaseAdapter
-- Run this in Supabase SQL Editor

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

### **Step 2: Verify Tables Were Created**

4. **Go to Table Editor in Supabase Dashboard**
5. **Check that these tables exist in the `public` schema:**
   - `users` (NextAuth table)
   - `accounts`
   - `sessions`
   - `verification_tokens`

### **Step 3: Test Tables via API**

6. **Test if tables are accessible:**
```bash
curl http://localhost:3000/api/test-nextauth-tables
```

**Expected Response:**
```json
{
  "success": true,
  "message": "All NextAuth tables exist",
  "tables": {
    "nextauthUsersTable": { "exists": true, "error": null },
    "accountsTable": { "exists": true, "error": null },
    "sessionsTable": { "exists": true, "error": null },
    "verificationTokensTable": { "exists": true, "error": null }
  },
  "allTablesExist": true
}
```

### **Step 4: Test Authentication**

7. **Restart your development server:**
```bash
npm run dev
```

8. **Test Google OAuth sign-in**
9. **Check for success (no more schema errors)**

## 🔍 **What This Fixes**

### **Before Fix:**
- ❌ `The schema must be one of the following: public, graphql_public`
- ❌ Authentication fails
- ❌ No user data persisted

### **After Fix:**
- ✅ NextAuth tables exist in `public` schema
- ✅ SupabaseAdapter can access tables
- ✅ Authentication works
- ✅ User data persists in both tables

## 🎯 **Expected Flow After Fix**

1. **User clicks "Sign in with Google"**
2. **NextAuth creates user in `public.users` (NextAuth table)**
3. **Your `signIn` callback creates user in custom `users` table**
4. **Both tables have user data**
5. **Authentication completes successfully**

## 🐛 **If Still Getting Errors**

### **Check Table Names:**
- Make sure tables are in `public` schema, not `auth`
- Table names should be: `users`, `accounts`, `sessions`, `verification_tokens`

### **Check RLS Policies:**
- Go to **Authentication → Policies**
- Ensure service role has access to all tables

### **Check Environment Variables:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Restart development server after changes

## 🎉 **Success Criteria**

✅ **No "schema must be one of the following" errors**
✅ **Authentication completes successfully**
✅ **User appears in NextAuth `users` table**
✅ **User appears in your custom `users` table**

Run the SQL script above and the authentication should work! 🚀