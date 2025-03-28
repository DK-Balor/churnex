import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, account_type, subscription_id, subscription_tier, expires_at } = await req.json();

    // Validate required fields
    if (!user_id || !account_type) {
      throw new Error('Missing required fields');
    }

    // Update account status
    const { data, error } = await supabaseClient
      .from('account_status')
      .upsert({
        user_id,
        account_type,
        subscription_id,
        subscription_tier,
        expires_at,
        last_updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 