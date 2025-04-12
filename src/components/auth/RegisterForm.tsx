
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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

const RegisterForm: React.FC = () => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={registerData.username}
          onChange={handleChange}
          className={errors.username ? 'border-red-500' : ''}
        />
        {errors.username && (
          <p className="text-red-500 text-xs">{errors.username}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email address</Label>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={registerData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={registerData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={registerData.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeTerms"
          name="agreeTerms"
          checked={registerData.agreeTerms}
          onCheckedChange={(checked) => 
            handleChange({
              target: { 
                name: 'agreeTerms', 
                checked: !!checked,
                value: String(!!checked)
              }
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Label htmlFor="agreeTerms" className="text-sm">
          I agree to the{' '}
          <a href="/terms" className="text-puzzle-aqua hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-puzzle-aqua hover:underline">
            Privacy Policy
          </a>
        </Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-red-500 text-xs">{errors.agreeTerms}</p>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
