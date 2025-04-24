interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
  valid?: boolean;
  message?: string;
}

interface PasswordStrengthResult {
  score: number;
  label: string;
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

export const validateEmail = (email: string): PasswordValidationResult => {
  if (!email) {
    return {
      isValid: false,
      valid: false,
      error: 'Email is required',
      message: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      valid: false,
      error: 'Invalid email format',
      message: 'Invalid email format'
    };
  }

  return {
    isValid: true,
    valid: true
  };
};

export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;
  
  if (!password) {
    return { score: 0, label: 'Too Weak' };
  }

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = 'Too Weak';
  if (score >= 6) label = 'Very Strong';
  else if (score >= 4) label = 'Strong';
  else if (score >= 3) label = 'Medium';
  else if (score >= 2) label = 'Weak';

  return { score: Math.min(score, 6), label };
};
