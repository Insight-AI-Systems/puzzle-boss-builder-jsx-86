import { AuthError } from '@supabase/supabase-js';

export type ErrorCodeMessages = {
  [key: string]: string;
};

// Standardized error messages to avoid revealing sensitive info
export const ERROR_MESSAGES: ErrorCodeMessages = {
  'invalid_credentials': 'The email or password you entered is incorrect',
  'email_taken': '🔑 Looks like you already have an account with this email. Want to sign in or reset your password?',
  'user_already_exists': '🔑 Looks like you already have an account with this email. Want to sign in or reset your password?',
  'user_not_found': 'No account found with this email',
  'too_many_attempts': 'Too many attempts. Please try again later',
  'default': 'An error occurred during authentication'
};

export const handleAuthError = (error: AuthError | Error, setErrorMessage: (message: string) => void) => {
  console.error('Authentication error:', error);
  
  // TypeGuard for AuthError
  const isAuthError = (err: any): err is AuthError => {
    return err && typeof err === 'object' && 'code' in err;
  };

  if (isAuthError(error)) {
    const errorCode = error.code || '';
    
    // Rate limiting check
    if (errorCode === 'too_many_requests') {
      setErrorMessage(ERROR_MESSAGES.too_many_attempts);
      return;
    }
    
    // Direct check for user_already_exists
    if (errorCode === 'user_already_exists') {
      setErrorMessage(ERROR_MESSAGES.user_already_exists);
      return;
    }
    
    // Check for other errors
    const errorKey = Object.keys(ERROR_MESSAGES).find(key => errorCode.includes(key));
    setErrorMessage(errorKey ? ERROR_MESSAGES[errorKey] : ERROR_MESSAGES.default);
  } else {
    setErrorMessage(ERROR_MESSAGES.default);
  }
};
