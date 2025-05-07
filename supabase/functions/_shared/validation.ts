
// Input validation utilities

// Validate required fields
export function validateRequiredFields<T>(
  data: T,
  requiredFields: Array<keyof T>
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields: missingFields as string[]
  };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate UUID format
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Generic validator that takes a value and a validator function
export function validate<T>(value: T, validator: (value: T) => boolean, errorMessage: string): { isValid: boolean; error?: string } {
  const isValid = validator(value);
  return {
    isValid,
    error: isValid ? undefined : errorMessage
  };
}
