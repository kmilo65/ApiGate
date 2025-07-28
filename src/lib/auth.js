import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { USER_ROLES, USER_STATUS, createUserObject, validateUserData } from "./userModel";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Validate user data
      const validation = validateUserData(user);
      if (!validation.isValid) {
        console.error('User validation failed:', validation.errors);
        return false;
      }
      
      // Create user object with defaults
      const userObject = createUserObject(user);
      
      // You can add custom logic here (e.g., save to database)
      console.log('User signing in:', userObject);
      
      return true;
    },
    
    async session({ session, user, token }) {
      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }
      
      // Add user data to session
      if (user && user.id) {
        // User object is available (during sign-in)
        session.user.id = user.id;
        session.user.role = user.role || USER_ROLES.USER;
        session.user.status = user.status || USER_STATUS.ACTIVE;
      } else if (token && token.id) {
        // User object not available, use token data
        session.user.id = token.id;
        session.user.role = token.role || USER_ROLES.USER;
        session.user.status = token.status || USER_STATUS.ACTIVE;
      } else {
        // Fallback - generate a temporary ID
        console.warn('No user ID available in session callback');
        session.user.id = 'temp-' + Date.now();
        session.user.role = USER_ROLES.USER;
        session.user.status = USER_STATUS.ACTIVE;
      }
      
      return session;
    },
    
    async jwt({ token, user, account }) {
      // Add user data to JWT token
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role || USER_ROLES.USER;
        token.status = user.status || USER_STATUS.ACTIVE;
      }
      
      // Ensure token has required fields
      if (!token.id) {
        console.warn('JWT token missing user ID, generating temporary ID');
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
};

export default NextAuth(authOptions); 