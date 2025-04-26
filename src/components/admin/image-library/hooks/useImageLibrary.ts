
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { ProductImage } from '../types';
import { toast } from '@/components/ui/use-toast';

export const useImageLibrary = (user: User | null) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadImages = async () => {
    if (!user) {
      setImages([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading images for user:', user.id);
      
      const { data: productImages, error: productImagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (productImagesError) {
        console.error('Error fetching product images:', productImagesError);
        throw productImagesError;
      }
      
      console.log('Product images fetched:', productImages?.length || 0);

      const transformedData: ProductImage[] = (productImages || []).map(item => ({
        ...item,
        imageUrl: '', 
      }));
      
      setImages(transformedData);
      
      // Fetch image URLs for each image
      for (const image of transformedData) {
        const { data: fileData, error: fileError } = await supabase
          .from('image_files')
          .select('*')
          .eq('product_image_id', image.id)
          .maybeSingle();
          
        if (fileError) {
          console.error('Error fetching image file for ID:', image.id, fileError);
          continue;
        }
        
        if (fileData) {
          // Get the appropriate path
          const path = fileData.processed_path || fileData.original_path;
          if (path) {
            const bucketName = 'original_images'; // Default to original images
            
            console.log(`Getting public URL for image ${image.id} from path: ${path}`);
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(path);
            
            console.log('Public URL:', urlData.publicUrl);  
            setImages(prevImages => 
              prevImages.map(img => 
                img.id === image.id ? { ...img, imageUrl: urlData.publicUrl } : img
              )
            );
          }
        }
      }
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
  }, [user]);

  return {
    images,
    isLoading,
    error,
    loadImages
  };
};
