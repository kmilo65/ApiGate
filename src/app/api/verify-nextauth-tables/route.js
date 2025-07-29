import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🔍 Verifying NextAuth tables in public schema...');
    
    const results = {};
    const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    for (const tableName of requiredTables) {
      try {
        // Test if table exists by trying to select from it
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        results[tableName] = {
          exists: !error,
          error: error?.message || null,
          message: error ? `Table ${tableName} not found` : `Table ${tableName} exists`
        };
        
        console.log(`📋 ${tableName}: ${results[tableName].exists ? '✅ EXISTS' : '❌ MISSING'}`);
        
      } catch (error) {
        results[tableName] = {
          exists: false,
          error: error.message,
          message: `Error checking table ${tableName}`
        };
        console.log(`📋 ${tableName}: ❌ ERROR - ${error.message}`);
      }
    }
    
    const allTablesExist = Object.values(results).every(table => table.exists);
    
    if (allTablesExist) {
      console.log('✅ All NextAuth tables exist in public schema');
    } else {
      console.log('❌ Some NextAuth tables are missing');
      console.log('📋 Missing tables:');
      Object.entries(results).forEach(([table, result]) => {
        if (!result.exists) {
          console.log(`   - ${table}: ${result.error}`);
        }
      });
    }
    
    return Response.json({
      success: allTablesExist,
      message: allTablesExist 
        ? 'All NextAuth tables exist in public schema' 
        : 'Some NextAuth tables are missing from public schema',
      tables: results,
      allTablesExist,
      instructions: allTablesExist ? null : {
        action: 'Run the SQL script in Supabase SQL Editor',
        script: 'database/nextauth_tables_only.sql',
        description: 'Create the required NextAuth tables in the public schema'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error verifying NextAuth tables:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to verify NextAuth tables',
      timestamp: new Date().toISOString()
    });
  }
}