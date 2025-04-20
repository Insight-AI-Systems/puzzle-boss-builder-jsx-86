
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailBody: string;
  setEmailBody: (body: string) => void;
  onSendEmail: () => void;
  isSending: boolean;
}

export const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  onSendEmail,
  isSending,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email to {selectedCount} Users</DialogTitle>
          <DialogDescription>
            This will send an email to all selected users. Please compose your message carefully.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input 
              id="subject" 
              value={emailSubject} 
              onChange={e => setEmailSubject(e.target.value)} 
              placeholder="Enter email subject" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Email Body</Label>
            <Textarea 
              id="body" 
              value={emailBody} 
              onChange={e => setEmailBody(e.target.value)} 
              placeholder="Write your message here..." 
              rows={6} 
            />
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Sending bulk emails may be subject to anti-spam regulations. Ensure you have permission to contact these users.
          </AlertDescription>
        </Alert>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onSendEmail} 
            disabled={isSending || !emailSubject.trim() || !emailBody.trim()}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
