
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useAuth } from '@/contexts/auth';
import FormField from './form/FormField';
import TermsCheckbox from './form/TermsCheckbox';
import { validateRegistrationForm } from '@/utils/formValidation';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      agreeTerms: checked
    });
    
    if (errors.agreeTerms) {
      setErrors({
        ...errors,
        agreeTerms: ''
      });
    }
  };

  const validateForm = () => {
    const validationErrors = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.name
      );
      
      if (!error) {
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        });
        
        toast({
          title: "Registration successful!",
          description: "Check your email to verify your account.",
          duration: 5000,
        });
        
        navigate('/auth');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="name"
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        
        <FormField
          id="email"
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        
        <FormField
          id="password"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        
        <TermsCheckbox
          checked={formData.agreeTerms}
          onCheckedChange={handleCheckboxChange}
          error={errors.agreeTerms}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
