import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Image as ImageIcon, Check } from 'lucide-react';
import { useImageLibrary } from '../image-library/hooks/useImageLibrary';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface ImageLibrarySelectorProps {
  onImageSelect: (image: any) => void;
  selectedImageId?: string;
  children: React.ReactNode;
}

export const ImageLibrarySelector: React.FC<ImageLibrarySelectorProps> = ({
  onImageSelect,
  selectedImageId,
  children
}) => {
  const { user } = useClerkAuth();
  const { images, isLoading } = useImageLibrary(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageSelect = (image: any) => {
    onImageSelect(image);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Image from Library</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="text-center py-8">Loading images...</div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images found</p>
                <p className="text-sm">Upload images in the Upload tab first</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`cursor-pointer hover:shadow-lg transition-shadow relative ${
                      selectedImageId === image.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-video bg-muted rounded overflow-hidden mb-2">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate">{image.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {image.status}
                        </Badge>
                      </div>
                      {selectedImageId === image.id && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};