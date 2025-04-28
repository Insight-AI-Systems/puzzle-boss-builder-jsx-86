
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon } from "lucide-react";

interface PuzzleAssetManagerProps {
  currentImage: string;
  onSelectImage: (imageUrl: string) => void;
}

// Some sample images for quick selection
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1620677368158-1949bf7e6241?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1618588507085-c79565432917?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1620207418302-439b387441b0?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=500&h=500&fit=crop",
];

export const PuzzleAssetManager: React.FC<PuzzleAssetManagerProps> = ({
  currentImage,
  onSelectImage
}) => {
  const [imageUrl, setImageUrl] = useState(currentImage);
  const { toast } = useToast();

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSelectImage = () => {
    if (imageUrl.trim()) {
      onSelectImage(imageUrl);
      toast({
        title: 'Image Selected',
        description: 'The puzzle image has been updated',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the file
      const localUrl = URL.createObjectURL(file);
      onSelectImage(localUrl);
      toast({
        title: 'Image Uploaded',
        description: `"${file.name}" has been uploaded and selected`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Puzzle Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
            />
            <Button onClick={handleSelectImage}>
              Use
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="upload-image">Upload Image</Label>
          <div className="flex items-center">
            <label htmlFor="upload-image" className="cursor-pointer">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                <div className="space-y-2 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-500" />
                  <div className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </div>
                </div>
              </div>
              <Input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sample Images</Label>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_IMAGES.map((img, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  currentImage === img ? 'border-puzzle-aqua shadow-md scale-[1.02]' : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => onSelectImage(img)}
              >
                <img 
                  src={img} 
                  alt={`Sample ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
