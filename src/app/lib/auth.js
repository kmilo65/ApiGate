import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createUserObject, USER_ROLES, USER_STATUS } from "./userModel";
import { UserService } from "./userService";

// Debug environment variables
console.log('🔧 Auth Configuration Debug:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);

// Configure SupabaseAdapter
let supabaseAdapter = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdapter = SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      // Explicitly specify the schema to avoid PGRST106 errors
      schema: 'public'
    });
    console.log('✅ SupabaseAdapter configured successfully');
  } catch (error) {
    console.error('❌ Error configuring SupabaseAdapter:', error);
  }
}

export const authOptions = {
  // Temporarily disable adapter to fix session error
  // adapter: supabaseAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Switch back to JWT temporarily
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SIGN IN CALLBACK STARTED');
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
      
      try {
        // Validate required user data
        if (!user || !user.email) {
          console.error('❌ Invalid user data in signIn callback');
          return false;
        }
        
        // Create user object with defaults
        const userObject = createUserObject(user);
        console.log('✅ User object created:', userObject);
        
        // Check if user already exists in database
        const existingUser = await UserService.getUserByEmail(user.email);
        
        if (existingUser.success && existingUser.user) {
          console.log('✅ User already exists in database:', existingUser.user);
          // Update login stats for existing user
          await UserService.updateLoginStats(user.email);
          return true;
        } else if (existingUser.success && !existingUser.user) {
          // User not found, create new user in database
          console.log('🆕 Creating new user in database...');
          
          const userData = {
            name: user.name,
            email: user.email,
            image: user.image,
            provider: 'google',
            provider_id: user.id
          };
          
          const createResult = await UserService.createUser(userData);
          
          if (createResult.success) {
            console.log('✅ New user created successfully in database:', createResult.user);
            return true;
          } else {
            console.error('❌ Failed to create user in database:', createResult.error);
            // Still allow sign-in even if database creation fails
            return true;
          }
        } else {
          // Error occurred while checking for existing user
          console.error('❌ Error checking for existing user:', existingUser.error);
          // Still allow sign-in even if database check fails
          return true;
        }
      } catch (error) {
        console.error('❌ Error in signIn callback:', error);
        // Still allow sign-in even if there's an error
        return true;
      }
    },
    
        async session({ session, user, token }) {
      console.log('📋 SESSION CALLBACK STARTED');
      console.log('Session:', session);
      console.log('User:', user);
      console.log('Token:', token);
      
      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
        console.log('⚠️ Created empty session.user object');
      }
      
      // Get user ID from token or user object (JWT strategy)
      const userId = token?.id || user?.id;
      
      if (userId) {
        // In JWT strategy, userId is the Google OAuth ID, not a NextAuth UUID
        // We can't query the database with this ID, so use JWT token data
        session.user.id = userId;
        session.user.role = token?.role || USER_ROLES.USER;
        session.user.status = token?.status || USER_STATUS.ACTIVE;
        session.user.apiKeysLimit = 10; // Default values
        session.user.apiKeysUsed = 0;
        session.user.loginCount = 0;
        session.user.lastLoginAt = null;
        console.log('✅ Session updated with token data (JWT mode - OAuth ID)');
      } else {
        console.warn('⚠️ No user ID available in session callback, generating temporary ID');
        session.user.id = 'temp-' + Date.now();
        session.user.role = USER_ROLES.USER;
        session.user.status = USER_STATUS.ACTIVE;
      }
      
      console.log('📋 SESSION CALLBACK COMPLETED - final session:', session);
      return session;
    },
    
    async jwt({ token, user, account }) {
      console.log('🎫 JWT CALLBACK STARTED');
      console.log('Token:', token);
      console.log('User:', user);
      console.log('Account:', account);
      
      // Add user data to JWT token
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role || USER_ROLES.USER;
        token.status = user.status || USER_STATUS.ACTIVE;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        console.log('✅ JWT updated with user data');
      }
      
      // Ensure token has required fields
      if (!token.id) {
        console.warn('⚠️ JWT token missing user ID, generating temporary ID');
        token.id = 'temp-' + Date.now();
        token.role = USER_ROLES.USER;
        token.status = USER_STATUS.ACTIVE;
      }
      
      console.log('🎫 JWT CALLBACK COMPLETED - final token:', token);
      return token;
    },
    

  },
  events: {
    async createUser({ user }) {
      console.log('🎉 CREATE USER EVENT - NextAuth user created:', user);
      
      // Create corresponding app_user record
      try {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          provider: 'google',
          provider_id: user.id // Use the NextAuth user ID as provider_id
        };
        
        const createResult = await UserService.createUser(userData, user.id);
        
        if (createResult.success) {
          console.log('✅ App user created successfully:', createResult.user);
        } else {
          console.error('❌ Failed to create app user:', createResult.error);
        }
      } catch (error) {
        console.error('❌ Error creating app user:', error);
      }
    },
    
    async signIn({ user, account, profile, isNewUser }) {
      console.log('🔐 SIGN IN EVENT - User signed in:', { user, isNewUser });
      
      if (!isNewUser && user?.email) {
        // Update login stats for returning users
        try {
          await UserService.updateLoginStats(user.email);
          console.log('✅ Login stats updated for returning user');
        } catch (error) {
          console.error('❌ Error updating login stats:', error);
        }
      }
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

// Debug final configuration
console.log('🔧 Final authOptions:', {
  hasAdapter: !!supabaseAdapter,
  adapterConfigured: !!supabaseAdapter,
  providers: authOptions.providers.length,
  callbacks: Object.keys(authOptions.callbacks),
  debug: authOptions.debug
});

export default authOptions; 