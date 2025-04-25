
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.17.0'

interface RequestBody {
  user_id: string;
  email: string;
}

serve(async (req) => {
  // Get the request body
  const { user_id, email } = await req.json() as RequestBody;

  if (!user_id || !email) {
    return new Response(
      JSON.stringify({ error: 'User ID and email are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Get environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const openSupportsApiUrl = Deno.env.get('OPENSUPPORTS_API_URL')!;
  const openSupportsApiKey = Deno.env.get('OPENSUPPORTS_API_KEY')!;

  if (!openSupportsApiUrl || !openSupportsApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenSupports configuration is missing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create a Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    // Make a request to OpenSupports API to get a token
    // Note: This is a simplified example. The actual implementation would depend on your OpenSupports API
    const tokenResponse = await fetch(`${openSupportsApiUrl}/user/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openSupportsApiKey}`
      },
      body: JSON.stringify({
        email: email,
        name: profile.username || email.split('@')[0],
        // Add any other user data needed by your OpenSupports instance
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to get OpenSupports token: ${errorData.message || tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    // Return the token to the client
    return new Response(
      JSON.stringify({ token: tokenData.token }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating OpenSupports token:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})
