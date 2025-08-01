
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProductImage } from '../types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImageActions } from './ImageActions';

interface ImageGridProps {
  images: ProductImage[];
  onImageDelete: (imageId: string) => void;
  onImageStatusToggle: (imageId: string, newStatus: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageDelete, onImageStatusToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
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
              <ImageActions 
                image={image}
                onDelete={onImageDelete}
                onStatusToggle={onImageStatusToggle}
              />
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
      ))}
    </div>
  );
};
