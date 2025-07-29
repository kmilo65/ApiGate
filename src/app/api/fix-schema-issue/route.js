import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    console.log('🔧 Diagnosing schema issue...');
    
    const results = {
      tables: {},
      schemas: {},
      recommendations: []
    };

    // Test 1: Check if tables exist in public schema
    const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results.tables[table] = {
          exists: !error,
          error: error?.message || null,
          inPublicSchema: !error
        };
        
        if (error) {
          console.log(`❌ Table ${table} error:`, error.message);
        } else {
          console.log(`✅ Table ${table} exists in public schema`);
        }
      } catch (error) {
        results.tables[table] = {
          exists: false,
          error: error.message,
          inPublicSchema: false
        };
        console.log(`❌ Exception with table ${table}:`, error.message);
      }
    }

    // Test 2: Check if tables exist in auth schema (wrong location)
    for (const table of requiredTables) {
      try {
        // Try to query with explicit auth schema
        const { data, error } = await supabase
          .rpc('check_table_exists', { 
            table_name: table,
            schema_name: 'auth'
          });
        
        if (!error && data) {
          results.schemas[`auth.${table}`] = true;
          console.log(`⚠️ Table ${table} exists in auth schema (wrong location)`);
        }
      } catch (error) {
        // Ignore this error, it's expected
      }
    }

    // Generate recommendations
    const missingTables = Object.entries(results.tables)
      .filter(([table, result]) => !result.exists)
      .map(([table]) => table);

    if (missingTables.length > 0) {
      results.recommendations.push(`Missing tables in public schema: ${missingTables.join(', ')}`);
      results.recommendations.push('Run the NextAuth tables SQL script in Supabase SQL Editor');
    }

    const authSchemaTables = Object.keys(results.schemas);
    if (authSchemaTables.length > 0) {
      results.recommendations.push(`Tables found in auth schema (wrong location): ${authSchemaTables.join(', ')}`);
      results.recommendations.push('Move tables from auth schema to public schema');
    }

    const allTablesExist = Object.values(results.tables).every(table => table.exists);
    
    if (allTablesExist) {
      results.recommendations.push('All tables exist in public schema - check RLS policies');
    }

    console.log('📊 Schema diagnosis complete');

    return Response.json({
      success: allTablesExist,
      results,
      message: allTablesExist 
        ? 'All NextAuth tables exist in public schema'
        : 'Schema issues detected - see recommendations',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in schema diagnosis:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to diagnose schema issues'
    });
  }
} 