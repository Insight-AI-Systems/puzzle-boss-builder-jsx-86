import { supabase } from '@/integrations/supabase/client';
import { processImageComplete } from './imageProcessor';

export const fixStuckImages = async () => {
  console.log('Starting to fix stuck images...');
  
  try {
    // Get all pending product images
    const { data: stuckImages, error: fetchError } = await supabase
      .from('product_images')
      .select(`
        *,
        image_files (*)
      `)
      .eq('status', 'pending');

    if (fetchError) {
      throw fetchError;
    }

    console.log('Found stuck images:', stuckImages?.length || 0);

    for (const image of stuckImages || []) {
      console.log('Processing stuck image:', image.name);
      
      const imageFile = Array.isArray(image.image_files) ? image.image_files[0] : image.image_files;
      
      if (!imageFile?.original_path) {
        console.log('No original path found for:', image.name);
        continue;
      }

      try {
        // Download the original image
        const { data: originalBlob, error: downloadError } = await supabase.storage
          .from('original_images')
          .download(imageFile.original_path);

        if (downloadError || !originalBlob) {
          console.error('Failed to download original image:', downloadError);
          continue;
        }

        // Convert blob to file for processing
        const file = new File([originalBlob], image.name, { type: originalBlob.type });
        
        // Process the image
        const processedData = await processImageComplete(file);
        console.log('Processed data for', image.name, ':', processedData.dimensions);

        // Upload thumbnail if not exists
        let thumbnailPath = imageFile.thumbnail_path;
        if (!thumbnailPath) {
          thumbnailPath = `thumb_${Date.now()}_${image.name}`;
          const { error: thumbnailUploadError } = await supabase.storage
            .from('thumbnails')
            .upload(thumbnailPath, processedData.thumbnailBlob, {
              upsert: false,
              cacheControl: '3600'
            });

          if (thumbnailUploadError) {
            console.error('Thumbnail upload error:', thumbnailUploadError);
            continue;
          }
        }

        // Upload processed image if not exists
        let processedPath = imageFile.processed_path;
        if (!processedPath) {
          processedPath = `processed_${Date.now()}_${image.name}`;
          const { error: processedUploadError } = await supabase.storage
            .from('processed_images')
            .upload(processedPath, processedData.resizedBlob, {
              upsert: false,
              cacheControl: '3600'
            });

          if (processedUploadError) {
            console.error('Processed image upload error:', processedUploadError);
            continue;
          }
        }

        // Update image_files record
        const { error: updateFileError } = await supabase
          .from('image_files')
          .update({
            processed_path: processedPath,
            thumbnail_path: thumbnailPath,
            original_width: processedData.dimensions.width,
            original_height: processedData.dimensions.height,
            processed_width: 800,
            processed_height: 800,
            processing_status: 'completed'
          })
          .eq('id', imageFile.id);

        if (updateFileError) {
          console.error('Failed to update image file:', updateFileError);
          continue;
        }

        // Update product image status and metadata
        const { error: updateProductError } = await supabase
          .from('product_images')
          .update({
            status: 'active',
            metadata: {
              size: (image.metadata as any)?.size || 0,
              type: (image.metadata as any)?.type || 'image/jpeg',
              width: processedData.dimensions.width,
              height: processedData.dimensions.height
            }
          })
          .eq('id', image.id);

        if (updateProductError) {
          console.error('Failed to update product image:', updateProductError);
          continue;
        }

        console.log('Successfully fixed image:', image.name);
      } catch (error) {
        console.error('Error processing image', image.name, ':', error);
        continue;
      }
    }

    console.log('Finished fixing stuck images');
    return { success: true, processedCount: stuckImages?.length || 0 };
  } catch (error) {
    console.error('Error in fixStuckImages:', error);
    throw error;
  }
};