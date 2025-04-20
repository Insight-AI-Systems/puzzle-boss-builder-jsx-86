
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EmailHookProps {
  sendBulkEmail: any; // We'll keep the existing type from the parent
  selectedUsers: Set<string>;
}

export function useUserEmails({ sendBulkEmail, selectedUsers }: EmailHookProps) {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const handleBulkEmail = async () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to email",
        variant: 'destructive'
      });
      return;
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({
        title: "Missing email content",
        description: "Please provide both subject and body for the email",
        variant: 'destructive'
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      await sendBulkEmail.mutateAsync({
        userIds: Array.from(selectedUsers),
        subject: emailSubject,
        body: emailBody
      });

      toast({
        title: "Emails queued",
        description: `Emails to ${selectedUsers.size} users have been queued for delivery`,
        duration: 3000
      });

      setEmailDialogOpen(false);
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      toast({
        title: "Email sending failed",
        description: `Error: ${error instanceof Error ? error.message : 'An error occurred while sending emails.'}`,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    emailDialogOpen,
    setEmailDialogOpen,
    isSendingEmail,
    handleBulkEmail
  };
}
