import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    console.log('🔍 Testing integrated_users view...');
    
    const results = {
      viewExists: false,
      canQuery: false,
      error: null,
      sampleData: null
    };

    // Test if the integrated_users view exists and is accessible
    try {
      const { data, error } = await supabase
        .from('integrated_users')
        .select('*')
        .limit(1);

      if (error) {
        results.error = error.message;
        console.log('❌ Error querying integrated_users view:', error.message);
      } else {
        results.viewExists = true;
        results.canQuery = true;
        results.sampleData = data;
        console.log('✅ integrated_users view is accessible');
      }
    } catch (error) {
      results.error = error.message;
      console.log('❌ Exception querying integrated_users view:', error.message);
    }

    // Also test the basic users table
    console.log('🔍 Testing basic users table...');
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (usersError) {
        console.log('❌ Error querying users table:', usersError.message);
      } else {
        console.log('✅ users table is accessible');
      }
    } catch (error) {
      console.log('❌ Exception querying users table:', error.message);
    }

    return Response.json({
      success: results.canQuery,
      results,
      message: results.canQuery 
        ? 'integrated_users view is working correctly'
        : `integrated_users view issue: ${results.error}`
    });

  } catch (error) {
    console.error('❌ Error in integrated view test:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test integrated_users view'
    });
  }
} 