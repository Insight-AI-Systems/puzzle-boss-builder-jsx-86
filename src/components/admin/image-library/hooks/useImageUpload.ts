
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

export const useImageUpload = (user: User | null, onUploadComplete: () => void) => {
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
      for (const file of files) {
        console.log('Starting upload for file:', file.name);
        
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        console.log('File path:', filePath);
        
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
        
        console.log('File uploaded successfully, getting URL');

        const { data: urlData } = supabase.storage
          .from('original_images')
          .getPublicUrl(filePath);
          
        console.log('Public URL obtained:', urlData.publicUrl);

        console.log('Creating product image record with user ID:', user.id);
        const { data: productImageData, error: productImageError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            metadata: { size: file.size, type: file.type },
            status: 'pending',
            created_by: user.id
          })
          .select()
          .single();

        if (productImageError) {
          console.error('Product image error:', productImageError);
          throw productImageError;
        }
        
        console.log('Product image record created:', productImageData.id);

        console.log('Creating image file record');
        const { error: fileRecordError } = await supabase
          .from('image_files')
          .insert({
            product_image_id: productImageData.id,
            original_path: filePath,
            original_width: null, 
            original_height: null,
            original_size: file.size,
            processing_status: 'pending'
          });

        if (fileRecordError) {
          console.error('Image file record error:', fileRecordError);
          throw fileRecordError;
        }
        
        console.log('Image file record created successfully');
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
