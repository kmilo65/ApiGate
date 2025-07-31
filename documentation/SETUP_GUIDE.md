# Setup Guide for KeyGate

## 🔧 **Environment Variables Setup**

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration (Optional - for user persistence)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration (for API features)
OPENAI_API_KEY=your-openai-api-key
```

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Up Environment Variables**
- Copy the variables above to `.env.local`
- Fill in your actual values

### **3. Start Development Server**
```bash
npm run dev
```

## 🔍 **Troubleshooting Compile Errors**

### **Error: "Cannot find module '@auth/supabase-adapter'"**
**Solution:** The code now handles this gracefully. If you don't have Supabase configured, the app will work without database persistence.

### **Error: "Environment variables not found"**
**Solution:** Make sure your `.env.local` file exists and has the required variables.

### **Error: "Supabase connection failed"**
**Solution:** 
1. Check your Supabase credentials
2. Make sure the database is set up
3. The app will work without Supabase (fallback mode)

## 📊 **Current Status**

### **✅ Fixed Issues:**
- **Compile errors** - Added graceful fallbacks for missing dependencies
- **Missing environment variables** - Added conditional imports
- **Database connection** - Added fallback mode when Supabase is not configured

### **🔧 Working Features:**
- **Google OAuth** - Sign in with Google
- **Session management** - User sessions work
- **Protected routes** - Dashboard protection
- **Fallback mode** - Works without database

### **📈 Next Steps:**
1. **Set up Supabase** (optional) for user persistence
2. **Configure Google OAuth** for authentication
3. **Test the authentication flow**

## 🧪 **Testing**

### **Test 1: Basic Authentication**
1. Start the server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Sign in with Google"
4. Complete the OAuth flow

### **Test 2: Protected Routes**
1. After signing in, try accessing `/dashboards`
2. You should be able to access the dashboard
3. Sign out and try again - you should be redirected

### **Test 3: Console Logs**
Check the browser console for:
- Authentication flow logs
- Session data
- Any error messages

## 🐛 **Common Issues**

### **Issue: "Google OAuth not working"**
**Solution:** 
1. Check your Google OAuth credentials
2. Make sure redirect URIs are correct
3. Verify environment variables

### **Issue: "Session not persisting"**
**Solution:** 
1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` is correct
3. Check browser console for errors

### **Issue: "Database not working"**
**Solution:** 
1. Set up Supabase database
2. Run the SQL schema
3. Check environment variables
4. The app works without database (fallback mode)

## 📝 **Notes**

- **Database is optional** - The app works without Supabase
- **Fallback mode** - When Supabase is not configured, operations are simulated
- **Console logs** - Check browser console for detailed information
- **Environment variables** - Only Google OAuth is required for basic functionality

The application should now compile and run without errors, even without full Supabase configuration!