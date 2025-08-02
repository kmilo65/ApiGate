import { supabase } from '../../../lib/supabaseClient';

// GET /api/keys/{id} - Get specific API key
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'API key ID is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase GET error:', error);
      
      if (error.code === 'PGRST116') {
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
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch API key',
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
        data: data
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

// PUT /api/keys/{id} - Update specific API key
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'API key ID is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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

    const updateData = {
      name: name.trim(),
      description: description?.trim() || '',
      permissions: permissions || [],
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PUT error:', error);
      
      if (error.code === 'PGRST116') {
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
        data: data,
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

// DELETE /api/keys/{id} - Delete specific API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ 
          error: 'API key ID is required' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

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