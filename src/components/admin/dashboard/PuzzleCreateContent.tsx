
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PuzzleEditForm } from '@/components/admin/PuzzleEditForm';

export const PuzzleCreateContent: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin-dashboard?tab=puzzles');
  };
  
  const handleSave = () => {
    // After saving, return to puzzles tab
    navigate('/admin-dashboard?tab=puzzles');
  };
  
  return (
    <div className="space-y-6">
      <Button 
        variant="outline"
        onClick={handleBack}
        className="mb-4 bg-transparent text-puzzle-aqua border-puzzle-aqua hover:bg-puzzle-aqua/10"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Puzzles
      </Button>
      
      <h2 className="text-2xl font-medium text-puzzle-aqua mb-6">Create New Puzzle</h2>
      
      <PuzzleEditForm onSave={handleSave} />
    </div>
  );
};
