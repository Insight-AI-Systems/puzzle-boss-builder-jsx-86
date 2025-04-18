
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Loader2 } from 'lucide-react';
import { FormField } from './auth/FormField';
import { useRegistrationValidation } from '@/hooks/useRegistrationValidation';
import { useRegistrationSubmit } from '@/hooks/useRegistrationSubmit';
import { RegistrationFormData } from '@/types/registration';
import { Label } from './ui/label';

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const { errors, validateForm, clearError } = useRegistrationValidation();
  const { handleSubmit, isLoading } = useRegistrationSubmit();

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formData)) {
      await handleSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
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
