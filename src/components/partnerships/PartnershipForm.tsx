
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HandshakeIcon, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { sanitizeText } from '@/utils/security/sanitization';
import { getCsrfToken } from '@/utils/security/csrf';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().min(1, { message: 'Company name is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  interest: z.string().min(1, { message: 'Please select a partnership interest' }),
  budget: z.string().min(1, { message: 'Please select a budget range' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type FormData = z.infer<typeof formSchema>;

const PartnershipForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      position: '',
      interest: '',
      budget: '',
      message: '',
    },
  });

  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Sanitize inputs to prevent XSS
      const sanitizedData = {
        name: sanitizeText(values.name),
        email: sanitizeText(values.email),
        company: sanitizeText(values.company),
        position: sanitizeText(values.position),
        interest: values.interest,
        budget: values.budget,
        message: sanitizeText(values.message),
      };

      // Add CSRF token and security headers
      const requestHeaders = {
        'X-CSRF-Token': getCsrfToken(),
      };

      const { data, error } = await supabase.functions.invoke('handle-partnership', {
        body: sanitizedData,
        headers: requestHeaders,
      });

      if (error) {
        console.error('Error submitting partnership form:', error);
        throw new Error('Failed to submit form. Please try again later.');
      }

      if (data.error) {
        console.error('Server error:', data.error);
        throw new Error(data.error);
      }

      toast({
        title: "Partnership inquiry submitted!",
        description: data.message || "Thank you for your interest. We'll be in touch soon!",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting partnership form:', error);
      
      setFormError(error.message || "There was a problem submitting your inquiry. Please try again later.");
      
      toast({
        title: "Error submitting form",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-puzzle-aqua/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HandshakeIcon className="h-5 w-5 mr-2 text-puzzle-aqua" />
          Partner with Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formError && (
          <div className="bg-destructive/10 p-3 rounded-md mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{formError}</p>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Marketing Director" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partnership Interest</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your partnership interest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prize">Prize Sponsorship</SelectItem>
                      <SelectItem value="branded">Branded Puzzles</SelectItem>
                      <SelectItem value="category">Category Sponsorship</SelectItem>
                      <SelectItem value="promotional">Promotional Events</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Budget Range</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k+">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partnership Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your partnership proposal or inquiry..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PartnershipForm;
