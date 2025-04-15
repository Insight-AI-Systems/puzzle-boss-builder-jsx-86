
import { useState } from 'react';
import { useSimpleAuth } from '@/contexts/simple-auth';
import { validateRegisterForm } from '@/utils/validation/registerValidation';
import { useToast } from '@/components/ui/use-toast';

export const useSimpleRegisterForm = () => {
  const { signUp } = useSimpleAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.username
      );
      if (!error) {
        toast({
          title: "Success!",
          description: "Your account has been created.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
