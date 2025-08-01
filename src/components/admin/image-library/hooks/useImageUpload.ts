import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { processImageComplete } from '@/utils/imageProcessor';

interface ClerkUser {
  id: string;
  primaryEmailAddress?: { emailAddress: string };
  username?: string;
  firstName?: string;
  publicMetadata?: { role?: string };
}

export const useImageUpload = (user: ClerkUser | null, onUploadComplete: () => void) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length || !user) return;

    setIsUploading(true);

    try {
      console.log('🚀 Starting Clerk-based upload process for', files.length, 'files');
      console.log('👤 Clerk User:', user);
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      for (const file of files) {
        console.error('=== UPLOAD DEBUG START ===');
        console.log('Starting complete processing for file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Process the image
        const processedData = await processImageComplete(file);
        console.log('✅ Image processing complete:', processedData);

        // Upload original to storage
        console.log('⬆️ Uploading original to storage...');
        const originalFileName = `${Date.now()}-${file.name}`;
        
        const { data: originalUpload, error: originalError } = await supabase.storage
          .from('Original Product Images')
          .upload(originalFileName, file);

        if (originalError) {
          console.error('❌ Original upload error:', originalError);
          throw originalError;
        }

        console.log('✅ Original upload successful:', originalUpload);

        // Upload processed image
        console.log('⬆️ Uploading processed image...');
        const processedFileName = `${Date.now()}-processed-${file.name}`;
        
        const { data: processedUpload, error: processedError } = await supabase.storage
          .from('Processed Puzzle Images')
          .upload(processedFileName, processedData.resizedBlob);

        if (processedError) {
          console.error('❌ Processed upload error:', processedError);
          throw processedError;
        }

        console.log('✅ Processed upload successful:', processedUpload);

        // Upload thumbnail
        console.log('⬆️ Uploading thumbnail...');
        const thumbnailFileName = `${Date.now()}-thumb-${file.name}`;
        
        const { data: thumbnailUpload, error: thumbnailError } = await supabase.storage
          .from('Image Thumbnails')
          .upload(thumbnailFileName, processedData.thumbnailBlob);

        if (thumbnailError) {
          console.error('❌ Thumbnail upload error:', thumbnailError);
          throw thumbnailError;
        }

        console.log('✅ Thumbnail upload successful:', thumbnailUpload);

        // Get public URLs
        const { data: { publicUrl: originalUrl } } = supabase.storage
          .from('Original Product Images')
          .getPublicUrl(originalFileName);

        const { data: { publicUrl: processedUrl } } = supabase.storage
          .from('Processed Puzzle Images')
          .getPublicUrl(processedFileName);

        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('Image Thumbnails')
          .getPublicUrl(thumbnailFileName);

        const filePaths = [originalUrl, processedUrl, thumbnailUrl];
        console.log('🔗 Generated URLs:', filePaths);
        
        console.log('All files uploaded successfully');

        // Create product image record using Clerk user ID
        console.log('💾 Creating database record...');
        const { data: productImageData, error: productImageError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            description: `Uploaded image: ${file.name}`,
            file_urls: filePaths,
            dimensions: {
              width: processedData.dimensions.width,
              height: processedData.dimensions.height
            },
            status: 'active',
            created_by: user.id // This is now a Clerk user ID (TEXT)
          })
          .select()
          .single();

        if (productImageError) {
          console.error('❌ Database error:', productImageError);
          throw productImageError;
        }

        console.log('✅ Database record created:', productImageData);

        // Create image_files record
        console.log('💾 Creating image_files record...');
        const { data: imageFileData, error: imageFileError } = await supabase
          .from('image_files')
          .insert({
            product_image_id: productImageData.id,
            original_path: originalUrl,
            processed_path: processedUrl,
            thumbnail_path: thumbnailUrl,
            original_width: processedData.dimensions.width,
            original_height: processedData.dimensions.height,
            processed_width: processedData.dimensions.width,
            processed_height: processedData.dimensions.height,
            original_size: file.size,
            processing_status: 'completed'
          })
          .select()
          .single();

        if (imageFileError) {
          console.error('❌ Image files error:', imageFileError);
          throw imageFileError;
        }

        console.log('✅ Image files record created:', imageFileData);
        console.error('=== UPLOAD DEBUG END ===');
      }

      toast({
        title: "Success!",
        description: `Successfully uploaded ${files.length} image(s).`,
      });

      onUploadComplete();
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleUpload,
    isUploading
  };
};