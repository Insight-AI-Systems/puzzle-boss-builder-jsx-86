
interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters'
    };
  }

  return {
    isValid: true
  };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): PasswordValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }

  return {
    isValid: true
  };
};
