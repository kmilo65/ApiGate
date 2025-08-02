import { supabase } from '../../lib/supabaseClient';

// GET /api/keys - List all API keys
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch API keys',
          details: error.message 
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: data || [],
        count: data?.length || 0
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('GET API route error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'Failed to process request'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// POST /api/keys - Create a new API key
export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    if (!body) {
      return new Response(
        JSON.stringify({ 
          error: 'Request body is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { name, description, permissions } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Name is required and must be a non-empty string' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Generate API key
    const newKey = {
      name: name.trim(),
      key: `pk_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
      description: description?.trim() || '',
      permissions: permissions || [],
      created_at: new Date().toISOString(),
      last_used: null
    };

    // Insert into database
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create API key',
          details: error.message 
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: data,
        message: 'API key created successfully'
      }), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('POST API route error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'Failed to process request'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 