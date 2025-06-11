import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { ProductImage } from '../types';

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useClerkAuth();

  const loadImages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data: productImages, error: productImagesError } = await supabase
        .from('product_images')
        .select('*')
        .eq('status', 'active') // Only show active/processed images
        .order('created_at', { ascending: false });

      if (productImagesError) {
        console.error('Error fetching product images:', productImagesError);
        return;
      }
      
      const transformedImages: ProductImage[] = (productImages || []).map(item => ({
        ...item,
        imageUrl: '', 
      }));
      
      setImages(transformedImages);
      
      // Fetch image URLs for each image
      for (const image of transformedImages) {
        const { data: fileData, error: fileError } = await supabase
          .from('image_files')
          .select('*')
          .eq('product_image_id', image.id)
          .maybeSingle();
          
        if (fileError || !fileData) continue;
        
        const path = fileData.processed_path || fileData.original_path;
        if (path) {
          const { data: urlData } = supabase.storage
            .from('original_images')
            .getPublicUrl(path);
            
          setImages(prevImages => 
            prevImages.map(img => 
              img.id === image.id ? { ...img, imageUrl: urlData.publicUrl } : img
            )
          );
        }
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, user]);

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image for Puzzle</DialogTitle>
        </DialogHeader>
        
        <div className="relative mt-4 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading images...</div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try a different search term' : 'Upload some images to get started'}
            </p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="border rounded-md overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-puzzle-aqua"
                onClick={() => onSelectImage(image.imageUrl)}
              >
                <div className="aspect-square bg-muted relative">
                  {image.imageUrl ? (
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">No preview</p>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate" title={image.name}>{image.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
