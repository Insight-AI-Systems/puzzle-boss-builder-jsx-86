
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FormField } from './auth/FormField';
import { useRegistrationValidation } from '@/hooks/useRegistrationValidation';
import { RegistrationFormData } from '@/types/registration';
import { Label } from './ui/label';

const RegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, handleEmailAuth, setEmail, setPassword, setConfirmPassword, setUsername, setAcceptTerms } = useAuth();
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const { errors, validateForm, clearError } = useRegistrationValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    clearError(name);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeTerms: checked
    });
    clearError('agreeTerms');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      // Set auth form data
      setEmail(formData.email);
      setPassword(formData.password);
      setConfirmPassword(formData.confirmPassword);
      setUsername(formData.name);
      setAcceptTerms(formData.agreeTerms);
      
      try {
        // Use the auth system to sign up
        await handleEmailAuth(true);
        
        // Verify user creation in auth.users and profiles
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
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="name"
          name="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isLoading}
        />
        
        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />
        
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
        />
        
        <FormField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeTerms"
            checked={formData.agreeTerms}
            onCheckedChange={handleCheckboxChange}
            disabled={isLoading}
          />
          <Label htmlFor="agreeTerms" className="text-sm">
            I agree to the Terms & Conditions and Privacy Policy
          </Label>
        </div>
        {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
        
        <Button type="submit" className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
