
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw, UploadCloud, AlertCircle } from 'lucide-react';
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
  created_by: string | null;
}

export const ImageLibrary = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    
    try {
      // Process each file in the array
      for (const file of files) {
        console.log('Starting upload for file:', file.name);
        
        // Generate a unique file path with user id to improve security context
        const filePath = `original_images/${user.id}/${Date.now()}-${file.name}`;
        console.log('File path:', filePath);
        
        // Step 1: Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('original_images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }
        
        console.log('File uploaded successfully, getting URL');

        // Step 2: Get the public URL
        const { data: urlData } = supabase.storage
          .from('original_images')
          .getPublicUrl(filePath);
          
        console.log('Public URL obtained:', urlData.publicUrl);

        // Step 3: Create the product image record with explicit user ID
        console.log('Creating product image record with user ID:', user.id);
        const { data: productImageData, error: productImageError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            metadata: { size: file.size, type: file.type },
            status: 'pending',
            created_by: user.id // Explicitly set the created_by to the user's ID
          })
          .select()
          .single();

        if (productImageError) {
          console.error('Product image error:', productImageError);
          throw productImageError;
        }
        
        console.log('Product image record created:', productImageData.id);

        // Step 4: Create the image file record with explicit references
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
      
      // Reload images after successful upload
      loadImages();
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
      
      // Fetch images with proper authentication context
      const { data: productImages, error: productImagesError } = await supabase
        .from('product_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (productImagesError) {
        console.error('Error fetching product images:', productImagesError);
        throw productImagesError;
      }
      
      console.log('Product images fetched:', productImages?.length || 0);

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
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">
              Please log in to access the Image Library
            </p>
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
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ImageUpload onUpload={handleUpload} disabled={isUploading} />
          
          {error && (
            <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
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
              <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No images found</p>
              <p className="text-sm text-muted-foreground">
                Upload some images to get started or try a different search term
              </p>
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
                        <p className="text-sm text-muted-foreground">Processing...</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{image.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {image.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    </div>
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
