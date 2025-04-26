
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const filePath = `original_images/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('original_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('original_images')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('product_images')
          .insert({
            name: file.name,
            metadata: { size: file.size, type: file.type },
            status: 'pending'
          });

        if (dbError) throw dbError;
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
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive"
      });
      return;
    }

    setImages(data || []);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Library</CardTitle>
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
        </div>
      </CardContent>
    </Card>
  );
};
