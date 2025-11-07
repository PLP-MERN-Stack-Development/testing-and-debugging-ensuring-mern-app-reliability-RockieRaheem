// Authentication Utility - JWT token generation and verification

const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-test-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    username: user.username,
    email: user.email,
    role: user.role || "user",
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header
 * @returns {String|null} Token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  JWT_SECRET,
  JWT_EXPIRE,
};
