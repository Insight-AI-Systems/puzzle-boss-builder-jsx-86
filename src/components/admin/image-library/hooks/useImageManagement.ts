import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useImageManagement = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const deleteImage = async (imageId: string) => {
    setIsDeleting(true);
    try {
      console.log('🗑️ Deleting image:', imageId);

      // First, get the image details to find associated files
      const { data: imageData, error: fetchError } = await supabase
        .from('product_images')
        .select(`
          *,
          image_files (
            original_path,
            processed_path,
            thumbnail_path
          )
        `)
        .eq('id', imageId)
        .single();

      if (fetchError) {
        console.error('Error fetching image data:', fetchError);
        throw fetchError;
      }

      // Delete associated image_files records
      if (imageData.image_files && imageData.image_files.length > 0) {
        const { error: filesDeleteError } = await supabase
          .from('image_files')
          .delete()
          .eq('product_image_id', imageId);

        if (filesDeleteError) {
          console.error('Error deleting image files records:', filesDeleteError);
          throw filesDeleteError;
        }

        // Delete actual files from storage
        for (const file of imageData.image_files) {
          if (file.original_path) {
            await supabase.storage
              .from('processed_images')
              .remove([file.original_path]);
          }
          if (file.processed_path) {
            await supabase.storage
              .from('processed_images')
              .remove([file.processed_path]);
          }
          if (file.thumbnail_path) {
            await supabase.storage
              .from('processed_images')
              .remove([file.thumbnail_path]);
          }
        }
      }

      // Delete the product_images record
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) {
        console.error('Error deleting product image:', deleteError);
        throw deleteError;
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: `Failed to delete image: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const updateImageStatus = async (imageId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      console.log('🔄 Updating image status:', imageId, 'to', newStatus);
      console.log('Current user:', await supabase.auth.getUser());

      const { data, error } = await supabase
        .from('product_images')
        .update({ status: newStatus })
        .eq('id', imageId)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Error updating image status:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error('No rows updated - possible permission issue');
        throw new Error('No rows were updated. You may not have permission to update this image.');
      }

      toast({
        title: "Success",
        description: `Image ${newStatus === 'active' ? 'released for puzzles' : 'held from puzzles'}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating image status:', error);
      toast({
        title: "Error",
        description: `Failed to update image status: ${error.message}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    deleteImage,
    updateImageStatus,
    isDeleting,
    isUpdatingStatus
  };
};