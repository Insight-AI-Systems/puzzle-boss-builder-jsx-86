// Script to manually process existing images that are stuck in "processing" status
import { supabase } from '@/integrations/supabase/client';

export const processStuckImages = async () => {
  try {
    // Get all images that are stuck in processing
    const { data: stuckImages, error } = await supabase
      .from('image_files')
      .select('*')
      .eq('processing_status', 'processing');

    if (error) {
      console.error('Error fetching stuck images:', error);
      return;
    }

    console.log(`Found ${stuckImages?.length || 0} stuck images to process`);

    if (!stuckImages || stuckImages.length === 0) {
      console.log('No stuck images found');
      return;
    }

    // Process each stuck image
    for (const imageFile of stuckImages) {
      console.log(`Processing stuck image: ${imageFile.id}`);
      
      try {
        const { data: result, error: processError } = await supabase.functions
          .invoke('process-puzzle-image', {
            body: { imageFileId: imageFile.id }
          });

        if (processError) {
          console.error(`Error processing image ${imageFile.id}:`, processError);
        } else {
          console.log(`Successfully processed image ${imageFile.id}:`, result);
        }
      } catch (err) {
        console.error(`Exception processing image ${imageFile.id}:`, err);
      }
      
      // Add a small delay between processing
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Finished processing stuck images');
  } catch (error) {
    console.error('Error in processStuckImages:', error);
  }
};