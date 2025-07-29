import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const results = {
    environment: {},
    database: {},
    auth: {},
    errors: []
  };

  try {
    // Test 1: Environment Variables
    console.log('🔧 Testing environment variables...');
    results.environment = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING'
    };

    // Test 2: Database Connection
    console.log('🔧 Testing database connection...');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      results.database = {
        connected: !error,
        error: error?.message || null
      };
    } catch (dbError) {
      results.database = {
        connected: false,
        error: dbError.message
      };
      results.errors.push(`Database error: ${dbError.message}`);
    }

    // Test 3: NextAuth Tables
    console.log('🔧 Testing NextAuth tables...');
    const tables = ['users', 'accounts', 'sessions'];
    results.auth.tables = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results.auth.tables[table] = {
          exists: !error,
          error: error?.message || null
        };
      } catch (error) {
        results.auth.tables[table] = {
          exists: false,
          error: error.message
        };
        results.errors.push(`Table ${table} error: ${error.message}`);
      }
    }

    // Determine the most likely issue
    const missingEnv = Object.entries(results.environment)
      .filter(([key, value]) => value === 'MISSING' || !value)
      .map(([key]) => key);

    if (missingEnv.length > 0) {
      results.errors.push(`Missing environment variables: ${missingEnv.join(', ')}`);
    }

    if (!results.database.connected) {
      results.errors.push('Database connection failed');
    }

    const tableErrors = Object.entries(results.auth.tables)
      .filter(([table, result]) => !result.exists)
      .map(([table]) => table);

    if (tableErrors.length > 0) {
      results.errors.push(`Missing tables: ${tableErrors.join(', ')}`);
    }

    console.log('📊 Auth test results:', results);

    return Response.json({
      success: results.errors.length === 0,
      results,
      message: results.errors.length > 0 
        ? `Issues found: ${results.errors.join('; ')}`
        : 'All authentication components working correctly'
    });

  } catch (error) {
    console.error('❌ Error in auth test:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to run authentication test'
    });
  }
} 