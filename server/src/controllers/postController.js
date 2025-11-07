// Post Controller - Handle post CRUD operations

const Post = require('../models/Post');
const { validateObjectId, validatePagination } = require('../utils/validation');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = asyncHandler(async (req, res) => {
  const { category, status, author, page, limit, sort } = req.query;

  // Build query
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  if (author) query.author = author;

  // Pagination
  const { page: validPage, limit: validLimit, skip } = validatePagination(page, limit);

  // Sorting
  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  // Execute query
  const posts = await Post.find(query)
    .populate('author', 'username email')
    .populate('category', 'name slug')
    .sort(sortOption)
    .limit(validLimit)
    .skip(skip);

  const total = await Post.countDocuments(query);

  logger.info(`Posts retrieved: ${posts.length} of ${total}`);

  res.json({
    success: true,
    count: posts.length,
    total,
    page: validPage,
    pages: Math.ceil(total / validLimit),
    data: posts
  });
});

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    throw new AppError('Invalid post ID', 400);
  }

  const post = await Post.findById(id)
    .populate('author', 'username email')
    .populate('category', 'name slug');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Increment views
  post.views += 1;
  await post.save();

  logger.info(`Post retrieved: ${post.title} (${post._id})`);

  res.json({
    success: true,
    data: post
  });
});

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, status } = req.body;

  if (!title || !content) {
    throw new AppError('Please provide title and content', 400);
  }

  const post = await Post.create({
    title,
    content,
    category,
    tags,
    status: status || 'draft',
    author: req.user._id
  });

  await post.populate('author', 'username email');

  logger.info(`Post created: ${post.title} by ${req.user.username}`);

  res.status(201).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    throw new AppError('Invalid post ID', 400);
  }

  let post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to update this post', 403);
  }

  const { title, content, category, tags, status } = req.body;

  post = await Post.findByIdAndUpdate(
    id,
    { title, content, category, tags, status },
    { new: true, runValidators: true }
  ).populate('author', 'username email');

  logger.info(`Post updated: ${post.title} by ${req.user.username}`);

  res.json({
    success: true,
    data: post
  });
});

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    throw new AppError('Invalid post ID', 400);
  }

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this post', 403);
  }

  await post.deleteOne();

  logger.info(`Post deleted: ${post.title} by ${req.user.username}`);

  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
});

/**
 * @desc    Like a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    throw new AppError('Invalid post ID', 400);
  }

  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  post.likes += 1;
  await post.save();

  res.json({
    success: true,
    likes: post.likes
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost
};
