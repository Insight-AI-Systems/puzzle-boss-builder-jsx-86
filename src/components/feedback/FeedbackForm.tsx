
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

interface FeedbackFormData {
  type: 'bug' | 'suggestion' | 'question' | 'other';
  description: string;
  email?: string;
}

export function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
  const { toast } = useToast();
  const form = useForm<FeedbackFormData>({
    defaultValues: {
      type: 'suggestion',
      description: '',
      email: '',
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      const { error } = await supabase.from('feedback').insert({
        type: data.type,
        description: data.description,
        email: data.email || null,
        page_url: window.location.pathname,
        browser_info: navigator.userAgent,
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "We'll review it shortly.",
      });

      onSubmitSuccess();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your feedback..."
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Feedback</Button>
      </form>
    </Form>
  );
}
