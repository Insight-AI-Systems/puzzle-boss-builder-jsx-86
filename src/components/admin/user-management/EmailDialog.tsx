
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onSend: (subject: string, body: string) => void;
}

export function EmailDialog({
  open,
  onOpenChange,
  selectedCount,
  onSend,
}: EmailDialogProps) {
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const handleSend = () => {
    setIsSending(true);
    onSend(subject, body);
    setIsSending(false);
    onOpenChange(false);
    setSubject('');
    setBody('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Email Selected Users ({selectedCount})</DialogTitle>
          <DialogDescription>
            Compose an email to send to the selected users.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">Message</label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email content..."
              rows={8}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSend}
            disabled={!subject.trim() || !body.trim() || isSending}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
