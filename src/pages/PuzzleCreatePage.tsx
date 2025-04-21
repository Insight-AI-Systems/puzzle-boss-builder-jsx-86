
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PuzzleEditForm } from '@/components/admin/PuzzleEditForm';

const PuzzleCreatePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin-dashboard?tab=puzzles');
  };
  
  const handleSave = () => {
    // After saving, return to puzzles tab
    navigate('/admin-dashboard?tab=puzzles');
  };
  
  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button 
          variant="outline"
          onClick={handleBack}
          className="mb-4 bg-transparent text-puzzle-aqua border-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-game text-puzzle-aqua mb-6">Create New Puzzle</h1>
        
        <PuzzleEditForm onSave={handleSave} />
      </div>
    </div>
  );
};

export default PuzzleCreatePage;
