// Post Routes - Define post endpoints

const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postController");
const { authenticate, optionalAuth } = require("../middleware/auth");

// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);
router.put("/:id/like", authenticate, likePost);

module.exports = router;
