
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface EmailExistsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onResetPassword: () => void;
}

export const EmailExistsDialog: React.FC<EmailExistsDialogProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onResetPassword,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>🔑 Welcome Back!</AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            It looks like you're already part of The Puzzle Boss community! This email is already registered—would you like to sign in or reset your password?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
          <Button
            variant="outline"
            onClick={onResetPassword}
            className="sm:mr-2 w-full sm:w-auto"
          >
            Reset Password
          </Button>
          <Button
            onClick={onSignIn}
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
