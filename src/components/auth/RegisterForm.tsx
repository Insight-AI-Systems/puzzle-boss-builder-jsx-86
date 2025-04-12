
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import FormInput from './FormInput';
import TermsCheckbox from './TermsCheckbox';

const RegisterForm: React.FC = () => {
  const {
    registerData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="username"
        name="username"
        label="Username"
        value={registerData.username}
        autoComplete="username"
        error={errors.username}
        onChange={handleChange}
      />
      
      <FormInput
        id="register-email"
        name="email"
        type="email"
        label="Email address"
        value={registerData.email}
        autoComplete="email"
        error={errors.email}
        onChange={handleChange}
      />
      
      <FormInput
        id="register-password"
        name="password"
        type="password"
        label="Password"
        value={registerData.password}
        autoComplete="new-password"
        error={errors.password}
        onChange={handleChange}
      />
      
      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={registerData.confirmPassword}
        autoComplete="new-password"
        error={errors.confirmPassword}
        onChange={handleChange}
      />
      
      <TermsCheckbox
        checked={registerData.agreeTerms}
        error={errors.agreeTerms}
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
