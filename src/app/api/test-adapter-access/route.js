import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const results = {
      tables: {},
      adapter: {},
      recommendations: []
    };

    // Test basic table access
    const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        results.tables[table] = {
          accessible: !error,
          error: error?.message || null,
          hasData: data && data.length > 0
        };
      } catch (error) {
        results.tables[table] = {
          accessible: false,
          error: error.message,
          hasData: false
        };
      }
    }

    // Test service role access specifically
    try {
      // Test creating a session (this is what the adapter does)
      const testSessionData = {
        sessionToken: 'test-session-' + Date.now(),
        userId: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };

      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert([testSessionData])
        .select()
        .single();

      if (sessionError) {
        results.adapter.sessionCreation = {
          success: false,
          error: sessionError.message
        };
      } else {
        // Clean up test session
        await supabase
          .from('sessions')
          .delete()
          .eq('sessionToken', testSessionData.sessionToken);
        
        results.adapter.sessionCreation = {
          success: true,
          error: null
        };
      }
    } catch (error) {
      results.adapter.sessionCreation = {
        success: false,
        error: error.message
      };
    }

    // Generate recommendations
    const inaccessibleTables = Object.entries(results.tables)
      .filter(([table, result]) => !result.accessible)
      .map(([table]) => table);

    if (inaccessibleTables.length > 0) {
      results.recommendations.push(
        `❌ Tables not accessible: ${inaccessibleTables.join(', ')}`
      );
    }

    if (!results.adapter.sessionCreation.success) {
      results.recommendations.push(
        '❌ Session creation failed - check RLS policies and service role permissions'
      );
    }

    const allTablesAccessible = Object.values(results.tables)
      .every(result => result.accessible);
    
    const adapterWorking = results.adapter.sessionCreation.success;

    return Response.json({
      success: allTablesAccessible && adapterWorking,
      results,
      message: allTablesAccessible && adapterWorking 
        ? 'All tables accessible and adapter should work correctly'
        : 'Issues detected with table access or adapter functionality',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error testing adapter access:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test adapter access'
    }, { status: 500 });
  }
} 