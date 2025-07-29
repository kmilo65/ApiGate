# 🔗 Integrated NextAuth + Custom User Schema

## 🎯 **Overview**

This solution creates a **seamless integration** between NextAuth.js authentication and your custom user data by:

1. **NextAuth Tables**: Handle authentication, sessions, and OAuth accounts
2. **Custom App Users Table**: Store your business logic (roles, API keys, preferences)
3. **Database View**: Provides unified access to both datasets
4. **Automatic Linking**: NextAuth user ID links to your custom user data

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NextAuth.js   │    │   Supabase      │    │   Your App      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   Session   │ │    │ │   users     │ │    │ │ UserService │ │
│ │ Management  │ │◄──►│ │ (NextAuth)  │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   OAuth     │ │    │ │  app_users  │ │    │ │  Business   │ │
│ │  Accounts   │ │◄──►│ │ (Custom)    │ │    │ │   Logic     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ integrated_users│
                       │     (View)     │
                       └─────────────────┘
```

## 🚀 **Implementation Steps**

### **Step 1: Create Database Schema**

Run this SQL in your **Supabase SQL Editor**:

```sql
-- NextAuth Tables (Required by SupabaseAdapter)
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

-- Custom App Users Table (Your Business Logic)
CREATE TABLE IF NOT EXISTS "public"."app_users" (
  "nextauth_user_id" uuid NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "image" text,
  "provider" text DEFAULT 'google',
  "provider_id" text,
  "role" text DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  "status" text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  "api_keys_limit" integer DEFAULT 10,
  "api_keys_used" integer DEFAULT 0,
  "login_count" integer DEFAULT 0,
  "last_login_at" timestamp with time zone,
  "preferences" jsonb DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Integrated View
CREATE OR REPLACE VIEW "public"."integrated_users" AS
SELECT 
    u.id as nextauth_user_id,
    u.name as nextauth_name,
    u.email as nextauth_email,
    u.image as nextauth_image,
    au.name as app_name,
    au.email as app_email,
    au.image as app_image,
    au.provider,
    au.provider_id,
    au.role,
    au.status,
    au.api_keys_limit,
    au.api_keys_used,
    au.login_count,
    au.last_login_at,
    au.preferences,
    au.created_at,
    au.updated_at
FROM "public"."users" u
LEFT JOIN "public"."app_users" au ON u.id = au.nextauth_user_id;

-- RLS Policies
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."verification_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."app_users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all users" ON "public"."users"
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage all accounts" ON "public"."accounts"
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage all sessions" ON "public"."sessions"
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage all verification tokens" ON "public"."verification_tokens"
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage all app users" ON "public"."app_users"
    FOR ALL USING (auth.role() = 'service_role');
```

### **Step 2: Update Your Code**

The code has been updated to work with the integrated schema:

- ✅ **UserService** now works with `app_users` table
- ✅ **Auth.js** uses NextAuth events to create linked records
- ✅ **Session callback** fetches integrated user data
- ✅ **UUID generation** fixed for Google OAuth IDs

### **Step 3: Test the Integration**

```bash
# Test database connection
curl http://localhost:3000/api/test-db

# Test integrated user creation
curl -X POST http://localhost:3000/api/test-uuid-fix

# Test NextAuth tables
curl http://localhost:3000/api/test-nextauth-tables
```

## 🔄 **Data Flow**

### **New User Sign-In:**
1. User clicks "Sign in with Google"
2. NextAuth creates user in `public.users`
3. `createUser` event triggers
4. UserService creates record in `public.app_users`
5. Session callback fetches integrated data
6. User has both auth and business data

### **Returning User Sign-In:**
1. User clicks "Sign in with Google"
2. NextAuth finds existing user in `public.users`
3. Session callback fetches integrated data from view
4. Login stats updated in `public.app_users`
5. User has updated session with all data

## 📊 **Data Access Patterns**

### **From Your App Code:**
```javascript
// Get user by NextAuth ID
const user = await UserService.getUserByNextAuthId(session.user.id);

// Get user by email
const user = await UserService.getUserByEmail(email);

// Update user data
await UserService.updateUser(nextauthUserId, updates);

// Check API key limits
const canCreate = await UserService.canCreateApiKey(nextauthUserId);
```

### **From Database View:**
```sql
-- Get integrated user data
SELECT * FROM integrated_users WHERE nextauth_email = 'user@example.com';

-- Get user with role and API key info
SELECT role, status, api_keys_limit, api_keys_used 
FROM integrated_users 
WHERE nextauth_user_id = 'uuid-here';
```

## 🎯 **Benefits**

### **✅ Separation of Concerns**
- NextAuth handles authentication
- Your app handles business logic
- Clean, maintainable code

### **✅ Data Integrity**
- Foreign key relationships
- Automatic cleanup on user deletion
- Consistent data across tables

### **✅ Performance**
- Indexed queries
- Efficient joins via view
- Optimized for common access patterns

### **✅ Flexibility**
- Add custom fields easily
- Extend without breaking NextAuth
- Migrate data independently

## 🐛 **Troubleshooting**

### **Issue: "Schema must be one of the following"**
**Solution:** Run the NextAuth tables SQL script

### **Issue: User not found in integrated view**
**Solution:** Check if app_user record was created in `createUser` event

### **Issue: Session missing custom data**
**Solution:** Verify session callback is fetching from integrated view

### **Issue: UUID format errors**
**Solution:** UserService now generates proper UUIDs, OAuth IDs stored separately

## 🎉 **Success Criteria**

✅ **Authentication works without errors**
✅ **User appears in NextAuth `users` table**
✅ **User appears in custom `app_users` table**
✅ **Session contains integrated user data**
✅ **API key management works**
✅ **Login stats update correctly**

## 🚀 **Next Steps**

1. **Run the SQL script** in Supabase
2. **Restart your development server**
3. **Test Google OAuth sign-in**
4. **Verify data appears in both tables**
5. **Check session contains integrated data**

The integrated solution provides the best of both worlds: NextAuth's robust authentication with your custom business logic! 🎉