
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import { RegistrationFormData } from '@/types/registration';

export const useRegistrationSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (formData: RegistrationFormData) => {
    setIsLoading(true);
    
    try {
      // Use the signUp method from the auth context
      await auth.signUp(formData.email, formData.password, {
        username: formData.name,
        acceptTerms: formData.agreeTerms,
      });
      
      // Verify user creation in auth.users
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser.user) {
        throw new Error('Failed to verify user creation');
      }

      // Verify profile creation
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to verify profile creation');
      }
      
      // Show success toast only after verification
      toast({
        title: "Registration successful!",
        description: "Please sign in to continue",
      });
      
      // Redirect to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading
  };
};
