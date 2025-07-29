export async function GET() {
  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING'
  };

  const missingVars = Object.entries(envCheck)
    .filter(([key, value]) => value === 'MISSING' || !value)
    .map(([key]) => key);

  return Response.json({
    success: missingVars.length === 0,
    environment: envCheck,
    missing: missingVars,
    message: missingVars.length > 0 
      ? `Missing environment variables: ${missingVars.join(', ')}`
      : 'All required environment variables are set'
  });
} 