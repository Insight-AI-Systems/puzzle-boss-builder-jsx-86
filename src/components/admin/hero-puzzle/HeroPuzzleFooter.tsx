
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { HeroPuzzleConfig } from '@/hooks/useHeroPuzzle';

interface HeroPuzzleFooterProps {
  formData: Partial<HeroPuzzleConfig>;
  isSubmitting: boolean;
  onDelete: () => void;
}

export const HeroPuzzleFooter: React.FC<HeroPuzzleFooterProps> = ({
  formData,
  isSubmitting,
  onDelete,
}) => {
  return (
    <div className="justify-between border-t border-puzzle-aqua/20 pt-4">
      <Button 
        type="button" 
        variant="destructive"
        disabled={isSubmitting || !formData.id}
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  );
};
