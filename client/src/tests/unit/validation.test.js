// Unit Tests for Validation Utilities

import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateRequired,
  validateMinLength,
  validateMaxLength
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('returns empty string for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe('');
      expect(validateEmail('user.name@domain.co.uk')).toBe('');
    });

    it('returns error for invalid emails', () => {
      expect(validateEmail('invalid')).toBeTruthy();
      expect(validateEmail('test@')).toBeTruthy();
      expect(validateEmail('@example.com')).toBeTruthy();
    });

    it('returns error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });
  });

  describe('validatePassword', () => {
    it('returns empty string for valid passwords', () => {
      expect(validatePassword('password123')).toBe('');
    });

    it('returns error for short passwords', () => {
      expect(validatePassword('pass')).toBe('Password must be at least 6 characters');
    });

    it('returns error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
    });
  });

  describe('validateUsername', () => {
    it('returns empty string for valid usernames', () => {
      expect(validateUsername('testuser')).toBe('');
    });

    it('returns error for short usernames', () => {
      expect(validateUsername('ab')).toBe('Username must be at least 3 characters');
    });

    it('returns error for long usernames', () => {
      const longUsername = 'a'.repeat(31);
      expect(validateUsername(longUsername)).toBe('Username cannot exceed 30 characters');
    });

    it('returns error for empty username', () => {
      expect(validateUsername('')).toBe('Username is required');
    });
  });

  describe('validateRequired', () => {
    it('returns empty string for non-empty values', () => {
      expect(validateRequired('value')).toBe('');
      expect(validateRequired(123)).toBe('');
    });

    it('returns error for empty values', () => {
      expect(validateRequired('')).toBe('This field is required');
      expect(validateRequired('   ')).toBe('This field is required');
    });

    it('uses custom field name in error message', () => {
      expect(validateRequired('', 'Username')).toBe('Username is required');
    });
  });

  describe('validateMinLength', () => {
    it('returns empty string for values meeting minimum length', () => {
      expect(validateMinLength('hello', 5)).toBe('');
      expect(validateMinLength('testing', 5)).toBe('');
    });

    it('returns error for values below minimum length', () => {
      expect(validateMinLength('hi', 5)).toBe('This field must be at least 5 characters');
    });

    it('uses custom field name in error message', () => {
      expect(validateMinLength('hi', 5, 'Password')).toBe('Password must be at least 5 characters');
    });
  });

  describe('validateMaxLength', () => {
    it('returns empty string for values within maximum length', () => {
      expect(validateMaxLength('hello', 10)).toBe('');
    });

    it('returns error for values exceeding maximum length', () => {
      expect(validateMaxLength('hello world', 5)).toBe('This field cannot exceed 5 characters');
    });

    it('uses custom field name in error message', () => {
      expect(validateMaxLength('hello world', 5, 'Title')).toBe('Title cannot exceed 5 characters');
    });
  });
});
