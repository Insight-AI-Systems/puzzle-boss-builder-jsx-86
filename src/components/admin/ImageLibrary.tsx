import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Filter, Grid, List, Eye, Download, Edit, Trash2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useImageLibrary } from './image-library/hooks/useImageLibrary';
import { useImageUpload } from './image-library/hooks/useImageUpload';
import { useImageManagement } from './image-library/hooks/useImageManagement';
import { ImageGrid } from './image-library/components/ImageGrid';
import { useDropzone } from 'react-dropzone';

const ImageLibrary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { images, isLoading, error, loadImages } = useImageLibrary();
  const { handleUpload: uploadImages, isUploading } = useImageUpload(user, loadImages);
  const { deleteImage, updateImageStatus, isDeleting, isUpdatingStatus } = useImageManagement();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nature', label: 'Nature' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'portraits', label: 'Portraits' }
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    onDrop: uploadImages,
    disabled: isUploading
  });

  const handleImageDelete = async (imageId: string) => {
    const success = await deleteImage(imageId);
    if (success) {
      loadImages(); // Refresh the images list
    }
  };

  const handleImageStatusToggle = async (imageId: string, newStatus: string) => {
    const success = await updateImageStatus(imageId, newStatus);
    if (success) {
      loadImages(); // Refresh the images list
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (image.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all';
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Image Library</span>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button 
                disabled={isUploading} 
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search images by name or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Image Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading images...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Error loading images: {error}</p>
            </div>
          ) : (
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="grid">
                <ImageGrid 
                  images={filteredImages} 
                  onImageDelete={handleImageDelete}
                  onImageStatusToggle={handleImageStatusToggle}
                />
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-2">
                  {filteredImages.map(image => (
                    <Card key={image.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={image.imageUrl || '/placeholder.svg'}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{image.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(image.tags || []).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <div>{image.dimensions ? `${image.dimensions.width}x${image.dimensions.height}` : 'Unknown'}</div>
                          <div>{new Date(image.created_at).toLocaleDateString()}</div>
                        </div>
                        <Badge variant={image.status === 'active' ? 'default' : 'secondary'}>
                          {image.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleImageStatusToggle(image.id, image.status === 'active' ? 'held' : 'active')}
                            disabled={isUpdatingStatus}
                          >
                            {image.status === 'active' ? <Trash2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleImageDelete(image.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!isLoading && !error && filteredImages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No images found</p>
              <p className="text-sm">Try adjusting your search or upload new images</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageLibrary;
