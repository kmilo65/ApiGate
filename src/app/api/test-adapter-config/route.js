import { SupabaseAdapter } from "@auth/supabase-adapter";

export async function GET(request) {
  try {
    console.log('🔧 Testing SupabaseAdapter Configuration...');
    
    const testResults = {
      environment: {},
      adapter: {},
      recommendations: []
    };
    
    // Check environment variables
    testResults.environment = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
    };
    
    // Test SupabaseAdapter configuration
    try {
      const adapter = SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      
      testResults.adapter = {
        configured: true,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSecret: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        adapterType: adapter.constructor.name
      };
      
      console.log('✅ SupabaseAdapter configured successfully');
      
    } catch (error) {
      testResults.adapter = {
        configured: false,
        error: error.message,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSecret: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      };
      
      console.error('❌ SupabaseAdapter configuration failed:', error.message);
    }
    
    // Generate recommendations
    if (!testResults.environment.SUPABASE_SERVICE_ROLE_KEY) {
      testResults.recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
    }
    
    if (!testResults.environment.NEXT_PUBLIC_SUPABASE_URL) {
      testResults.recommendations.push('Add NEXT_PUBLIC_SUPABASE_URL to .env.local');
    }
    
    if (!testResults.adapter.configured) {
      testResults.recommendations.push('Check SupabaseAdapter configuration');
      testResults.recommendations.push('Verify service role key has correct permissions');
    }
    
    // Check if this might be a schema issue
    if (testResults.adapter.configured && testResults.adapter.error?.includes('schema')) {
      testResults.recommendations.push('Tables might be in wrong schema - ensure they are in public schema');
      testResults.recommendations.push('Check if tables exist in auth schema instead of public');
    }
    
    console.log('📊 Adapter Test Results:', testResults);
    
    return Response.json({
      success: testResults.adapter.configured,
      testResults,
      message: testResults.adapter.configured 
        ? 'SupabaseAdapter configured successfully'
        : 'SupabaseAdapter configuration failed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error testing adapter configuration:', error);
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to test adapter configuration',
      timestamp: new Date().toISOString()
    });
  }
}