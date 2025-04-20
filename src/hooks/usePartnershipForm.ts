
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from '@/components/partnerships/validation/partnershipSchema';
import { sanitizeText } from '@/utils/security/sanitization';
import { getCsrfToken } from '@/utils/security/csrf';

export const usePartnershipForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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

      return true;
    } catch (error: any) {
      console.error('Error submitting partnership form:', error);
      
      setFormError(error.message || "There was a problem submitting your inquiry. Please try again later.");
      
      toast({
        title: "Error submitting form",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    formError,
    formSuccess,
  };
};
