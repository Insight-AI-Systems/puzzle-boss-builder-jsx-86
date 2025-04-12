
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Save } from 'lucide-react';

const ConfigOptions = ({ 
  gridSize, 
  setGridSize, 
  selectedImage, 
  setSelectedImage, 
  puzzleImages, 
  setUploadDialogOpen, 
  saveConfiguration, 
  saving 
}) => {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Configuration Options</CardTitle>
        <CardDescription>
          Customize the puzzle settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Grid Size Selector */}
        <div>
          <h3 className="text-sm font-medium mb-3">Grid Size</h3>
          <div className="flex flex-wrap gap-3">
            {[2, 3, 4, 5, 6].map(size => (
              <Button
                key={size}
                variant={gridSize === size ? "default" : "outline"}
                className={gridSize === size ? "bg-puzzle-aqua text-black" : ""}
                onClick={() => setGridSize(size)}
              >
                {size}x{size}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Image Selector */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Puzzle Image</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {puzzleImages.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedImage === image ? 'border-puzzle-gold scale-105' : 'border-transparent hover:border-puzzle-aqua'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Puzzle option ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
          onClick={saveConfiguration}
          disabled={saving}
        >
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigOptions;
