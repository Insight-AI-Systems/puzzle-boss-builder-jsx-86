
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AccountDeletionDialogProps {
  userEmail: string;
  password: string;
  confirmText: string;
  isLoading: boolean;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  setPassword: (password: string) => void;
  setConfirmText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AccountDeletionDialog({
  userEmail,
  password,
  confirmText,
  isLoading,
  showDialog,
  setShowDialog,
  setPassword,
  setConfirmText,
  onSubmit
}: AccountDeletionDialogProps) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">Delete Account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Your account and all associated data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will permanently delete your account, profile information, and all data associated with your account.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="deletion-password">Enter your password</Label>
              <Input
                id="deletion-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-deletion">
                Type <span className="font-semibold">{userEmail}</span> to confirm
              </Label>
              <Input
                id="confirm-deletion"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              disabled={
                isLoading || 
                !password || 
                confirmText !== userEmail
              }
            >
              {isLoading ? 'Processing...' : 'Permanently Delete Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
