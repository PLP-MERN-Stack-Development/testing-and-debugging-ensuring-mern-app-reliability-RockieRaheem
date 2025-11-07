// Authentication Middleware - Protect routes with JWT verification

const { verifyToken, extractToken } = require("../utils/auth");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Middleware to authenticate user with JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      logger.warn("Authentication failed: No token provided");
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      logger.warn(`Authentication failed: User not found - ${decoded.id}`);
      return res.status(401).json({
        success: false,
        error: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      logger.warn(`Authentication failed: Inactive user - ${decoded.id}`);
      return res.status(401).json({
        success: false,
        error: "Account is inactive.",
      });
    }

    // Attach user to request
    req.user = user;
    logger.info(`User authenticated: ${user.username} (${user._id})`);
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

/**
 * Middleware to authorize based on user roles
 * @param  {...String} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn("Authorization failed: No user in request");
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed: User ${req.user.username} with role ${req.user.role} attempted to access restricted resource`
      );
      return res.status(403).json({
        success: false,
        error: "Access denied. Insufficient permissions.",
      });
    }

    logger.info(`User authorized: ${req.user.username} (${req.user.role})`);
    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
