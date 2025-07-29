# Database Setup Fix

## 🔍 **Current Issue**

The error shows:
```
The schema must be one of the following: public, graphql_public
```

This happens because the **SupabaseAdapter** expects NextAuth.js tables to exist in the `public` schema, but they're missing.

## 🔧 **Required Tables**

The `@auth/supabase-adapter` requires these tables in the `public` schema:

1. **`users`** - NextAuth user data
2. **`accounts`** - OAuth account connections
3. **`sessions`** - User sessions
4. **`verification_tokens`** - Email verification tokens

## 🚀 **Fix Steps**

### **Step 1: Create NextAuth Tables**

Run this SQL in your Supabase SQL Editor:

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

### **Step 2: Verify Tables Exist**

Test if the tables were created successfully:

```bash
curl http://localhost:3000/api/test-nextauth-tables
```

**Expected Response:**
```json
{
  "success": true,
  "message": "All tables exist",
  "tables": {
    "usersTable": { "exists": true, "error": null },
    "accountsTable": { "exists": true, "error": null },
    "sessionsTable": { "exists": true, "error": null },
    "customUsersTable": { "exists": true, "error": null }
  },
  "allTablesExist": true
}
```

### **Step 3: Test Authentication Again**

After creating the tables:

1. **Restart your development server**
2. **Test Google OAuth sign-in**
3. **Check both tables:**
   - `public.users` (NextAuth internal)
   - `public.users` (your custom table)

## 🔍 **Table Structure**

### **NextAuth Tables (public schema)**
- `users` - Basic user info for NextAuth
- `accounts` - OAuth provider connections
- `sessions` - User sessions
- `verification_tokens` - Email verification

### **Custom Tables (public schema)**
- `users` - Your enhanced user data with roles, status, etc.

## 🎯 **Expected Flow After Fix**

1. **User signs in with Google**
2. **NextAuth creates user in `public.users`**
3. **Your `signIn` callback creates user in custom `users` table**
4. **Both tables have user data**

## 🐛 **If Tables Still Missing**

### **Check Supabase Dashboard:**
1. Go to **Table Editor**
2. Look for tables in **public** schema
3. If missing, run the SQL above again

### **Check RLS Policies:**
1. Go to **Authentication → Policies**
2. Ensure service role has access to all tables

### **Test Database Connection:**
```bash
curl http://localhost:3000/api/test-db
```

## 📊 **Verification Steps**

### **1. Check NextAuth Tables**
```bash
curl http://localhost:3000/api/test-nextauth-tables
```

### **2. Test User Creation**
```bash
curl -X POST http://localhost:3000/api/test-uuid-fix
```

### **3. Test Real Authentication**
1. Sign in with Google
2. Check Supabase dashboard for user records
3. Verify both tables have data

## 🎉 **Success Criteria**

✅ **Authentication works without errors**
✅ **User appears in NextAuth `users` table**
✅ **User appears in custom `users` table**
✅ **No "schema must be one of the following" errors**

The database setup should now work correctly! 🚀