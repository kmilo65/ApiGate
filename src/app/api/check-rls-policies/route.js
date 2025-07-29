import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🔍 Checking RLS Policies...');
    
    const results = {
      policies: {},
      recommendations: []
    };
    
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    // Test table access with different approaches
    for (const table of tables) {
      try {
        // Test 1: Basic select
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        // Test 2: Insert (to check write permissions)
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert([{ /* empty insert to test permissions */ }])
          .select();
        
        results.policies[table] = {
          canRead: !selectError,
          canWrite: !insertError,
          readError: selectError?.message || null,
          writeError: insertError?.message || null
        };
        
        console.log(`📋 ${table}: READ=${results.policies[table].canRead ? '✅' : '❌'}, WRITE=${results.policies[table].canWrite ? '✅' : '❌'}`);
        
      } catch (error) {
        results.policies[table] = {
          canRead: false,
          canWrite: false,
          readError: error.message,
          writeError: error.message
        };
        console.log(`📋 ${table}: ❌ ERROR - ${error.message}`);
      }
    }
    
    // Check if all tables are accessible
    const allTablesReadable = Object.values(results.policies).every(policy => policy.canRead);
    const allTablesWritable = Object.values(results.policies).every(policy => policy.canWrite);
    
    if (!allTablesReadable || !allTablesWritable) {
      results.recommendations.push('❌ RLS policies are too restrictive');
      results.recommendations.push('Run the RLS fix SQL script again');
      results.recommendations.push('Or temporarily disable RLS for testing');
    } else {
      results.recommendations.push('✅ RLS policies look good');
      results.recommendations.push('Check if there are other authentication issues');
    }
    
    console.log('📊 RLS Policy Check Complete');
    
    return Response.json({
      success: allTablesReadable && allTablesWritable,
      results,
      message: allTablesReadable && allTablesWritable 
        ? 'All tables accessible - RLS policies are working'
        : 'Some tables not accessible - RLS policies need fixing',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error checking RLS policies:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to check RLS policies',
      timestamp: new Date().toISOString()
    });
  }
}