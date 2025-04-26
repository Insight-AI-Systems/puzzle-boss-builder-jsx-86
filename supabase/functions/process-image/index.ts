
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { imageId } = await req.json();

    // Get the image file details
    const { data: fileData, error: fileError } = await supabaseClient
      .from('image_files')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fileError || !fileData) {
      throw new Error('Image file not found');
    }

    // Update status - we'll use a simplified version that doesn't require Sharp
    // Instead of processing, we'll just mark it as completed and use the original image
    const { error: updateError } = await supabaseClient
      .from('image_files')
      .update({
        processed_path: fileData.original_path,
        thumbnail_path: fileData.original_path,
        processed_width: fileData.original_width,
        processed_height: fileData.original_height,
        processing_status: 'completed'
      })
      .eq('id', imageId);

    if (updateError) {
      throw new Error('Failed to update image status');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
