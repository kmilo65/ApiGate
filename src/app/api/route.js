import { supabase } from '../../lib/supabaseClient';

// GET: List all API keys
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

// POST: Create a new API key
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
      last_used: new Date().toISOString() // Set to current timestamp instead of null
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select();

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
        message: 'API key created successfully',
        data: data[0]
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
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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

// PUT: Update an API key
export async function PUT(request) {
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

    const { id, name, description, permissions } = body;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'ID is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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

    // Check if API key exists before updating
    const { data: existingKey, error: checkError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key not found' 
        }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Update the API key
    const { error } = await supabase
      .from('api_keys')
      .update({ 
        name: name.trim(),
        description: description?.trim() || '',
        permissions: permissions || []
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase PUT error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update API key',
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
        message: 'API key updated successfully'
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('PUT API route error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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

// DELETE: Delete an API key
export async function DELETE(request) {
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

    const { id } = body;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'ID is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Check if API key exists before deleting
    const { data: existingKey, error: checkError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key not found' 
        }), 
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Delete the API key
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase DELETE error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete API key',
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
        message: 'API key deleted successfully'
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('DELETE API route error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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