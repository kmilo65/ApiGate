import { supabase } from '../../lib/supabaseClient';

// GET: List all API keys
export async function GET(request) {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

// POST: Create a new API key
export async function POST(request) {
  const body = await request.json();
  const { name, description, permissions } = body;
  const newKey = {
    name,
    key: `pk_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`,
    description,
    permissions,
    created_at: new Date().toISOString().split('T')[0],
    last_used: new Date().toISOString().split('T')[0]
  };
  const { data, error } = await supabase
    .from('api_keys')
    .insert([newKey])
    .select();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data[0]), { status: 201 });
}

// PUT: Update an API key
export async function PUT(request) {
  const body = await request.json();
  const { id, name, description, permissions } = body;
  const { error } = await supabase
    .from('api_keys')
    .update({ name, description, permissions })
    .eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

// DELETE: Delete an API key
export async function DELETE(request) {
  const { id } = await request.json();
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 