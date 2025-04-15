
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSimpleAuth } from '@/contexts/simple-auth';
import FormField from '@/components/form/FormField';
import TermsCheckbox from '@/components/form/TermsCheckbox';

const SimpleRegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useSimpleAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
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
    
    if (!registerData.username) {
      errors.username = 'Username is required';
    }
    
    if (!registerData.email) {
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
      const { error } = await signUp(
        registerData.email,
        registerData.password,
        registerData.username
      );
      if (!error) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="username"
        label="Username"
        name="username"
        type="text"
        value={registerData.username}
        onChange={handleChange}
        error={errors.username}
      />
      
      <FormField
        id="email"
        label="Email"
        name="email"
        type="email"
        value={registerData.email}
        onChange={handleChange}
        error={errors.email}
      />
      
      <FormField
        id="password"
        label="Password"
        name="password"
        type="password"
        value={registerData.password}
        onChange={handleChange}
        error={errors.password}
      />
      
      <FormField
        id="confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={registerData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-cyan-400 text-black hover:bg-cyan-400/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default SimpleRegisterForm;
