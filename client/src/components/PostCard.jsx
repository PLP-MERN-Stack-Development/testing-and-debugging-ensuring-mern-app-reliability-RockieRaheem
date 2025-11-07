// PostCard Component - Display individual post

import React from "react";
import Button from "./Button";
import "./PostCard.css";

const PostCard = ({ post, onEdit, onDelete, onLike }) => {
  const {
    _id,
    title,
    content,
    author,
    category,
    views = 0,
    likes = 0,
    createdAt,
  } = post;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="post-card" data-testid="post-card">
      <div className="post-header">
        <h2 className="post-title">{title}</h2>
        {category && (
          <span className="post-category">{category.name || category}</span>
        )}
      </div>

      <p className="post-content">{content}</p>

      <div className="post-meta">
        <span className="post-author">By {author?.username || "Unknown"}</span>
        <span className="post-date">{formatDate(createdAt)}</span>
      </div>

      <div className="post-stats">
        <span className="stat">👁 {views} views</span>
        <span className="stat">❤ {likes} likes</span>
      </div>

      <div className="post-actions">
        {onLike && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onLike(_id)}
            aria-label="Like post"
          >
            Like
          </Button>
        )}
        {onEdit && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(post)}
            aria-label="Edit post"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(_id)}
            aria-label="Delete post"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
