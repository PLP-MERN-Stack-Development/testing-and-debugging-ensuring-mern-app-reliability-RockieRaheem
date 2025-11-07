// Validation Utility - Data validation helpers

/**
 * Validate email format
 * @param {String} email - Email address
 * @returns {Boolean} True if valid
 */
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {String} password - Password
 * @returns {Object} Validation result with isValid and errors
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input to prevent XSS
 * @param {String} input - User input
 * @returns {String} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Validate MongoDB ObjectId
 * @param {String} id - ObjectId string
 * @returns {Boolean} True if valid
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate pagination parameters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Validated parameters
 */
const validatePagination = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateObjectId,
  validatePagination,
};
