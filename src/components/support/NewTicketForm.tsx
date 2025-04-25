import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTickets } from '@/hooks/useTickets';
import { openSupportsAPI } from '@/services/openSupportsAPI';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Department } from '@/types/ticketTypes';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters.' })
    .max(100, { message: 'Title must be less than 100 characters.' }),
  departmentId: z.string()
    .refine(val => !!val, { message: "Please select a department" }),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  content: z.string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  // Attachment is optional and will be handled separately
});

export default function NewTicketForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      departmentId: '',
      priority: 'medium',
      content: '',
    },
  });

  // Fetch departments
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
      // Check file size (5MB limit)
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to create a ticket.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // For file attachments, in a real implementation we would:
      // 1. Upload the file to storage
      // 2. Get back a URL or reference ID
      // 3. Pass that to the ticket creation API
      // 
      // For this demo, we'll just note that a file was attached
      
      const fileReference = attachment ? 'file-reference-placeholder' : undefined;
      
      await createTicket.mutateAsync({
        title: values.title,
        content: values.content,
        departmentId: parseInt(values.departmentId),
        priority: values.priority,
        userId: user.id,
        userEmail: user.email || '',
        file: fileReference,
        // Other fields would be set by the backend
        status: 'open',
      });
      
      toast({
        title: 'Ticket Created',
        description: 'Your support ticket has been submitted successfully.',
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of your issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      disabled={isLoadingDepartments || departments.length === 0}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your issue in detail"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel htmlFor="attachment">Attachment (optional)</FormLabel>
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB
              </p>
              {attachment && (
                <p className="text-xs">
                  Selected file: {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            
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
