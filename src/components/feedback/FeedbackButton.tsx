
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from './FeedbackDialog';

export function FeedbackButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg"
        variant="default"
      >
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        Feedback
      </Button>
      <FeedbackDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
