
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePartnerManagement } from '@/hooks/admin/usePartnerManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, Users, CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

interface CommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerId: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  partnerEmail?: string;
  partnerName?: string;
}

const CommunicationDialog: React.FC<CommunicationDialogProps> = ({ 
  open, 
  onOpenChange,
  partnerId,
  type,
  partnerEmail,
  partnerName
}) => {
  const { user } = useAuth();
  const { createCommunication } = usePartnerManagement(partnerId);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      content: '',
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const communicationData = {
      partner_id: partnerId,
      type: type,
      subject: data.subject,
      content: data.content,
      sent_by: user?.id,
    };
    
    createCommunication(communicationData);
    onOpenChange(false);
    form.reset();
  };

  const getTitle = () => {
    switch (type) {
      case 'email':
        return 'Send Email';
      case 'call':
        return 'Log Call';
      case 'meeting':
        return 'Schedule Meeting';
      case 'note':
        return 'Add Note';
      default:
        return 'New Communication';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'meeting':
        return <Users className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'email':
        return `Compose an email to ${partnerName || 'the partner'}.`;
      case 'call':
        return `Log a phone call with ${partnerName || 'the partner'}.`;
      case 'meeting':
        return `Schedule a meeting with ${partnerName || 'the partner'}.`;
      case 'note':
        return `Add a note about ${partnerName || 'the partner'}.`;
      default:
        return 'Create a new communication record.';
    }
  };

  const getSubjectLabel = () => {
    switch (type) {
      case 'email':
        return 'Email Subject';
      case 'call':
        return 'Call Subject';
      case 'meeting':
        return 'Meeting Subject';
      case 'note':
        return 'Note Title';
      default:
        return 'Subject';
    }
  };

  const getContentLabel = () => {
    switch (type) {
      case 'email':
        return 'Email Content';
      case 'call':
        return 'Call Notes';
      case 'meeting':
        return 'Meeting Details';
      case 'note':
        return 'Note Content';
      default:
        return 'Content';
    }
  };

  const getSubmitButtonText = () => {
    switch (type) {
      case 'email':
        return 'Send Email';
      case 'call':
        return 'Log Call';
      case 'meeting':
        return 'Schedule Meeting';
      case 'note':
        return 'Save Note';
      default:
        return 'Save';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {type === 'email' && partnerEmail && (
              <div className="flex items-center space-x-2">
                <FormLabel className="w-16">To:</FormLabel>
                <div className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-gray-700">{partnerEmail}</div>
              </div>
            )}

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getSubjectLabel()}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getContentLabel()}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={type === 'email' ? 'Enter email body' : 'Enter details'}
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {getSubmitButtonText()}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationDialog;
