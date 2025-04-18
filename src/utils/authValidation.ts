
// Password strength thresholds
const STRENGTH_THRESHOLD = {
  VERY_WEAK: 0,
  WEAK: 25,
  MEDIUM: 50,
  STRONG: 75,
  VERY_STRONG: 90
};

// Password strength labels
const STRENGTH_LABELS = {
  [STRENGTH_THRESHOLD.VERY_WEAK]: 'Very Weak',
  [STRENGTH_THRESHOLD.WEAK]: 'Weak',
  [STRENGTH_THRESHOLD.MEDIUM]: 'Medium',
  [STRENGTH_THRESHOLD.STRONG]: 'Strong',
  [STRENGTH_THRESHOLD.VERY_STRONG]: 'Very Strong'
};

interface PasswordValidationResult {
  valid: boolean;
  message: string;
}

interface PasswordStrength {
  score: number;
  label: string;
}

/**
 * Calculates password strength based on various criteria
 * Returns a score (0-100) and label
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: STRENGTH_LABELS[STRENGTH_THRESHOLD.VERY_WEAK] };
  }
  
  let score = 0;
  
  // Basic length check
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/[0-9]/.test(password)) score += 10; // digits
  if (/[^a-zA-Z0-9]/.test(password)) score += 15; // special chars
  
  // Pattern checks (deduct points)
  if (/(.)\1{2,}/.test(password)) score -= 10; // repeating characters
  if (/^[a-zA-Z]+$/.test(password)) score -= 10; // letters only
  if (/^[0-9]+$/.test(password)) score -= 10; // numbers only
  
  // Common patterns (deduct points)
  const commonPatterns = [
    'password', '123456', 'qwerty', 'admin', 'welcome',
    'letmein', 'monkey', 'abc123', 'football', 'iloveyou'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score -= 20;
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Determine label based on score
  let label = '';
  if (score < STRENGTH_THRESHOLD.WEAK) {
    label = STRENGTH_LABELS[STRENGTH_THRESHOLD.VERY_WEAK];
  } else if (score < STRENGTH_THRESHOLD.MEDIUM) {
    label = STRENGTH_LABELS[STRENGTH_THRESHOLD.WEAK];
  } else if (score < STRENGTH_THRESHOLD.STRONG) {
    label = STRENGTH_LABELS[STRENGTH_THRESHOLD.MEDIUM];
  } else if (score < STRENGTH_THRESHOLD.VERY_STRONG) {
    label = STRENGTH_LABELS[STRENGTH_THRESHOLD.STRONG];
  } else {
    label = STRENGTH_LABELS[STRENGTH_THRESHOLD.VERY_STRONG];
  }
  
  return { score, label };
}

/**
 * Validates password against security criteria
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      valid: false,
      message: 'Password is required'
    };
  }
  
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  return {
    valid: true,
    message: 'Password is valid'
  };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): PasswordValidationResult {
  if (!email) {
    return {
      valid: false,
      message: 'Email is required'
    };
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address'
    };
  }
  
  return {
    valid: true,
    message: 'Email is valid'
  };
}
