
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (subject: string, message: string) => Promise<boolean>;
  selectedCount: number;
}

export function EmailDialog({
  open,
  onOpenChange,
  onSendEmail,
  selectedCount
}: EmailDialogProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    
    setIsSending(true);
    try {
      const success = await onSendEmail(subject, message);
      if (success) {
        // Reset form and close dialog on success
        setSubject('');
        setMessage('');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to {selectedCount} {selectedCount === 1 ? 'User' : 'Users'}
          </DialogTitle>
          <DialogDescription>
            Compose an email to send to the selected users.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-message">Message</Label>
            <Textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here"
              className="min-h-[150px] w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!subject.trim() || !message.trim() || isSending}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
