
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import { ROLES } from '@/utils/permissions';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import PuzzlePreview from '@/components/admin/puzzle-config/PuzzlePreview';
import ConfigOptions from '@/components/admin/puzzle-config/ConfigOptions';
import ImageUploadDialog from '@/components/admin/puzzle-config/ImageUploadDialog';
import { puzzleImages } from '@/components/admin/puzzle-config/constants';

const AdminPuzzleConfig = () => {
  const [selectedImage, setSelectedImage] = useState(puzzleImages[0]);
  const [gridSize, setGridSize] = useState(4);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
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
        {/* Preview Card - Refactored into its own component */}
        <PuzzlePreview 
          selectedImage={selectedImage} 
          gridSize={gridSize} 
        />
        
        {/* Configuration Card - Refactored into its own component */}
        <ConfigOptions 
          gridSize={gridSize}
          setGridSize={setGridSize}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          puzzleImages={puzzleImages}
          setUploadDialogOpen={setUploadDialogOpen}
          saveConfiguration={saveConfiguration}
          saving={saving}
        />
      </div>
      
      {/* Upload Dialog - Refactored into its own component */}
      <ImageUploadDialog 
        uploadDialogOpen={uploadDialogOpen}
        setUploadDialogOpen={setUploadDialogOpen}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        handleImageUpload={handleImageUpload}
      />
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
