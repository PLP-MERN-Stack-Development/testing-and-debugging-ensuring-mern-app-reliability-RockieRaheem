// Unit Tests for Authentication Middleware

const {
  authenticate,
  authorize,
  optionalAuth,
} = require("../../src/middleware/auth");
const { generateToken } = require("../../src/utils/auth");
const User = require("../../src/models/User");

// Mock the User model
jest.mock("../../src/models/User");

describe("Authentication Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should authenticate user with valid token", async () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        isActive: true,
      };

      const token = generateToken(user);
      mockReq.headers.authorization = `Bearer ${token}`;

      // Mock User.findById to return a mock user
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user._id).toBe(user._id);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should reject request without token", async () => {
      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Access denied. No token provided.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject request with invalid token", async () => {
      mockReq.headers.authorization = "Bearer invalid-token";

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid or expired token.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject request for inactive user", async () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        isActive: false,
      };

      const token = generateToken(user);
      mockReq.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Account is inactive.",
      });
    });

    it("should reject request for non-existent user", async () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      const token = generateToken(user);
      mockReq.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid token. User not found.",
      });
    });
  });

  describe("authorize", () => {
    it("should authorize user with correct role", () => {
      mockReq.user = {
        _id: "507f1f77bcf86cd799439011",
        username: "admin",
        role: "admin",
      };

      const middleware = authorize("admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should authorize user with one of multiple allowed roles", () => {
      mockReq.user = {
        _id: "507f1f77bcf86cd799439011",
        username: "user",
        role: "user",
      };

      const middleware = authorize("user", "admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should reject user without required role", () => {
      mockReq.user = {
        _id: "507f1f77bcf86cd799439011",
        username: "user",
        role: "user",
      };

      const middleware = authorize("admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Access denied. Insufficient permissions.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reject request without authenticated user", () => {
      const middleware = authorize("admin");
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Authentication required.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("optionalAuth", () => {
    it("should attach user if valid token provided", async () => {
      const user = {
        _id: "507f1f77bcf86cd799439011",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        isActive: true,
      };

      const token = generateToken(user);
      mockReq.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
      });

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should continue without user if no token provided", async () => {
      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should continue without user if invalid token provided", async () => {
      mockReq.headers.authorization = "Bearer invalid-token";

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
