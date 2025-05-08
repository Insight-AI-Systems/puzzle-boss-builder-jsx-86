
/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body: Record<string, any>, requiredFields: string[]): { 
  isValid: boolean; 
  missingFields: string[]
} {
  const missingFields = requiredFields.filter(field => !body[field]);
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Validate UUID format
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Validate email format
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Sanitize a string to prevent XSS
 */
export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, (match) => {
    return match === '<' ? '&lt;' : '&gt;';
  });
}
