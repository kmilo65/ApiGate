import { supabase } from '@/lib/supabaseClient';
import { UserService } from '@/lib/userService';

export async function GET() {
  try {
    const results = {
      tables: {},
      testUser: {},
      recommendations: []
    };

    // Check if required tables exist and are accessible
    const requiredTables = ['users', 'app_users'];
    
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

    // Test user creation (simulate the hybrid approach)
    try {
      const testUserData = {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
        provider: 'google',
        provider_id: 'test-provider-id'
      };

      const createResult = await UserService.createUser(testUserData);
      
      if (createResult.success) {
        results.testUser = {
          success: true,
          user: createResult.user,
          nextAuthUser: createResult.nextAuthUser,
          message: createResult.message
        };

        // Clean up test user
        if (createResult.nextAuthUser?.id) {
          await supabase.from('users').delete().eq('id', createResult.nextAuthUser.id);
        }
        if (createResult.user?.nextauth_user_id) {
          await supabase.from('app_users').delete().eq('nextauth_user_id', createResult.user.nextauth_user_id);
        }
      } else {
        results.testUser = {
          success: false,
          error: createResult.error
        };
      }
    } catch (error) {
      results.testUser = {
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

    if (!results.testUser.success) {
      results.recommendations.push(
        '❌ User creation test failed - check database permissions and schema'
      );
    }

    const allTablesAccessible = Object.values(results.tables)
      .every(result => result.accessible);
    
    const userCreationWorking = results.testUser.success;

    return Response.json({
      success: allTablesAccessible && userCreationWorking,
      results,
      message: allTablesAccessible && userCreationWorking 
        ? 'User persistence is working correctly'
        : 'Issues detected with user persistence',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error testing user persistence:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test user persistence'
    }, { status: 500 });
  }
} 