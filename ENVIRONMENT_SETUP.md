# Environment Setup Fix

## 🔧 **Missing Environment Variables**

### **Add to your `.env.local`:**

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://posttmajeowoecqztihg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ← THIS IS MISSING!
```

### **How to get SUPABASE_SERVICE_ROLE_KEY:**

1. **Go to Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Copy the "service_role" key** (not the anon key)
4. **Add it to your `.env.local`**

## 🔧 **Fix UUID Issue**

The Google OAuth user ID (`106044303788770255373`) is not a valid UUID. We need to fix the user creation to handle this.

### **Option 1: Generate UUID for user ID**
Update the `createUserObject` function to generate a proper UUID.

### **Option 2: Use string ID in database**
Update the database schema to accept string IDs instead of UUIDs.

## 🔧 **Fix Database Query Issue**

The `getUserByEmail` function should handle the case when no user is found gracefully.

## 🚀 **Quick Fix Steps**

### **1. Add Service Role Key**
```bash
# Add this to your .env.local
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Get from Supabase dashboard
```

### **2. Restart Development Server**
```bash
npm run dev
```

### **3. Test Again**
After adding the service role key, test the authentication flow again.

## 🔍 **Expected Results After Fix**

After adding the service role key, you should see:
```
🔧 Final authOptions: {
  hasAdapter: true,
  adapterConfigured: true,
  providers: 1,
  callbacks: [ 'signIn', 'session', 'jwt' ],
  debug: true
}
```

## 🐛 **If UUID Issue Persists**

If you still get UUID errors, we'll need to update the user creation logic to handle Google's numeric IDs properly.