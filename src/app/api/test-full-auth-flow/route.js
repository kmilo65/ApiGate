import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🧪 Testing Full Authentication Flow...');
    
    const testResults = {
      database: {},
      adapter: {},
      recommendations: []
    };
    
    // Test 1: Database connection and table access
    console.log('📋 Testing database access...');
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    for (const table of tables) {
      try {
        // Test read access
        const { data: readData, error: readError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        // Test write access (simulate user creation)
        const testData = table === 'users' ? {
          name: 'Test User',
          email: 'test@example.com'
        } : table === 'accounts' ? {
          userId: '00000000-0000-0000-0000-000000000000',
          type: 'oauth',
          provider: 'google',
          providerAccountId: 'test123'
        } : table === 'sessions' ? {
          sessionToken: 'test-session-token',
          userId: '00000000-0000-0000-0000-000000000000',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        } : {
          identifier: 'test@example.com',
          token: 'test-token',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        const { data: writeData, error: writeError } = await supabase
          .from(table)
          .insert([testData])
          .select();
        
        testResults.database[table] = {
          canRead: !readError,
          canWrite: !writeError,
          readError: readError?.message || null,
          writeError: writeError?.message || null,
          hasData: readData && readData.length > 0
        };
        
        console.log(`   ${table}: READ=${testResults.database[table].canRead ? '✅' : '❌'}, WRITE=${testResults.database[table].canWrite ? '✅' : '❌'}`);
        
      } catch (error) {
        testResults.database[table] = {
          canRead: false,
          canWrite: false,
          readError: error.message,
          writeError: error.message,
          hasData: false
        };
        console.log(`   ${table}: ❌ ERROR - ${error.message}`);
      }
    }
    
    // Test 2: Simulate NextAuth adapter operations
    console.log('📋 Testing adapter operations...');
    
    // Simulate getUserByAccount
    try {
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('provider', 'google')
        .eq('providerAccountId', 'test123')
        .single();
      
      testResults.adapter.getUserByAccount = {
        success: !accountError,
        error: accountError?.message || null
      };
    } catch (error) {
      testResults.adapter.getUserByAccount = {
        success: false,
        error: error.message
      };
    }
    
    // Simulate createUser
    try {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg'
      };
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([testUser])
        .select()
        .single();
      
      testResults.adapter.createUser = {
        success: !userError,
        error: userError?.message || null,
        userId: userData?.id || null
      };
    } catch (error) {
      testResults.adapter.createUser = {
        success: false,
        error: error.message
      };
    }
    
    // Analyze results
    const allTablesAccessible = Object.values(testResults.database).every(table => table.canRead && table.canWrite);
    const adapterWorking = testResults.adapter.getUserByAccount.success && testResults.adapter.createUser.success;
    
    if (!allTablesAccessible) {
      testResults.recommendations.push('❌ Database tables not fully accessible');
      testResults.recommendations.push('Check RLS policies and table permissions');
    }
    
    if (!adapterWorking) {
      testResults.recommendations.push('❌ Adapter operations failing');
      testResults.recommendations.push('Check table structure and constraints');
    }
    
    if (allTablesAccessible && adapterWorking) {
      testResults.recommendations.push('✅ Database and adapter working correctly');
      testResults.recommendations.push('Issue might be in NextAuth configuration');
    }
    
    console.log('📊 Full Auth Flow Test Complete');
    
    return Response.json({
      success: allTablesAccessible && adapterWorking,
      testResults,
      message: allTablesAccessible && adapterWorking 
        ? 'Full authentication flow working'
        : 'Issues detected in authentication flow',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in full auth flow test:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test full auth flow',
      timestamp: new Date().toISOString()
    });
  }
}