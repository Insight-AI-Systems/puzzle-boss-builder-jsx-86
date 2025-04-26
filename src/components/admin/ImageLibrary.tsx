
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProductImage {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  imageUrl: string;
  status: string;
  created_at: string;
}

export const ImageLibrary = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
    try {
      for (const file of files) {
        // Generate a unique file path
        const filePath = `original_images/${Date.now()}-${file.name}`;
        
        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('original_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('original_images')
          .getPublicUrl(filePath);

        // Insert record into product_images table
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

        if (productImageError) throw productImageError;

        // Insert record into image_files table
        const { error: fileRecordError } = await supabase
          .from('image_files')
          .insert({
            product_image_id: productImageData.id,
            original_path: filePath,
            original_width: null, // These would ideally be determined client-side
            original_height: null,
            original_size: file.size,
            processing_status: 'pending'
          });

        if (fileRecordError) throw fileRecordError;
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} images uploaded successfully`
      });
      
      loadImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const { data: productImages, error: productImagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (productImagesError) throw productImagesError;

      // Transform data to match ProductImage interface (initially without imageUrl)
      const transformedData: ProductImage[] = (productImages || []).map(item => ({
        ...item,
        imageUrl: '', // We'll fetch and update these URLs separately
      }));
      
      setImages(transformedData);
      
      // Fetch image URLs for each product image
      for (const image of transformedData) {
        // Get the image file record
        const { data: fileData, error: fileError } = await supabase
          .from('image_files')
          .select('*')
          .eq('product_image_id', image.id)
          .maybeSingle();
          
        if (fileError) {
          console.error('Error fetching image file:', fileError);
          continue;
        }
        
        if (fileData) {
          const path = fileData.processed_path || fileData.original_path;
          if (path) {
            const bucketName = path.includes('processed') ? 'processed_images' : 'original_images';
            
            const { data: urlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(path);
              
            // Update the image URL in our state
            setImages(prevImages => 
              prevImages.map(img => 
                img.id === image.id ? { ...img, imageUrl: urlData.publicUrl } : img
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Error loading images:', error);
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
    if (user) {
      loadImages();
    }
  }, [user]);

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    loadImages();
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Image Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            Please log in to access the Image Library
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Image Library</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ImageUpload onUpload={handleUpload} disabled={isUploading} />
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-puzzle-aqua" />
                <p className="text-sm text-muted-foreground">Loading images...</p>
              </div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">No images found. Upload some images to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        Processing...
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{image.name}</h3>
                    <p className="text-sm text-muted-foreground">{image.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
