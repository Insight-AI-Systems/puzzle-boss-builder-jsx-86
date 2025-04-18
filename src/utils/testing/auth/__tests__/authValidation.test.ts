
/**
 * Auth Validation Tests
 * Tests for authentication validation functions
 */
import { 
  validatePassword, 
  validateEmail,
  getPasswordStrength 
} from '@/utils/authValidation';

describe('Authentication Validation Functions', () => {
  // Email validation tests
  describe('validateEmail', () => {
    test('should validate correct email format', () => {
      expect(validateEmail('test@example.com').valid).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk').valid).toBe(true);
    });
    
    test('should reject invalid email formats', () => {
      expect(validateEmail('not-an-email').valid).toBe(false);
      expect(validateEmail('missing@domain').valid).toBe(false);
      expect(validateEmail('@example.com').valid).toBe(false);
      expect(validateEmail('').valid).toBe(false);
      expect(validateEmail('test@example..com').valid).toBe(false);
    });
    
    test('should reject empty email', () => {
      expect(validateEmail('').valid).toBe(false);
      expect(validateEmail('').message).toContain('Email is required');
    });
  });

  // Password validation tests  
  describe('validatePassword', () => {
    test('should validate strong passwords', () => {
      expect(validatePassword('StrongP@ss1').valid).toBe(true);
      expect(validatePassword('Another$3cureP@ss').valid).toBe(true);
    });
    
    test('should reject passwords that are too short', () => {
      expect(validatePassword('Short1').valid).toBe(false);
      expect(validatePassword('Short1').message).toContain('at least 8 characters');
    });
    
    test('should reject passwords without uppercase letters', () => {
      expect(validatePassword('lowercase123!').valid).toBe(false);
      expect(validatePassword('lowercase123!').message).toContain('uppercase letter');
    });
    
    test('should reject passwords without lowercase letters', () => {
      expect(validatePassword('UPPERCASE123!').valid).toBe(false);
      expect(validatePassword('UPPERCASE123!').message).toContain('lowercase letter');
    });
    
    test('should reject passwords without numbers', () => {
      expect(validatePassword('NoNumbers!').valid).toBe(false);
      expect(validatePassword('NoNumbers!').message).toContain('number');
    });
    
    test('should reject passwords without special characters', () => {
      expect(validatePassword('NoSpecial123').valid).toBe(false);
      expect(validatePassword('NoSpecial123').message).toContain('special character');
    });
    
    test('should reject empty passwords', () => {
      expect(validatePassword('').valid).toBe(false);
      expect(validatePassword('').message).toContain('Password is required');
    });
  });
  
  // Password strength tests
  describe('getPasswordStrength', () => {
    test('should rate strong passwords highly', () => {
      expect(getPasswordStrength('StrongComplex@Password123').score).toBeGreaterThan(70);
    });
    
    test('should rate weak passwords with a low score', () => {
      expect(getPasswordStrength('password').score).toBeLessThan(30);
      expect(getPasswordStrength('12345678').score).toBeLessThan(30);
    });
    
    test('should give medium scores to moderately strong passwords', () => {
      const mediumScore = getPasswordStrength('Passw0rd');
      expect(mediumScore.score).toBeGreaterThan(30);
      expect(mediumScore.score).toBeLessThan(70);
    });
    
    test('should handle empty passwords', () => {
      expect(getPasswordStrength('').score).toBe(0);
    });
    
    test('should deduct points for common patterns', () => {
      expect(getPasswordStrength('password123').score)
        .toBeLessThan(getPasswordStrength('kJ3%nM7^pT').score);
    });
  });
});
