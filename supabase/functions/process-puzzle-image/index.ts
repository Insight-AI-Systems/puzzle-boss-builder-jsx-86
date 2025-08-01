import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageDimensions {
  width: number;
  height: number;
}

const getImageDimensions = async (imageBlob: Blob): Promise<ImageDimensions> => {
  try {
    const arrayBuffer = await imageBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Check for JPEG
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
      for (let i = 2; i < bytes.length - 8; i++) {
        if (bytes[i] === 0xFF && (bytes[i + 1] === 0xC0 || bytes[i + 1] === 0xC2)) {
          const height = (bytes[i + 5] << 8) | bytes[i + 6];
          const width = (bytes[i + 7] << 8) | bytes[i + 8];
          return { width, height };
        }
      }
    }
    
    // Check for PNG
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
      if (bytes.length >= 24) {
        const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
        const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
        return { width, height };
      }
    }
    
    console.log('Could not determine image dimensions, using defaults');
    return { width: 800, height: 600 };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: 800, height: 600 };
  }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing puzzle image request...');
    
    const { imageFileId } = await req.json();
    
    if (!imageFileId) {
      throw new Error('Image file ID is required');
    }

    console.log('Processing image file ID:', imageFileId);

    // Get the image file record
    const { data: imageFile, error: imageFileError } = await supabase
      .from('image_files')
      .select('*')
      .eq('id', imageFileId)
      .single();

    if (imageFileError || !imageFile) {
      console.error('Failed to get image file:', imageFileError);
      throw new Error(`Failed to get image file: ${imageFileError?.message}`);
    }

    console.log('Image file found:', imageFile.original_path);

    // Download the original image
    const { data: imageData, error: downloadError } = await supabase.storage
      .from('Original Product Images')
      .download(imageFile.original_path);

    if (downloadError || !imageData) {
      console.error('Failed to download image:', downloadError);
      throw new Error(`Failed to download image: ${downloadError?.message}`);
    }

    console.log('Image downloaded successfully, size:', imageData.size);

    // Get image dimensions
    const dimensions = await getImageDimensions(imageData);
    console.log('Extracted dimensions:', dimensions);

    // For now, we'll use the original image as both processed and thumbnail
    // In production, you'd resize these properly
    const puzzleSize = dimensions.width > 800 ? 1200 : dimensions.width > 400 ? 800 : 400;
    
    // Upload processed image (for now, same as original)
    const processedPath = `processed_${Date.now()}_${imageFile.original_path.split('/').pop()}`;
    const { data: processedUpload, error: processedUploadError } = await supabase.storage
      .from('Processed Puzzle Images')
      .upload(processedPath, imageData, {
        contentType: imageData.type || 'image/jpeg',
        upsert: false
      });

    if (processedUploadError) {
      console.error('Failed to upload processed image:', processedUploadError);
      throw new Error(`Failed to upload processed image: ${processedUploadError.message}`);
    }

    // Upload thumbnail (for now, same as original) 
    const thumbnailPath = `thumb_${Date.now()}_${imageFile.original_path.split('/').pop()}`;
    const { data: thumbnailUpload, error: thumbnailUploadError } = await supabase.storage
      .from('Image Thumbnails')
      .upload(thumbnailPath, imageData, {
        contentType: imageData.type || 'image/jpeg',
        upsert: false
      });

    if (thumbnailUploadError) {
      console.error('Failed to upload thumbnail:', thumbnailUploadError);
      throw new Error(`Failed to upload thumbnail: ${thumbnailUploadError.message}`);
    }

    console.log('Images uploaded successfully');

    // Update the image file record with processed information
    const { error: updateError } = await supabase
      .from('image_files')
      .update({
        processed_path: processedPath,
        processed_width: puzzleSize,
        processed_height: puzzleSize,
        thumbnail_path: thumbnailPath,
        original_width: dimensions.width,
        original_height: dimensions.height,
        processing_status: 'completed'
      })
      .eq('id', imageFileId);

    if (updateError) {
      console.error('Failed to update image file record:', updateError);
      throw new Error(`Failed to update image file record: ${updateError.message}`);
    }

    console.log('Image processing completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        imageFileId,
        originalDimensions: dimensions,
        processedDimensions: { width: puzzleSize, height: puzzleSize },
        processedPath,
        thumbnailPath
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error processing image:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to process image'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})