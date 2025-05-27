
import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';

export function useRegistrationSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleRegistration = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleRegistration,
    isLoading
  };
}
