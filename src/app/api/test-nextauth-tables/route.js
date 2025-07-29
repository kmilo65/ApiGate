import { supabase } from '@/lib/supabaseClient';

export async function GET(request) {
  try {
    console.log('🧪 Testing NextAuth tables...');
    
    const results = {};
    
    // Test if public.users table exists (NextAuth table)
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      results.nextauthUsersTable = {
        exists: !usersError,
        error: usersError?.message || null
      };
    } catch (error) {
      results.nextauthUsersTable = {
        exists: false,
        error: error.message
      };
    }
    
    // Test if public.accounts table exists
    try {
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('count')
        .limit(1);
      
      results.accountsTable = {
        exists: !accountsError,
        error: accountsError?.message || null
      };
    } catch (error) {
      results.accountsTable = {
        exists: false,
        error: error.message
      };
    }
    
    // Test if public.sessions table exists
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('count')
        .limit(1);
      
      results.sessionsTable = {
        exists: !sessionsError,
        error: sessionsError?.message || null
      };
    } catch (error) {
      results.sessionsTable = {
        exists: false,
        error: error.message
      };
    }
    
    // Test if public.verification_tokens table exists
    try {
      const { data: verificationData, error: verificationError } = await supabase
        .from('verification_tokens')
        .select('count')
        .limit(1);
      
      results.verificationTokensTable = {
        exists: !verificationError,
        error: verificationError?.message || null
      };
    } catch (error) {
      results.verificationTokensTable = {
        exists: false,
        error: error.message
      };
    }
    
    // Check if all required tables exist
    const allTablesExist = Object.values(results).every(table => table.exists);
    
    return Response.json({
      success: true,
      message: allTablesExist ? 'All NextAuth tables exist' : 'Some NextAuth tables are missing',
      tables: results,
      allTablesExist,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error testing NextAuth tables:', error);
    return Response.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}