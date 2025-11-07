// Unit Tests for Authentication Utilities

const { generateToken, verifyToken, extractToken } = require('../../src/utils/auth');

describe('Authentication Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user'
      };

      const token = generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user information in token payload', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      };

      const token = generateToken(user);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(user._id);
      expect(decoded.username).toBe(user.username);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user'
      };

      const token = generateToken(user);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(user._id);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        verifyToken('not-a-token');
      }).toThrow();
    });
  });

  describe('extractToken', () => {
    it('should extract token from Bearer authorization header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const authHeader = `Bearer ${token}`;

      const extracted = extractToken(authHeader);

      expect(extracted).toBe(token);
    });

    it('should return null for missing authorization header', () => {
      const extracted = extractToken(null);

      expect(extracted).toBeNull();
    });

    it('should return null for authorization header without Bearer', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const authHeader = `Token ${token}`;

      const extracted = extractToken(authHeader);

      expect(extracted).toBeNull();
    });

    it('should return null for empty authorization header', () => {
      const extracted = extractToken('');

      expect(extracted).toBeNull();
    });
  });
});
