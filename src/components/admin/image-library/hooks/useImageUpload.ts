import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

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
        console.log('🚀 Starting simplified upload for:', file.name);

        // Compress and resize image for puzzle engine (optimal for jigsaw puzzles)
        const compressionOptions = {
          maxSizeMB: 1.5, // Smaller for better performance
          maxWidthOrHeight: 1024, // Optimal size for puzzle engine (jigsaw game uses max 400px display)
          useWebWorker: true,
          fileType: 'image/jpeg',
          quality: 0.9 // Higher quality for puzzle details
        };
        
        const compressedFile = await imageCompression(file, compressionOptions);
        console.log('✅ Image compressed:', {
          original: file.size,
          compressed: compressedFile.size,
          reduction: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`
        });

        // Create thumbnail optimized for grid display  
        const thumbnailOptions = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 400, // Matches ImageGrid display size
          useWebWorker: true,
          fileType: 'image/jpeg',
          quality: 0.75
        };
        
        const thumbnailFile = await imageCompression(file, thumbnailOptions);
        console.log('✅ Thumbnail created');

        // Upload main image
        const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '.jpg')}`;
        const { data: imageUpload, error: imageError } = await supabase.storage
          .from('processed_images')
          .upload(fileName, compressedFile);

        if (imageError) {
          console.error('❌ Image upload error:', imageError);
          throw imageError;
        }

        // Upload thumbnail
        const thumbnailFileName = `thumb-${fileName}`;
        const { data: thumbnailUpload, error: thumbnailError } = await supabase.storage
          .from('processed_images')
          .upload(thumbnailFileName, thumbnailFile);

        if (thumbnailError) {
          console.error('❌ Thumbnail upload error:', thumbnailError);
          throw thumbnailError;
        }

        console.log('✅ Both files uploaded successfully');

        // Get public URLs
        const { data: { publicUrl: imageUrl } } = supabase.storage
          .from('processed_images')
          .getPublicUrl(fileName);

        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('processed_images')
          .getPublicUrl(thumbnailFileName);

        console.log('🔗 Generated URLs:', { imageUrl, thumbnailUrl });

        // Get image dimensions for metadata
        const img = new Image();
        const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.src = URL.createObjectURL(compressedFile);
        });

        // Create simplified product image record
        console.log('💾 Creating database record...');
        const { data: productImageData, error: productImageError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            description: `Uploaded image: ${file.name}`,
            status: 'active',
            created_by: user.id,
            metadata: {
              width: dimensions.width,
              height: dimensions.height,
              size: compressedFile.size,
              type: compressedFile.type,
              imageUrl: imageUrl,
              thumbnailUrl: thumbnailUrl
            }
          })
          .select()
          .single();

        if (productImageError) {
          console.error('❌ Database error:', productImageError);
          throw productImageError;
        }

        console.log('✅ Product record created with URLs:', productImageData);
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