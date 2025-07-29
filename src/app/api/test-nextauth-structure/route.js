import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    console.log('🔧 Testing NextAuth table structure...');
    
    const results = {
      tableStructure: {},
      rlsPolicies: {},
      serviceRoleAccess: {},
      recommendations: []
    };

    // Test 1: Check table structure
    const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    for (const table of requiredTables) {
      try {
        // Test basic access
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        results.tableStructure[table] = {
          accessible: !error,
          error: error?.message || null,
          hasData: data && data.length > 0
        };
        
        if (error) {
          console.log(`❌ Table ${table} access error:`, error.message);
        } else {
          console.log(`✅ Table ${table} is accessible`);
        }
      } catch (error) {
        results.tableStructure[table] = {
          accessible: false,
          error: error.message,
          hasData: false
        };
        console.log(`❌ Exception with table ${table}:`, error.message);
      }
    }

    // Test 2: Check specific NextAuth operations
    console.log('🔧 Testing NextAuth-specific operations...');
    
    // Test getUserByAccount (this is what's failing)
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*, users(*)')
        .eq('provider', 'google')
        .eq('providerAccountId', 'test123')
        .single();
      
      results.serviceRoleAccess.getUserByAccount = {
        success: !error,
        error: error?.message || null
      };
      
      if (error) {
        console.log('❌ getUserByAccount test failed:', error.message);
      } else {
        console.log('✅ getUserByAccount test passed');
      }
    } catch (error) {
      results.serviceRoleAccess.getUserByAccount = {
        success: false,
        error: error.message
      };
      console.log('❌ getUserByAccount exception:', error.message);
    }

    // Test createUser
    try {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg'
      };
      
      const { data, error } = await supabase
        .from('users')
        .insert([testUser])
        .select()
        .single();
      
      results.serviceRoleAccess.createUser = {
        success: !error,
        error: error?.message || null,
        userId: data?.id || null
      };
      
      if (error) {
        console.log('❌ createUser test failed:', error.message);
      } else {
        console.log('✅ createUser test passed');
      }
    } catch (error) {
      results.serviceRoleAccess.createUser = {
        success: false,
        error: error.message
      };
      console.log('❌ createUser exception:', error.message);
    }

    // Test createSession
    try {
      const testSession = {
        sessionToken: 'test-session-' + Date.now(),
        userId: '00000000-0000-0000-0000-000000000000',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      const { data, error } = await supabase
        .from('sessions')
        .insert([testSession])
        .select()
        .single();
      
      results.serviceRoleAccess.createSession = {
        success: !error,
        error: error?.message || null
      };
      
      if (error) {
        console.log('❌ createSession test failed:', error.message);
      } else {
        console.log('✅ createSession test passed');
      }
    } catch (error) {
      results.serviceRoleAccess.createSession = {
        success: false,
        error: error.message
      };
      console.log('❌ createSession exception:', error.message);
    }

    // Analyze results
    const allTablesAccessible = Object.values(results.tableStructure).every(table => table.accessible);
    const allOperationsWorking = Object.values(results.serviceRoleAccess).every(op => op.success);
    
    if (!allTablesAccessible) {
      results.recommendations.push('❌ Some tables not accessible - check RLS policies');
    }
    
    if (!allOperationsWorking) {
      results.recommendations.push('❌ NextAuth operations failing - check service role permissions');
    }
    
    if (allTablesAccessible && allOperationsWorking) {
      results.recommendations.push('✅ All NextAuth components working - issue might be elsewhere');
    }

    console.log('📊 NextAuth structure test complete');

    return Response.json({
      success: allTablesAccessible && allOperationsWorking,
      results,
      message: allTablesAccessible && allOperationsWorking 
        ? 'All NextAuth components working correctly'
        : 'NextAuth structure issues detected - see recommendations',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in NextAuth structure test:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test NextAuth structure'
    });
  }
} 