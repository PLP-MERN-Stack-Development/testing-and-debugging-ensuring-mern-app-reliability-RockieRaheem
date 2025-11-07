// Auth Controller - Handle authentication logic

const User = require("../models/User");
const { generateToken } = require("../utils/auth");
const { validateEmail } = require("../utils/validation");
const { asyncHandler, AppError } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    throw new AppError("Please provide all required fields", 400);
  }

  if (!validateEmail(email)) {
    throw new AppError("Please provide a valid email", 400);
  }

  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new AppError("User with this email or username already exists", 400);
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user);

  logger.info(`New user registered: ${user.username} (${user._id})`);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  // Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw new AppError("Invalid credentials", 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    logger.warn(`Failed login attempt for user: ${user.username}`);
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 401);
  }

  // Generate token
  const token = generateToken(user);

  logger.info(`User logged in: ${user.username} (${user._id})`);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const fieldsToUpdate = {};
  if (username) fieldsToUpdate.username = username;
  if (email) {
    if (!validateEmail(email)) {
      throw new AppError("Please provide a valid email", 400);
    }
    fieldsToUpdate.email = email;
  }

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  logger.info(`User profile updated: ${user.username} (${user._id})`);

  res.json({
    success: true,
    user,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Please provide current and new password", 400);
  }

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.username} (${user._id})`);

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
