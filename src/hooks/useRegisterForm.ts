
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/components/ui/use-toast';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

export const useRegisterForm = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!registerData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        registerData.email, 
        registerData.password,
        registerData.username
      );
      
      if (!error) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
