
/**
 * Input Sanitization Utilities
 * Provides comprehensive input sanitization for security
 */

// HTML sanitization (install dompurify if not already installed)
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization without DOMPurify dependency
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onclick=/gi, '')
    .replace(/onmouseover=/gi, '');
};

// Plain text sanitization (removes all HTML)
export const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>/g, '').trim();
};

// Email sanitization
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// URL sanitization
export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Only allow safe protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    return url.trim();
  } catch {
    return '';
  }
};

// Phone number sanitization
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d\+\-\s\(\)]/g, '').trim();
};

// Filename sanitization
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9\.\-_]/g, '')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

// SQL injection prevention
export const sanitizeSql = (input: string): string => {
  return input
    .replace(/['";\\]/g, '')
    .replace(/(-{2}|\/\*|\*\/)/g, '')
    .replace(/(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi, '');
};

// XSS prevention
export const sanitizeXss = (input: string): string => {
  return input
    .replace(/[<>]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        default: return match;
      }
    })
    .replace(/['"]/g, (match) => {
      switch (match) {
        case '"': return '&quot;';
        case "'": return '&#x27;';
        default: return match;
      }
    })
    .replace(/&(?!amp;|lt;|gt;|quot;|&#x27;)/g, '&amp;');
};

// Path traversal prevention
export const sanitizePath = (path: string): string => {
  return path
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9\/\-_\.]/g, '')
    .replace(/\/{2,}/g, '/');
};

// Credit card number sanitization (for display)
export const sanitizeCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length >= 4) {
    return '**** **** **** ' + cleaned.slice(-4);
  }
  return '**** **** **** ****';
};

// General purpose sanitization
export const sanitizeInput = (input: string, type: 'text' | 'html' | 'email' | 'url' | 'phone' | 'filename' = 'text'): string => {
  if (typeof input !== 'string') {
    return '';
  }

  switch (type) {
    case 'html':
      return sanitizeHtml(input);
    case 'email':
      return sanitizeEmail(input);
    case 'url':
      return sanitizeUrl(input);
    case 'phone':
      return sanitizePhone(input);
    case 'filename':
      return sanitizeFilename(input);
    case 'text':
    default:
      return sanitizeText(input);
  }
};

// Batch sanitization for objects
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T,
  fieldTypes: Partial<Record<keyof T, 'text' | 'html' | 'email' | 'url' | 'phone' | 'filename'>> = {}
): T => {
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === 'string') {
      const type = fieldTypes[key] || 'text';
      sanitized[key] = sanitizeInput(value, type);
    }
  });
  
  return sanitized;
};

// Deep sanitization for nested objects
export const deepSanitize = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    Object.keys(obj).forEach(key => {
      sanitized[key] = deepSanitize(obj[key]);
    });
    return sanitized;
  }
  
  return obj;
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const containsHtml = (text: string): boolean => {
  return /<[^>]*>/g.test(text);
};

export const containsScript = (text: string): boolean => {
  return /<script|javascript:|vbscript:|onload|onerror/i.test(text);
};
