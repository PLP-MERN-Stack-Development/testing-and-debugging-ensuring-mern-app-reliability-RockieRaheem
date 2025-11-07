// Category Model - Mongoose schema for post categories

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    minlength: [2, "Category name must be at least 2 characters long"],
    maxlength: [50, "Category name cannot exceed 50 characters"],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  color: {
    type: String,
    default: "#000000",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug from name before saving
categorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
