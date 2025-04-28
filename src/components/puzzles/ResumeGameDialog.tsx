
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResumeGameDialogProps {
  open: boolean;
  onResume: () => void;
  onNewGame: () => void;
}

export function ResumeGameDialog({ open, onResume, onNewGame }: ResumeGameDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resume Puzzle?</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to resume your previous puzzle progress or start a new game?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onNewGame}>New Game</AlertDialogCancel>
          <AlertDialogAction onClick={onResume}>Resume</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
