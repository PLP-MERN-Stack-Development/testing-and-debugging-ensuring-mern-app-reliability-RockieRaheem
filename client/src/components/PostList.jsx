// PostList Component - Display list of posts

import React from 'react';
import PostCard from './PostCard';
import './PostList.css';

const PostList = ({
  posts = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onLike
}) => {
  if (loading) {
    return (
      <div className="post-list-loading" role="status" aria-live="polite">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list-error" role="alert">
        Error: {error}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="post-list-empty" role="status">
        No posts found
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default PostList;
