
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTickets } from '@/hooks/useTickets';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Department } from '@/types/ticketTypes';
import { useAuth } from '@/contexts/AuthContext';
import TicketFormFields from './form/TicketFormFields';
import FileAttachment from './form/FileAttachment';
import { ticketFormSchema, type TicketFormValues } from './validation/ticketFormSchema';

export default function NewTicketForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: '',
      departmentId: '',
      priority: 'medium',
      content: '',
    },
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const departments = await openSupportsAPI.getDepartments();
        setDepartments(departments);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load departments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setAttachment(file);
    }
  };

  const onSubmit = async (values: TicketFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to create a ticket.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const fileReference = attachment ? 'file-reference-placeholder' : undefined;
      
      await createTicket.mutateAsync({
        ...values,
        departmentId: parseInt(values.departmentId),
        userId: user.id,
        userEmail: user.email || '',
        file: fileReference,
        status: 'open',
      });
      
      navigate('/support/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a New Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TicketFormFields
              form={form}
              departments={departments}
              isLoadingDepartments={isLoadingDepartments}
            />
            
            <FileAttachment
              onFileChange={handleFileChange}
              attachment={attachment}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/support/tickets')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTicket.isPending}
              >
                {createTicket.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Ticket
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
