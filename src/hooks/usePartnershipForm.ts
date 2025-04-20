
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

      const { data, error } = await supabase.functions.invoke('handle-partnership', {
        body: sanitizedData,
        headers: requestHeaders,
      });

      if (error) {
        console.error('Error submitting partnership form:', error);
        setFormError("🤗 We're experiencing a temporary issue with sending your message. Our team has been notified and will work to resolve this soon. Thank you for your patience.");
        return false;
      }

      if (data && data.error) {
        console.error('Server error:', data.error);
        setFormError("🤗 We're experiencing a temporary issue with sending your message. Our team has been notified and will work to resolve this soon. Thank you for your patience.");
        return false;
      }

      setFormSuccess(data?.message || "Thank you for your interest. We'll be in touch soon!");
      
      toast({
        title: "Partnership inquiry submitted!",
        description: data?.message || "Thank you for your interest. We'll be in touch soon!",
      });

      return true;
    } catch (error: any) {
      console.error('Error submitting partnership form:', error);
      
      setFormError("🤗 We're experiencing a temporary issue with sending your message. Our team has been notified and will work to resolve this soon. Thank you for your patience.");
      
      toast({
        title: "Error submitting form",
        description: "🤗 We're experiencing a temporary issue with sending your message. Our team has been notified and will work to resolve this soon. Thank you for your patience.",
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
