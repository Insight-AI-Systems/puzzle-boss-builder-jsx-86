
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useImageLibrary } from './image-library/hooks/useImageLibrary';
import { useImageUpload } from './image-library/hooks/useImageUpload';
import { ImageGrid } from './image-library/components/ImageGrid';
import { EmptyState } from './image-library/components/EmptyState';
import { LoadingState } from './image-library/components/LoadingState';

export const ImageLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { images, isLoading, error, loadImages } = useImageLibrary(user);
  const { handleUpload, isUploading, error: uploadError } = useImageUpload(user, loadImages);

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button variant="outline" size="sm" onClick={loadImages}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ImageUpload onUpload={handleUpload} disabled={isUploading} />
          
          {(error || uploadError) && (
            <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error || uploadError}</p>
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
            <LoadingState />
          ) : filteredImages.length === 0 ? (
            <EmptyState />
          ) : (
            <ImageGrid images={filteredImages} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
