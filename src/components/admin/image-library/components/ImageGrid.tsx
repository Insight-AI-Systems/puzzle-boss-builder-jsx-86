
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductImage } from '../types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageActions } from './ImageActions';
import { Trash2, Eye, Pause, Play } from 'lucide-react';

interface ImageGridProps {
  images: ProductImage[];
  onImageDelete: (imageId: string) => void;
  onImageStatusToggle: (imageId: string, newStatus: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageDelete, onImageStatusToggle }) => {
  console.log('🖼️ ImageGrid rendering with', images.length, 'images');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => {
        console.log('🎴 Rendering image card:', image.name);
        return (
        <Card key={image.id} className="overflow-hidden">
          <div className="relative h-48 bg-muted">
            {image.imageUrl ? (
              <img
                src={image.imageUrl}
                alt={image.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Processing...</p>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium truncate flex-1" title={image.name}>{image.name}</h3>
              <div className="flex-shrink-0 ml-2">
                <ImageActions 
                  image={image}
                  onDelete={onImageDelete}
                  onStatusToggle={onImageStatusToggle}
                />
              </div>
            </div>
            
            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(image.imageUrl, '_blank')}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onImageStatusToggle(image.id, image.status === 'active' ? 'held' : 'active')}
                className="flex-1"
              >
                {image.status === 'active' ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Hold
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Release
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onImageDelete(image.id)}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                image.status === 'active' ? 'bg-green-100 text-green-800' : 
                image.status === 'held' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {image.status}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(image.created_at).toLocaleDateString()}
              </span>
            </div>
            {image.dimensions && (
              <div className="text-xs text-muted-foreground mt-1">
                {image.dimensions.width} × {image.dimensions.height}
              </div>
            )}
          </CardContent>
        </Card>
        );
      })}
    </div>
  );
};
