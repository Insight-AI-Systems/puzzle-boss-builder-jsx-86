
import { validateEmail, validatePassword } from '@/utils/authValidation';

export const validateAuthForm = (
  email: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean,
  isSignUp: boolean,
  setErrorMessage: (message: string) => void
): boolean => {
  // Always validate email for both signup and signin
  if (!email) {
    setErrorMessage('Email is required');
    return false;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    setErrorMessage(emailValidation.message);
    return false;
  }

  // Always validate password for both signup and signin
  if (!password) {
    setErrorMessage('Password is required');
    return false;
  }
  
  // Additional signup validations
  if (isSignUp) {
    // Validate password strength only on signup
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setErrorMessage(passwordValidation.message);
      return false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    // Terms acceptance
    if (!acceptTerms) {
      setErrorMessage('You must accept the Terms of Service to continue');
      return false;
    }
  }

  return true;
};
