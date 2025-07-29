import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    console.log('🧪 Testing manual user creation...');
    
    const testUser = {
      id: 'test-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating test user:', testUser);

    const { data, error } = await supabase
      .from('users')
      .insert([testUser])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating test user:', error);
      return Response.json({ 
        success: false, 
        error: error.message,
        details: error,
        timestamp: new Date().toISOString()
      });
    }

    console.log('✅ Test user created successfully:', data);
    return Response.json({ 
      success: true, 
      user: data,
      message: 'Test user created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Exception creating test user:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}