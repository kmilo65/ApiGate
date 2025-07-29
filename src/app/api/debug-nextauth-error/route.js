import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🔍 Detailed NextAuth Error Diagnosis...');
    
    const diagnostics = {
      environment: {},
      database: {},
      adapter: {},
      recommendations: []
    };
    
    // Check environment variables
    diagnostics.environment = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
    };
    
    // Test database connection with service role
    try {
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      diagnostics.database = {
        connection: !testError,
        error: testError?.message || null,
        canReadUsers: !testError
      };
    } catch (error) {
      diagnostics.database = {
        connection: false,
        error: error.message,
        canReadUsers: false
      };
    }
    
    // Test specific table access
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    diagnostics.database.tables = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        diagnostics.database.tables[table] = {
          accessible: !error,
          error: error?.message || null
        };
      } catch (error) {
        diagnostics.database.tables[table] = {
          accessible: false,
          error: error.message
        };
      }
    }
    
    // Check if all tables are accessible
    const allTablesAccessible = Object.values(diagnostics.database.tables)
      .every(table => table.accessible);
    
    // Generate recommendations
    if (!diagnostics.environment.SUPABASE_SERVICE_ROLE_KEY) {
      diagnostics.recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
    }
    
    if (!diagnostics.environment.NEXT_PUBLIC_SUPABASE_URL) {
      diagnostics.recommendations.push('Add NEXT_PUBLIC_SUPABASE_URL to .env.local');
    }
    
    if (!diagnostics.database.connection) {
      diagnostics.recommendations.push('Check Supabase connection and service role key');
    }
    
    if (!allTablesAccessible) {
      diagnostics.recommendations.push('Check RLS policies for NextAuth tables');
      diagnostics.recommendations.push('Verify tables exist in public schema');
    }
    
    // Check if this might be a schema issue
    const hasSchemaError = Object.values(diagnostics.database.tables)
      .some(table => table.error?.includes('schema'));
    
    if (hasSchemaError) {
      diagnostics.recommendations.push('Tables might be in wrong schema - ensure they are in public schema');
    }
    
    console.log('📊 Diagnostics:', diagnostics);
    
    return Response.json({
      success: allTablesAccessible && diagnostics.database.connection,
      diagnostics,
      message: allTablesAccessible 
        ? 'All tables accessible - issue might be with adapter configuration'
        : 'Some tables not accessible - check permissions and schema',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in diagnostics:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to run diagnostics',
      timestamp: new Date().toISOString()
    });
  }
}