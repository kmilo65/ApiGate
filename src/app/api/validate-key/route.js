import { supabase } from '../../lib/supabaseClient';

export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    if (!body || !body.apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'API key is required',
          valid: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const { apiKey } = body;

    // Validate API key format (basic validation)
    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key format',
          valid: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Query Supabase for API key validation
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, permissions, last_used')
      .eq('key', apiKey.trim())
      .single();

    // Handle Supabase errors
    if (error) {
      console.error('Supabase error:', error);
      
      // Handle specific Supabase errors
      if (error.code === 'PGRST116') {
        // No rows returned (invalid API key)
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API key',
            valid: false 
          }), 
          { 
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Other database errors
      return new Response(
        JSON.stringify({ 
          error: 'Database error occurred',
          valid: false 
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // API key is valid
    if (data && data.id) {
      // Update last_used timestamp (optional)
      try {
        await supabase
          .from('api_keys')
          .update({ last_used: new Date().toISOString() })
          .eq('id', data.id);
      } catch (updateError) {
        // Log but don't fail the request for this
        console.warn('Failed to update last_used timestamp:', updateError);
      }

      return new Response(
        JSON.stringify({ 
          valid: true,
          message: 'Valid API key',
          keyInfo: {
            id: data.id,
            name: data.name,
            permissions: data.permissions
          }
        }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Fallback for invalid API key
    return new Response(
      JSON.stringify({ 
        error: 'Invalid API key',
        valid: false 
      }), 
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('API route error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          valid: false 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Handle other unexpected errors
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        valid: false 
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