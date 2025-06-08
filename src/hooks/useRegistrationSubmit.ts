
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  country: string;
  dateOfBirth: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

export function useRegistrationSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const submitRegistration = async (data: RegistrationData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await signUp(data.email, data.password, {
        username: data.username,
        acceptTerms: data.acceptTerms
      });
      
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account.',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
      
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitRegistration,
    isSubmitting
  };
}
