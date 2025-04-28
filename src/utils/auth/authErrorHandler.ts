
import { AuthError } from '@supabase/supabase-js';

export type ErrorCodeMessages = {
  [key: string]: string;
};

// Expanded error messages to provide clearer guidance
export const ERROR_MESSAGES: ErrorCodeMessages = {
  'invalid_credentials': 'The email or password you entered is incorrect',
  'email_taken': '🔑 Looks like you already have an account with this email. Want to sign in or reset your password?',
  'user_already_exists': '🔑 Looks like you already have an account with this email. Want to sign in or reset your password?',
  'user_not_found': 'No account found with this email',
  'too_many_attempts': 'Too many attempts. Please try again later',
  'request_not_processed': 'Your request could not be processed. This might be due to network issues or incorrect site configuration.',
  'auth_url_error': 'Authentication URL error. Please ensure you\'re using the correct URL for this site.',
  'invalid_request': 'Invalid authentication request. Please check the site URL configuration.',
  'unauthorized_client': 'Authentication error: Unauthorized client. The site might not be properly configured.',
  'invalid_grant': 'Authentication failed. Please check your credentials and try again.',
  'expired_token': 'Your session has expired. Please sign in again.',
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
    const errorMessage = error.message || '';
    
    console.log(`Auth error code: "${errorCode}", message: "${errorMessage}"`);
    
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

    // Check for email_taken (variant of already exists)
    if (errorCode === 'email_taken') {
      setErrorMessage(ERROR_MESSAGES.email_taken);
      return;
    }
    
    // Check for URL configuration errors
    if (errorMessage.includes('invalid') && 
       (errorMessage.includes('url') || errorMessage.includes('URL') || 
        errorMessage.includes('redirect'))) {
      setErrorMessage(ERROR_MESSAGES.auth_url_error);
      return;
    }
    
    // Check for unauthorized client errors
    if (errorCode.includes('unauthorized_client') || 
        errorMessage.includes('unauthorized client')) {
      setErrorMessage(ERROR_MESSAGES.unauthorized_client);
      return;
    }
    
    // Check for other errors
    const errorKey = Object.keys(ERROR_MESSAGES).find(key => errorCode.includes(key));
    setErrorMessage(errorKey ? ERROR_MESSAGES[errorKey] : ERROR_MESSAGES.default);
  } else {
    // Handle non-AuthError instances
    const errorMessage = error.message || '';
    
    // Check for email already exists in plain error message
    if (errorMessage.includes('email') && 
       (errorMessage.includes('taken') || errorMessage.includes('already exists') || 
        errorMessage.includes('already registered'))) {
      setErrorMessage(ERROR_MESSAGES.email_taken);
      return;
    }
    
    // Check for URL configuration issues in plain error
    if (errorMessage.includes('invalid') && 
       (errorMessage.includes('url') || errorMessage.includes('URL') || 
        errorMessage.includes('path') || errorMessage.includes('redirect'))) {
      setErrorMessage(ERROR_MESSAGES.auth_url_error);
      return;
    }
    
    setErrorMessage(ERROR_MESSAGES.default);
  }
};
