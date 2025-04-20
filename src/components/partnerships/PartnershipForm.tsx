
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandshakeIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sanitizeText } from '@/utils/security/sanitization';
import { getCsrfToken } from '@/utils/security/csrf';
import { formSchema, type FormData } from './validation/partnershipSchema';
import PersonalInfoFields from './sections/PersonalInfoFields';
import PartnershipFields from './sections/PartnershipFields';
import FormStatus from './FormStatus';

const PartnershipForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
    setFormSuccess(null);

    try {
      const sanitizedData = {
        name: sanitizeText(values.name),
        email: sanitizeText(values.email),
        company: sanitizeText(values.company),
        position: sanitizeText(values.position),
        interest: values.interest,
        budget: values.budget,
        message: sanitizeText(values.message),
      };

      const requestHeaders = {
        'X-CSRF-Token': getCsrfToken(),
        'Content-Type': 'application/json'
      };

      console.log('Submitting partnership form with data:', sanitizedData);

      const { data, error } = await supabase.functions.invoke('handle-partnership', {
        body: sanitizedData,
        headers: requestHeaders,
      });

      if (error) {
        console.error('Error submitting partnership form:', error);
        throw new Error('Failed to submit form. Please try again later.');
      }

      if (data && data.error) {
        console.error('Server error:', data.error);
        throw new Error(data.error);
      }

      console.log('Partnership form submission successful:', data);
      
      setFormSuccess(data?.message || "Thank you for your interest. We'll be in touch soon!");
      
      toast({
        title: "Partnership inquiry submitted!",
        description: data?.message || "Thank you for your interest. We'll be in touch soon!",
      });

      form.reset();
    } catch (error: any) {
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
        <FormStatus error={formError} success={formSuccess} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <PartnershipFields form={form} />
            
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
