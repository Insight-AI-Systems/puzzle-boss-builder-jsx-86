
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import sharp from 'https://esm.sh/sharp@0.32.6';
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

    // Download the original image
    const { data: imageData, error: downloadError } = await supabaseClient
      .storage
      .from('original_images')
      .download(fileData.original_path);

    if (downloadError || !imageData) {
      throw new Error('Failed to download original image');
    }

    // Process the image
    const imageBuffer = await imageData.arrayBuffer();
    const image = sharp(Buffer.from(imageBuffer));

    // Get image metadata
    const metadata = await image.metadata();
    
    // Calculate dimensions to maintain aspect ratio
    const targetWidth = 1024;
    const targetHeight = 1024;
    const { width = 0, height = 0 } = metadata;
    
    let resizeOptions = {
      width: targetWidth,
      height: targetHeight,
      fit: sharp.fit.contain,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    };

    // Process image and create thumbnail
    const [processed, thumbnail] = await Promise.all([
      image
        .resize(resizeOptions)
        .webp({ quality: 90 })
        .toBuffer(),
      image
        .resize({ width: 200, height: 200, fit: sharp.fit.cover })
        .webp({ quality: 80 })
        .toBuffer()
    ]);

    // Upload processed images
    const [processedUpload, thumbnailUpload] = await Promise.all([
      supabaseClient.storage
        .from('processed_images')
        .upload(`${imageId}/processed.webp`, processed, {
          contentType: 'image/webp',
          upsert: true
        }),
      supabaseClient.storage
        .from('thumbnails')
        .upload(`${imageId}/thumbnail.webp`, thumbnail, {
          contentType: 'image/webp',
          upsert: true
        })
    ]);

    if (processedUpload.error || thumbnailUpload.error) {
      throw new Error('Failed to upload processed images');
    }

    // Update database with processed image information
    const { error: updateError } = await supabaseClient
      .from('image_files')
      .update({
        processed_path: `${imageId}/processed.webp`,
        thumbnail_path: `${imageId}/thumbnail.webp`,
        processed_width: targetWidth,
        processed_height: targetHeight,
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
