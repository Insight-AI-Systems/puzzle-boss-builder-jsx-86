
interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
  valid?: boolean;
  message?: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password) {
    return {
      isValid: false,
      valid: false,
      error: 'Password is required',
      message: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      valid: false,
      error: 'Password must be at least 8 characters',
      message: 'Password must be at least 8 characters'
    };
  }

  return {
    isValid: true,
    valid: true
  };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): PasswordValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      valid: false,
      error: 'Passwords do not match',
      message: 'Passwords do not match'
    };
  }

  return {
    isValid: true,
    valid: true
  };
};
