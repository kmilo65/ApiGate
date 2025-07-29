import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error,
        timestamp: new Date().toISOString()
      });
    }

    console.log('✅ Database connection successful');
    return Response.json({ 
      success: true, 
      message: 'Database connection successful',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Exception in database test:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}