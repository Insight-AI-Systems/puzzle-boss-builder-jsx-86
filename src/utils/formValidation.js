
/**
 * Form validation utilities
 */

/**
 * Validates a registration form
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing validation errors
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (!formData.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms and conditions';
  }
  
  return errors;
};
