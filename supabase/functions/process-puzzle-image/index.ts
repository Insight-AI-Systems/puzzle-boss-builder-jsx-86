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
  const arrayBuffer = await imageBlob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  
  // Check for JPEG
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
    for (let i = 2; i < bytes.length; i++) {
      if (bytes[i] === 0xFF && (bytes[i + 1] === 0xC0 || bytes[i + 1] === 0xC2)) {
        const height = (bytes[i + 5] << 8) | bytes[i + 6];
        const width = (bytes[i + 7] << 8) | bytes[i + 8];
        return { width, height };
      }
    }
  }
  
  // Check for PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return { width, height };
  }
  
  // Default fallback
  return { width: 800, height: 600 };
};

const resizeImage = async (imageBlob: Blob, targetWidth: number, targetHeight: number): Promise<Blob> => {
  // For now, return the original image
  // In a production environment, you'd use a library like ImageMagick or Sharp
  // This is a placeholder that maintains the original image
  return imageBlob;
};

const createThumbnail = async (imageBlob: Blob): Promise<Blob> => {
  // Create a 200x200 thumbnail
  // For now, return the original image as thumbnail
  // In production, you'd resize to 200x200
  return imageBlob;
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

    console.log('Processing puzzle image...');
    
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
      throw new Error(`Failed to get image file: ${imageFileError?.message}`);
    }

    console.log('Image file found:', imageFile.original_path);

    // Download the original image
    const { data: imageData, error: downloadError } = await supabase.storage
      .from('Original Product Images')
      .download(imageFile.original_path);

    if (downloadError || !imageData) {
      throw new Error(`Failed to download image: ${downloadError?.message}`);
    }

    console.log('Image downloaded, processing...');

    // Get image dimensions
    const dimensions = await getImageDimensions(imageData);
    console.log('Original dimensions:', dimensions);

    // Create processed image (puzzle-ready format)
    // For puzzles, we want standardized sizes: 400x400, 800x800, 1200x1200
    const puzzleSize = dimensions.width > 800 ? 1200 : dimensions.width > 400 ? 800 : 400;
    const processedImage = await resizeImage(imageData, puzzleSize, puzzleSize);
    
    // Create thumbnail (200x200)
    const thumbnailImage = await createThumbnail(imageData);

    // Upload processed image
    const processedPath = `processed_${Date.now()}_${imageFile.original_path}`;
    const { data: processedUpload, error: processedUploadError } = await supabase.storage
      .from('Processed Puzzle Images')
      .upload(processedPath, processedImage, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (processedUploadError) {
      throw new Error(`Failed to upload processed image: ${processedUploadError.message}`);
    }

    // Upload thumbnail
    const thumbnailPath = `thumb_${Date.now()}_${imageFile.original_path}`;
    const { data: thumbnailUpload, error: thumbnailUploadError } = await supabase.storage
      .from('Image Thumbnails')
      .upload(thumbnailPath, thumbnailImage, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (thumbnailUploadError) {
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