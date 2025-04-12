
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import { ROLES } from '@/utils/permissions';
import { Upload, Save, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Demo puzzle images (would be replaced with database storage in full implementation)
const puzzleImages = [
  'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=300&h=300&q=80',
];

const AdminPuzzleConfig = () => {
  const [selectedImage, setSelectedImage] = useState(puzzleImages[0]);
  const [gridSize, setGridSize] = useState(4);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load saved configuration (in a real implementation, this would come from a database)
  useEffect(() => {
    // Simulate loading from localStorage as a simple storage solution
    const savedConfig = localStorage.getItem('puzzleConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setSelectedImage(config.image || puzzleImages[0]);
      setGridSize(config.gridSize || 4);
    }
  }, []);
  
  // Save puzzle configuration
  const saveConfiguration = () => {
    setSaving(true);
    
    // Save to localStorage (in a real implementation, this would save to a database)
    const config = {
      image: selectedImage,
      gridSize: gridSize,
    };
    
    localStorage.setItem('puzzleConfig', JSON.stringify(config));
    
    // Simulate API delay
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configuration Saved",
        description: "The puzzle settings have been updated successfully.",
        variant: "success",
      });
    }, 800);
  };
  
  // Handle image upload (in a real implementation, this would upload to a server)
  const handleImageUpload = () => {
    if (newImageUrl && newImageUrl.trim() !== '') {
      // Add new image URL to the list
      setSelectedImage(newImageUrl);
      setUploadDialogOpen(false);
      setNewImageUrl('');
      
      toast({
        title: "Image Added",
        description: "The new puzzle image has been added successfully.",
        variant: "success",
      });
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
    }
  };
  
  // Preview what a grid of the selected size would look like
  const renderGridPreview = () => {
    const cells = [];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        cells.push(
          <div 
            key={`${i}-${j}`} 
            className="border border-puzzle-aqua/30"
            style={{
              width: `${100/gridSize}%`,
              height: `${100/gridSize}%`,
              position: 'absolute',
              top: `${i * (100/gridSize)}%`,
              left: `${j * (100/gridSize)}%`,
            }}
          />
        );
      }
    }
    
    return cells;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Puzzle Configuration | The Puzzle Boss Admin</title>
      </Helmet>
      
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4" 
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>
        
        <h1 className="text-2xl font-bold text-puzzle-gold">Puzzle Configuration</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview Card */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Puzzle Preview</CardTitle>
            <CardDescription>
              This is how the puzzle will appear to users
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="max-w-xs mx-auto">
              <div className="relative aspect-square rounded-md overflow-hidden bg-puzzle-black/50 border-2 border-puzzle-aqua">
                <img 
                  src={selectedImage} 
                  alt="Puzzle" 
                  className="w-full h-full object-cover"
                />
                
                {/* Grid overlay */}
                {renderGridPreview()}
              </div>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {gridSize}x{gridSize} grid • {gridSize * gridSize} pieces
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Configuration Card */}
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
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Puzzle Image</DialogTitle>
            <DialogDescription>
              Enter the URL of an image to add it to the puzzle options.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="imageUrl"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Recommend using square images for best results.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleImageUpload}>
              <Check className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap component with role protection
const ProtectedAdminPuzzleConfig = () => (
  <RoleProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
    <AdminPuzzleConfig />
  </RoleProtectedRoute>
);

export default ProtectedAdminPuzzleConfig;
