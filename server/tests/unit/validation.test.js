// Unit Tests for Validation Utilities

const {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateObjectId,
  validatePagination
} = require('../../src/utils/validation');

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Test123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject passwords that are too short', () => {
      const result = validatePassword('Test1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters long');
    });

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('test123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('TEST123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePassword('TestPass');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should return multiple errors for weak passwords', () => {
      const result = validatePassword('test');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML special characters', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>'))
        .toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('should sanitize quotes and apostrophes', () => {
      expect(sanitizeInput('"test" and \'test\''))
        .toBe('&quot;test&quot; and &#x27;test&#x27;');
    });

    it('should handle normal text without changes', () => {
      expect(sanitizeInput('normal text')).toBe('normal text');
    });

    it('should return non-string input unchanged', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('validateObjectId', () => {
    it('should validate correct MongoDB ObjectIds', () => {
      expect(validateObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(validateObjectId('5f8d0d55b54764421b7156c9')).toBe(true);
    });

    it('should reject invalid ObjectIds', () => {
      expect(validateObjectId('invalid')).toBe(false);
      expect(validateObjectId('507f1f77bcf86cd79943901')).toBe(false); // Too short
      expect(validateObjectId('507f1f77bcf86cd7994390111')).toBe(false); // Too long
      expect(validateObjectId('507f1f77bcf86cd799439g11')).toBe(false); // Invalid character
      expect(validateObjectId('')).toBe(false);
    });
  });

  describe('validatePagination', () => {
    it('should return default values for undefined inputs', () => {
      const result = validatePagination(undefined, undefined);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should validate and return correct pagination values', () => {
      const result = validatePagination(2, 20);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(20);
    });

    it('should enforce minimum page of 1', () => {
      const result = validatePagination(0, 10);
      expect(result.page).toBe(1);
      expect(result.skip).toBe(0);
    });

    it('should enforce maximum limit of 100', () => {
      const result = validatePagination(1, 200);
      expect(result.limit).toBe(100);
    });

    it('should enforce minimum limit of 1', () => {
      const result = validatePagination(1, 0);
      expect(result.limit).toBe(1);
    });

    it('should handle string inputs correctly', () => {
      const result = validatePagination('3', '15');
      expect(result.page).toBe(3);
      expect(result.limit).toBe(15);
      expect(result.skip).toBe(30);
    });

    it('should handle invalid string inputs', () => {
      const result = validatePagination('abc', 'xyz');
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });
});
