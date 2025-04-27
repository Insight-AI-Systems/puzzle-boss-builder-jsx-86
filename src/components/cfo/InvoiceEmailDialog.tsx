
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceEmailDialogProps {
  selectedPayments: string[];
  onSuccess: () => void;
}

export const InvoiceEmailDialog = ({ selectedPayments, onSuccess }: InvoiceEmailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmails = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: { paymentIds: selectedPayments }
      });

      if (error) throw error;

      toast({
        title: "Invoices Sent",
        description: "The invoices have been sent successfully.",
      });
      
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error sending invoices:', error);
      toast({
        title: "Error",
        description: "Failed to send invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={selectedPayments.length === 0}
        >
          <Mail className="h-4 w-4" />
          Send Invoices
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Commission Invoices</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p>
            You are about to send {selectedPayments.length} invoice{selectedPayments.length !== 1 ? 's' : ''} to the respective category managers.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmails} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Invoices'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
