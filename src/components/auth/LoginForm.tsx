
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/auth';

interface LoginFormProps {
  onForgotPassword: () => void;
}

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: name === 'rememberMe' ? checked : value
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
    
    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!loginData.password) {
      errors.password = 'Password is required';
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
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Login error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={loginData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            className="text-sm text-puzzle-aqua hover:underline"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={loginData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={loginData.rememberMe}
          onCheckedChange={(checked) => 
            handleChange({
              target: { 
                name: 'rememberMe', 
                checked: !!checked,
                value: String(!!checked)
              }
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Label htmlFor="rememberMe">Remember me</Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
