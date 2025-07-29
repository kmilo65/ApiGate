# Debug User Data Persistence in Supabase

## 🔍 **Step-by-Step Debugging Strategy**

### **Step 1: Verify Environment Variables**

First, let's check if your environment variables are properly configured:

```bash
# Check if these variables are set in your .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Test Environment Variables:**
```javascript
// Add this to any page temporarily to check
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### **Step 2: Verify Supabase Database Setup**

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run this query to check if the users table exists:**

```sql
-- Check if users table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public';
```

### **Step 3: Check NextAuth Adapter Configuration**

The issue might be that the Supabase adapter isn't being used. Let's verify:

```javascript
// Add this to src/lib/auth.js temporarily
console.log('Auth Options:', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  adapterConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
});
```

### **Step 4: Test Database Connection**

Create a test API route to verify Supabase connection:

```javascript
// Create: src/app/api/test-db/route.js
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error
      });
    }

    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      data 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    });
  }
}
```

### **Step 5: Add Debug Logging to Auth Callbacks**

Update your `src/lib/auth.js` to add detailed logging:

```javascript
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Add Supabase adapter if environment variables are configured
  ...(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && {
    adapter: SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }),
  }),
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SIGN IN CALLBACK');
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
      
      // Validate user data
      const validation = validateUserData(user);
      if (!validation.isValid) {
        console.error('❌ User validation failed:', validation.errors);
        return false;
      }
      
      // Create user object with defaults
      const userObject = createUserObject(user);
      console.log('✅ User object created:', userObject);
      
      return true;
    },
    
    async session({ session, user, token }) {
      console.log('📋 SESSION CALLBACK');
      console.log('Session:', session);
      console.log('User:', user);
      console.log('Token:', token);
      
      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }
      
      // Add user data to session
      if (user && user.id) {
        session.user.id = user.id;
        session.user.role = user.role || USER_ROLES.USER;
        session.user.status = user.status || USER_STATUS.ACTIVE;
        console.log('✅ Session updated with user data');
      } else if (token && token.id) {
        session.user.id = token.id;
        session.user.role = token.role || USER_ROLES.USER;
        session.user.status = token.status || USER_STATUS.ACTIVE;
        console.log('✅ Session updated with token data');
      } else {
        console.warn('⚠️ No user ID available in session callback');
        session.user.id = 'temp-' + Date.now();
        session.user.role = USER_ROLES.USER;
        session.user.status = USER_STATUS.ACTIVE;
      }
      
      return session;
    },
    
    async jwt({ token, user, account }) {
      console.log('🎫 JWT CALLBACK');
      console.log('Token:', token);
      console.log('User:', user);
      console.log('Account:', account);
      
      // Add user data to JWT token
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role || USER_ROLES.USER;
        token.status = user.status || USER_STATUS.ACTIVE;
        console.log('✅ JWT updated with user data');
      }
      
      // Ensure token has required fields
      if (!token.id) {
        console.warn('⚠️ JWT token missing user ID, generating temporary ID');
        token.id = 'temp-' + Date.now();
        token.role = USER_ROLES.USER;
        token.status = USER_STATUS.ACTIVE;
      }
      
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable NextAuth debug mode
};
```

### **Step 6: Check Supabase Logs**

1. **Go to Supabase Dashboard → Logs**
2. **Check for any errors during authentication**
3. **Look for SQL queries being executed**

### **Step 7: Verify Table Permissions**

Check if your users table has the correct RLS policies:

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';
```

### **Step 8: Test Manual User Creation**

Create a test API route to manually insert a user:

```javascript
// Create: src/app/api/test-user/route.js
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    const testUser = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating test user:', error);
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error
      });
    }

    console.log('✅ Test user created:', data);
    return Response.json({ 
      success: true, 
      user: data 
    });
  } catch (error) {
    console.error('❌ Exception creating test user:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    });
  }
}
```

### **Step 9: Common Issues and Solutions**

#### **Issue 1: Adapter Not Being Used**
**Symptoms:** No database operations in logs
**Solution:** Check environment variables and adapter configuration

#### **Issue 2: RLS Policies Blocking**
**Symptoms:** Permission denied errors
**Solution:** Update RLS policies or use service role key

#### **Issue 3: Table Schema Mismatch**
**Symptoms:** Column errors
**Solution:** Run the correct SQL schema

#### **Issue 4: Environment Variables Not Loaded**
**Symptoms:** Undefined environment variables
**Solution:** Restart development server after adding .env.local

### **Step 10: Final Verification**

1. **Clear browser cookies and local storage**
2. **Restart development server**
3. **Sign in with Google**
4. **Check browser console for debug logs**
5. **Check Supabase dashboard for new user records**

## 🐛 **Quick Diagnostic Commands**

```bash
# Test database connection
curl http://localhost:3000/api/test-db

# Test manual user creation
curl -X POST http://localhost:3000/api/test-user

# Check environment variables in browser console
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

## 📊 **Expected Flow**

1. **User signs in with Google**
2. **NextAuth processes OAuth response**
3. **Supabase adapter creates user record**
4. **Session is established with user data**
5. **User appears in Supabase users table**

Follow these steps systematically to identify where the process is breaking down!