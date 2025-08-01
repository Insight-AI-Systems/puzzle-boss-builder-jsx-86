
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processImageComplete } from '@/utils/imageProcessor';

interface ClerkUser {
  id: string;
  primaryEmailAddress?: { emailAddress: string };
}

export const useImageUpload = (user: ClerkUser | null, onUploadComplete: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to upload images",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      console.log('Starting upload process for', files.length, 'files');
      console.log('User object:', user);
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      for (const file of files) {
        console.error('=== UPLOAD DEBUG START ===');
        console.log('Starting complete processing for file:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        // Process image on client side first
        toast({
          title: "Processing Image",
          description: `Processing ${file.name}...`,
        });
        
        console.log('Calling processImageComplete...');
        const processedData = await processImageComplete(file);
        console.log('Client-side processing completed:', processedData.dimensions, 'Thumbnail size:', processedData.thumbnailBlob.size);
        
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        console.log('File path:', filePath);
        
        // Upload original image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('original_images')
          .upload(filePath, file, {
            upsert: false,
            cacheControl: '3600'
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }
        
        // Upload thumbnail
        const thumbnailPath = `thumb_${Date.now()}_${file.name}`;
        const { error: thumbnailUploadError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailPath, processedData.thumbnailBlob, {
            upsert: false,
            cacheControl: '3600'
          });

        if (thumbnailUploadError) {
          console.error('Thumbnail upload error:', thumbnailUploadError);
          throw thumbnailUploadError;
        }

        // Upload processed puzzle image
        const processedPath = `processed_${Date.now()}_${file.name}`;
        const { error: processedUploadError } = await supabase.storage
          .from('processed_images')
          .upload(processedPath, processedData.resizedBlob, {
            upsert: false,
            cacheControl: '3600'
          });

        if (processedUploadError) {
          console.error('Processed image upload error:', processedUploadError);
          throw processedUploadError;
        }
        
        console.log('All files uploaded successfully');

        // Create product image record using Clerk user ID
        const { data: productImageData, error: productImageError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            description: `Uploaded image: ${file.name}`,
            file_urls: [filePath, processedPath, thumbnailPath],
            dimensions: {
              width: processedData.dimensions.width,
              height: processedData.dimensions.height
            },
            status: 'active',
            created_by: user.id
          })
          .select()
          .single();

        if (productImageError) {
          console.error('Product image error:', productImageError);
          throw productImageError;
        }
        
        console.log('Product image record created:', productImageData.id);

        // Create image file record with all processed data
        const { error: fileRecordError } = await supabase
          .from('image_files')
          .insert({
            product_image_id: productImageData.id,
            original_path: filePath,
            processed_path: processedPath,
            thumbnail_path: thumbnailPath,
            original_width: processedData.dimensions.width,
            original_height: processedData.dimensions.height,
            processed_width: 800,
            processed_height: 800,
            original_size: file.size,
            processing_status: 'completed'
          });

        if (fileRecordError) {
          console.error('Image file record error:', fileRecordError);
          throw fileRecordError;
        }
        
        console.log('Image file record created successfully - processing complete!');
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} ${files.length === 1 ? 'image' : 'images'} uploaded successfully`
      });
      
      onUploadComplete();
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message || 'Unknown error'}`);
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleUpload,
    isUploading,
    error
  };
};
