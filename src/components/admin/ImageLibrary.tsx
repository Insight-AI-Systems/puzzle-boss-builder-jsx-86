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
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useImageLibrary } from './image-library/hooks/useImageLibrary';
import { ImageGrid } from './image-library/components/ImageGrid';

const ImageLibrary: React.FC = () => {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { images, isLoading, error } = useImageLibrary();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nature', label: 'Nature' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'portraits', label: 'Portraits' }
  ];

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Image upload functionality will be implemented here.",
    });
  };

  const handleEdit = (imageId: string) => {
    toast({
      title: "Edit Image",
      description: `Editing image ${imageId}`,
    });
  };

  const handleDelete = (imageId: string) => {
    toast({
      title: "Delete Image",
      description: `Image ${imageId} would be deleted`,
      variant: "destructive"
    });
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
            <Button onClick={handleUpload} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
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
                <ImageGrid images={filteredImages} />
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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(image.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(image.id)}>
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
