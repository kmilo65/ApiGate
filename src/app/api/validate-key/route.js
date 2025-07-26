import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  const { apiKey } = await request.json();
  const { data } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key', apiKey)
    .single();
  if (data && data.id) {
    return new Response(JSON.stringify({ valid: "Valid API Key" }), { status: 200 });
  }
  return new Response(JSON.stringify({ valid: "Invalid API Key" }), { status: 401 });
} 