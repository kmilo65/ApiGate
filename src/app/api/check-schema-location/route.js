import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🔍 Checking table schema locations...');
    
    const results = {
      publicSchema: {},
      authSchema: {},
      recommendations: []
    };
    
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    // Check tables in public schema
    console.log('📋 Checking public schema...');
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results.publicSchema[table] = {
          exists: !error,
          error: error?.message || null
        };
        
        console.log(`   ${table}: ${results.publicSchema[table].exists ? '✅ EXISTS' : '❌ MISSING'}`);
        
      } catch (error) {
        results.publicSchema[table] = {
          exists: false,
          error: error.message
        };
        console.log(`   ${table}: ❌ ERROR - ${error.message}`);
      }
    }
    
    // Check tables in auth schema (if they exist there)
    console.log('📋 Checking auth schema...');
    for (const table of tables) {
      try {
        // Try to query with explicit schema
        const { data, error } = await supabase
          .rpc('check_table_exists', { 
            schema_name: 'auth', 
            table_name: table 
          });
        
        results.authSchema[table] = {
          exists: !error && data,
          error: error?.message || null
        };
        
        console.log(`   ${table}: ${results.authSchema[table].exists ? '✅ EXISTS' : '❌ MISSING'}`);
        
      } catch (error) {
        results.authSchema[table] = {
          exists: false,
          error: error.message
        };
        console.log(`   ${table}: ❌ ERROR - ${error.message}`);
      }
    }
    
    // Analyze results
    const publicTablesExist = Object.values(results.publicSchema).some(table => table.exists);
    const authTablesExist = Object.values(results.authSchema).some(table => table.exists);
    
    if (publicTablesExist && !authTablesExist) {
      results.recommendations.push('✅ Tables are correctly in public schema');
      results.recommendations.push('Check RLS policies and service role permissions');
    } else if (authTablesExist && !publicTablesExist) {
      results.recommendations.push('❌ Tables are in auth schema but should be in public schema');
      results.recommendations.push('Run the SQL script to create tables in public schema');
    } else if (!publicTablesExist && !authTablesExist) {
      results.recommendations.push('❌ Tables don\'t exist in either schema');
      results.recommendations.push('Run the SQL script to create tables in public schema');
    } else {
      results.recommendations.push('⚠️ Tables exist in both schemas - this might cause conflicts');
      results.recommendations.push('Ensure NextAuth uses public schema tables');
    }
    
    console.log('📊 Schema Analysis Complete');
    
    return Response.json({
      success: publicTablesExist,
      results,
      message: publicTablesExist 
        ? 'Tables exist in public schema - check permissions'
        : 'Tables missing from public schema - run SQL script',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error checking schema locations:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to check schema locations',
      timestamp: new Date().toISOString()
    });
  }
}