
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductImage } from '../types';
import { toast } from '@/hooks/use-toast';

// Updated to work with Clerk auth - no user dependency needed for public image access
export const useImageLibrary = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading product images with enhanced data...');
      
      // Load product images with associated file data
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select(`
          *,
          image_files (
            id,
            original_path,
            processed_path,
            thumbnail_path,
            original_width,
            original_height,
            processed_width,
            processed_height,
            processing_status
          )
        `)
        .order('created_at', { ascending: false });

      if (imagesError) {
        console.error('Error loading images:', imagesError);
        throw imagesError;
      }

      console.log('Raw images data:', imagesData);

      // Transform the data to match expected format
      const transformedImages: ProductImage[] = (imagesData || []).map(img => {
        const imageFile = Array.isArray(img.image_files) ? img.image_files[0] : img.image_files;
        const hasValidFile = imageFile && imageFile.processing_status === 'completed';
        
        // Get dimensions from metadata or image_files
        const metadataObj = img.metadata as any;
        const width = imageFile?.original_width || metadataObj?.width || 0;
        const height = imageFile?.original_height || metadataObj?.height || 0;
        
        // Choose the best available image URL - use original if processing failed
        let imageUrl = '';
        if (imageFile?.original_path) {
          // Use the actual bucket name from Supabase configuration
          const bucketName = 'original_images'; // This should match the bucket ID, not display name
          const imagePath = imageFile.original_path;
          imageUrl = `https://vcacfysfjgoahledqdwa.supabase.co/storage/v1/object/public/${bucketName}/${imagePath}`;
        }
        
        return {
          id: img.id,
          name: img.name,
          description: img.description,
          category_id: img.category_id,
          tags: img.tags || [],
          imageUrl: imageUrl,
          url: imageUrl, // For compatibility
          status: img.status,
          created_at: img.created_at,
          updated_at: img.updated_at,
          created_by: img.created_by,
          metadata: img.metadata,
          image_files: imageFile ? [imageFile] : [],
          dimensions: width && height ? { width, height } : undefined
        };
      });

      console.log('Transformed images:', transformedImages);
      setImages(transformedImages);
      
    } catch (error: any) {
      console.error('Error loading images:', error);
      setError(`Failed to load images: ${error.message || 'Unknown error'}`);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []); // Remove user dependency

  return {
    images,
    isLoading,
    error,
    loadImages
  };
};
