
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface DetailDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DetailDialog: React.FC<DetailDialogProps> = ({
  children,
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {children}
      </DialogContent>
    </Dialog>
  );
};
