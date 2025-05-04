
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResumeGameDialogProps {
  open: boolean;
  onResume: () => void;
  onNewGame: () => void;
}

const ResumeGameDialog: React.FC<ResumeGameDialogProps> = ({
  open,
  onResume,
  onNewGame
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Your Puzzle</DialogTitle>
          <DialogDescription>
            Would you like to continue your previous puzzle progress or start a new game?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
          <Button variant="outline" onClick={onNewGame}>
            New Game
          </Button>
          <Button onClick={onResume}>
            Resume Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeGameDialog;
