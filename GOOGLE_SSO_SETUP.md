# Google SSO Implementation with NextAuth.js

This guide provides a complete step-by-step implementation of Google SSO (Single Sign-On) using NextAuth.js in your Next.js application.

## Prerequisites

- Node.js 18+ installed
- A Google Cloud Console account
- A Supabase account (for database storage)

## Step 1: Install Dependencies

First, install the required packages:

```bash
yarn add next-auth @auth/core @auth/supabase-adapter
```

## Step 2: Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## Step 3: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret to your `.env.local` file

## Step 4: Generate NextAuth Secret

Generate a secure random string for NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Or use an online generator and add it to your `.env.local` file.

## Step 5: Database Setup (Supabase)

If using Supabase, you'll need to create the necessary tables. Run these SQL commands in your Supabase SQL editor:

```sql
-- Create the auth tables for NextAuth.js
CREATE TABLE IF NOT EXISTS "accounts" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "expires" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamp with time zone,
  "image" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "accounts_provider_providerAccountId_idx" ON "accounts"("provider", "providerAccountId");
CREATE INDEX IF NOT EXISTS "sessions_sessionToken_idx" ON "sessions"("sessionToken");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
```

## Step 6: File Structure

The implementation includes the following files:

```
src/
├── lib/
│   └── auth.js                    # NextAuth configuration
├── components/
│   ├── SessionProvider.js         # Session provider wrapper
│   ├── AuthButton.js             # Sign in/out button component
│   └── ProtectedRoute.js         # Route protection component
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.js      # NextAuth API routes
│   ├── auth/
│   │   └── signin/
│   │       └── page.js           # Custom sign-in page
│   ├── dashboards/
│   │   └── page.js               # Protected dashboard
│   └── layout.js                 # Root layout with SessionProvider
```

## Step 7: Testing the Implementation

1. Start your development server:
   ```bash
   yarn dev
   ```

2. Navigate to `http://localhost:3000`

3. Click the "Sign in with Google" button

4. Complete the Google OAuth flow

5. You should be redirected to the dashboard after successful authentication

## Step 8: Customization Options

### Custom Sign-in Page
The sign-in page is located at `/auth/signin` and can be customized to match your design.

### Protected Routes
Use the `ProtectedRoute` component to protect any page:

```jsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Session Data
Access session data in any component:

```jsx
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

## Step 9: Production Deployment

1. Update your Google OAuth redirect URIs to include your production domain
2. Set the correct `NEXTAUTH_URL` in your production environment
3. Ensure all environment variables are set in your hosting platform
4. Deploy your application

## Troubleshooting

### Common Issues:

1. **"Invalid redirect_uri" error**: Make sure your redirect URI in Google Cloud Console matches exactly
2. **"Invalid client" error**: Verify your Google Client ID and Secret are correct
3. **Session not persisting**: Check that your database tables are created correctly
4. **CORS errors**: Ensure your domain is properly configured in Google Cloud Console

### Debug Mode

Enable debug mode by adding to your `.env.local`:

```env
DEBUG=next-auth:*
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **HTTPS**: Always use HTTPS in production
3. **Session Security**: Use strong, random NEXTAUTH_SECRET
4. **Database Security**: Ensure your database connection is secure
5. **Rate Limiting**: Consider implementing rate limiting for auth endpoints

## Additional Features

### Multiple Providers
You can add more providers to the `authOptions` in `src/lib/auth.js`:

```javascript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
],
```

### Custom Callbacks
Add custom logic to the authentication flow:

```javascript
callbacks: {
  async signIn({ user, account, profile }) {
    // Custom sign-in logic
    return true;
  },
  async session({ session, user }) {
    // Add custom data to session
    session.user.role = user.role;
    return session;
  },
},
```

This implementation provides a complete, secure, and scalable Google SSO solution for your Next.js application. 