
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSimpleRegisterForm } from '@/hooks/useSimpleRegisterForm';
import SimpleFormField from './SimpleFormField';
import TermsCheckbox from '@/components/form/TermsCheckbox';

const SimpleRegisterForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useSimpleRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SimpleFormField
        id="username"
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        autoComplete="username"
      />
      
      <SimpleFormField
        id="register-email"
        label="Email address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      
      <SimpleFormField
        id="register-password"
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="new-password"
      />
      
      <SimpleFormField
        id="confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />
      
      <TermsCheckbox
        checked={formData.agreeTerms}
        error={errors.agreeTerms}
        onCheckedChange={(checked) => 
          handleChange({
            target: { name: 'agreeTerms', checked, value: checked }
          })
        }
      />
      
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

export default SimpleRegisterForm;
