# User Data Persistence Troubleshooting Guide

## 🔍 **Problem Analysis**

Your user data is **NOT being persisted** because:

### **Root Causes:**
1. **No Database Adapter** - NextAuth.js was configured without a database adapter
2. **Mock UserService** - UserService was only logging, not actually saving to database
3. **Missing Environment Variables** - Supabase credentials not properly configured
4. **Incomplete Database Schema** - Users table may not have all required fields

## 🛠️ **Solutions Implemented**

### **1. Added Supabase Adapter**
```javascript
// src/lib/auth.js
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const authOptions = {
  // ... providers
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  // ... rest of config
};
```

### **2. Updated UserService with Real Database Operations**
```javascript
// src/lib/userService.js
import { supabase } from './supabaseClient';

static async createUser(userData) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: user.id,
      name: user.name,
      email: user.email,
      // ... other fields
    }])
    .select()
    .single();
}
```

### **3. Enhanced Database Schema**
Created `database/enhanced_users_table.sql` with all required fields.

## 🔧 **Required Environment Variables**

Add these to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📋 **Step-by-Step Fix**

### **Step 1: Set Up Supabase Database**

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Run the enhanced users table schema:**

```sql
-- Run this in Supabase SQL Editor
-- Enhanced Users Table for KeyGate

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp with time zone,
  "image" text,
  "provider" text DEFAULT 'google',
  "provider_id" text,
  "role" text DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  "status" text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  "first_name" text,
  "last_name" text,
  "display_name" text,
  "bio" text,
  "location" text,
  "website" text,
  "company" text,
  "job_title" text,
  "phone" text,
  "timezone" text DEFAULT 'UTC',
  "language" text DEFAULT 'en',
  "preferences" jsonb DEFAULT '{}',
  "settings" jsonb DEFAULT '{}',
  "api_keys_limit" integer DEFAULT 10,
  "api_keys_used" integer DEFAULT 0,
  "login_count" integer DEFAULT 0,
  "last_login_at" timestamp with time zone,
  "last_activity_at" timestamp with time zone,
  "two_factor_enabled" boolean DEFAULT false,
  "two_factor_secret" text,
  "password_hash" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "users_email_valid" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT "users_api_keys_valid" CHECK (api_keys_used >= 0 AND api_keys_used <= api_keys_limit)
);

-- Create indexes
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

-- Enable RLS
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON "users"
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "users"
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all users" ON "users"
    FOR ALL USING (auth.role() = 'service_role');
```

### **Step 2: Get Supabase Credentials**

1. **Go to Supabase Dashboard → Settings → API**
2. **Copy these values:**
   - Project URL
   - Anon Key
   - Service Role Key (keep this secret!)

### **Step 3: Update Environment Variables**

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Step 4: Restart Development Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## 🧪 **Testing the Fix**

### **Test 1: Check Environment Variables**
```javascript
// Add this to any page temporarily
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
```

### **Test 2: Test Database Connection**
```javascript
// Add to any API route temporarily
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase
  .from('users')
  .select('count')
  .limit(1);

console.log('Database connection:', error ? 'FAILED' : 'SUCCESS');
```

### **Test 3: Sign In and Check Database**
1. **Sign in with Google**
2. **Check Supabase Dashboard → Table Editor → users**
3. **You should see a new user record**

## 🐛 **Common Issues & Solutions**

### **Issue 1: "supabaseKey is required"**
**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`

### **Issue 2: "Table 'users' doesn't exist"**
**Solution:** Run the SQL schema in Supabase SQL Editor

### **Issue 3: "Permission denied"**
**Solution:** Check RLS policies and service role key

### **Issue 4: "Invalid email format"**
**Solution:** Check the email validation constraint in the schema

## 📊 **Verification Steps**

### **1. Check Database Records**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

### **2. Check Authentication Flow**
```javascript
// Add to signIn callback
console.log('User signing in:', user);
console.log('Account:', account);
console.log('Profile:', profile);
```

### **3. Check Session Data**
```javascript
// Add to session callback
console.log('Session callback - user:', user);
console.log('Session callback - token:', token);
```

## 🔄 **Next Steps After Fix**

1. **Test user creation** - Sign in and verify user appears in database
2. **Test user updates** - Update profile and verify changes persist
3. **Test API key limits** - Create API keys and verify count tracking
4. **Monitor logs** - Check console for any remaining errors

## 📝 **Summary**

The main issues were:
- ✅ **Fixed:** Added Supabase adapter to NextAuth.js
- ✅ **Fixed:** Updated UserService to use real database operations
- ✅ **Fixed:** Created comprehensive database schema
- ✅ **Fixed:** Added proper environment variable configuration

After implementing these fixes, user data should be properly persisted in your Supabase database.