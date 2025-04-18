
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface LegalDocumentModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Please read this document carefully before accepting
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={onClose}>
            I Have Read and Acknowledge This Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LegalDocumentModal;
