# User Persistence Verification Guide

## ✅ **What's Now Implemented**

The user persistence functionality is now **fully implemented** with the following components:

### 1. **NextAuth Configuration**
- ✅ SupabaseAdapter configured
- ✅ Google OAuth provider
- ✅ Enhanced signIn callback with database operations
- ✅ Session and JWT callbacks with user data

### 2. **UserService Integration**
- ✅ UserService.createUser() - Creates users in database
- ✅ UserService.getUserByEmail() - Checks for existing users
- ✅ UserService.updateLoginStats() - Updates login statistics
- ✅ Proper error handling and validation

### 3. **Database Operations**
- ✅ Supabase connection configured
- ✅ User table schema ready
- ✅ RLS policies for security

## 🔍 **How It Works Now**

### **First-Time User Flow:**
1. User clicks "Sign in with Google"
2. Google OAuth returns user data
3. `signIn` callback validates user data
4. `UserService.getUserByEmail()` checks if user exists
5. If user doesn't exist, `UserService.createUser()` creates new user
6. User data is saved to Supabase `users` table
7. Session is established with user data

### **Returning User Flow:**
1. User clicks "Sign in with Google"
2. Google OAuth returns user data
3. `signIn` callback validates user data
4. `UserService.getUserByEmail()` finds existing user
5. `UserService.updateLoginStats()` updates login count
6. Session is established with user data

## 🧪 **Testing Steps**

### **Step 1: Test Database Connection**
```bash
curl http://localhost:3000/api/test-db
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": [...]
}
```

### **Step 2: Test Manual User Creation**
```bash
curl -X POST http://localhost:3000/api/test-user
```
**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "test-1234567890",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "status": "active",
    ...
  }
}
```

### **Step 3: Test Complete Auth Flow**
```bash
curl -X POST http://localhost:3000/api/test-auth-flow
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Complete auth flow test successful",
  "user": {...},
  "retrievedUser": {...},
  "statsUpdate": {...}
}
```

### **Step 4: Test Real Authentication**
1. **Clear browser cookies and local storage**
2. **Visit your app** (http://localhost:3000)
3. **Click "Sign in with Google"**
4. **Complete Google OAuth flow**
5. **Check browser console** for debug logs
6. **Check Supabase dashboard** for new user record

## 📊 **Expected Console Logs**

When a user signs in for the first time, you should see:

```
🔧 Auth Configuration Debug:
🔐 SIGN IN CALLBACK STARTED
User: { id: "...", email: "...", name: "...", image: "..." }
Account: { provider: "google", ... }
Profile: { ... }
✅ User object created: { id: "...", email: "...", role: "user", status: "active", ... }
🆕 Creating new user in database...
✅ New user created in database: { id: "...", email: "...", ... }
🔐 SIGN IN CALLBACK COMPLETED - returning true
🎫 JWT CALLBACK STARTED
✅ JWT updated with user data
🎫 JWT CALLBACK COMPLETED
📋 SESSION CALLBACK STARTED
✅ Session updated with user data from user object
📋 SESSION CALLBACK COMPLETED
```

## 🔍 **Verification Checklist**

### **Environment Variables**
- [ ] `NEXTAUTH_URL=http://localhost:3000`
- [ ] `NEXTAUTH_SECRET=your-secret`
- [ ] `GOOGLE_CLIENT_ID=your-google-client-id`
- [ ] `GOOGLE_CLIENT_SECRET=your-google-client-secret`
- [ ] `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`

### **Database Setup**
- [ ] Users table exists in Supabase
- [ ] Table has correct schema (id, email, name, role, status, etc.)
- [ ] RLS policies are configured
- [ ] Service role key has proper permissions

### **Application Tests**
- [ ] Database connection test passes
- [ ] Manual user creation test passes
- [ ] Complete auth flow test passes
- [ ] Real Google OAuth sign-in works
- [ ] User appears in Supabase users table
- [ ] Session contains user data
- [ ] Login stats are updated for returning users

## 🐛 **Troubleshooting**

### **Issue: User not created in database**
**Check:**
1. Environment variables are loaded
2. Supabase connection is working
3. Table schema matches UserService expectations
4. RLS policies allow service role operations

### **Issue: Session doesn't contain user data**
**Check:**
1. JWT callback is working
2. Session callback is working
3. User object has required fields

### **Issue: Login stats not updated**
**Check:**
1. UserService.updateLoginStats() is called
2. Database has login_count and last_login_at columns
3. Service role has UPDATE permissions

## 📈 **Monitoring**

### **Supabase Dashboard**
1. **Table Editor → users** - Check for new user records
2. **Logs** - Monitor for any errors during authentication
3. **SQL Editor** - Run queries to verify data

### **Application Logs**
1. **Browser Console** - Check for debug logs
2. **Server Console** - Check for API route logs
3. **NextAuth Debug** - Enable debug mode for detailed logs

## 🎯 **Success Criteria**

✅ **User persistence is working when:**
- New users are created in the `users` table
- Existing users are found and login stats updated
- Session contains user data (id, role, status)
- No errors in browser console or server logs
- Users appear in Supabase dashboard

The implementation is now complete and should work correctly! 🎉