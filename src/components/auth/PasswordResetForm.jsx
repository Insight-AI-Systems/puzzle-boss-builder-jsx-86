
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PasswordResetForm = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetData, setResetData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResetData({
      ...resetData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!resetData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(resetData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await resetPassword(resetData.email);
      
      if (!error) {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for further instructions."
        });
        onBackToLogin();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email address</Label>
        <Input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          value={resetData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-puzzle-aqua hover:underline"
          onClick={onBackToLogin}
        >
          Back to login
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
