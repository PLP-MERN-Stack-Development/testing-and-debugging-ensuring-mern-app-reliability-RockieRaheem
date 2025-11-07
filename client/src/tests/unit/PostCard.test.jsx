// Unit Tests for PostCard Component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import PostCard from '../../components/PostCard';

describe('PostCard Component', () => {
  const mockPost = {
    _id: '123',
    title: 'Test Post Title',
    content: 'This is the test post content.',
    author: {
      _id: '456',
      username: 'testuser',
      email: 'test@example.com'
    },
    category: {
      _id: '789',
      name: 'Technology',
      slug: 'technology'
    },
    views: 100,
    likes: 25,
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  it('renders post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is the test post content.')).toBeInTheDocument();
  });

  it('renders author username', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('renders category name', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders views count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/100 views/i)).toBeInTheDocument();
  });

  it('renders likes count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/25 likes/i)).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/Jan 1, 2024/i)).toBeInTheDocument();
  });

  it('calls onLike when Like button is clicked', () => {
    const handleLike = jest.fn();
    render(<PostCard post={mockPost} onLike={handleLike} />);

    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);

    expect(handleLike).toHaveBeenCalledWith('123');
  });

  it('calls onEdit when Edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<PostCard post={mockPost} onEdit={handleEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledWith(mockPost);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<PostCard post={mockPost} onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith('123');
  });

  it('does not render action buttons when handlers are not provided', () => {
    render(<PostCard post={mockPost} />);

    expect(screen.queryByRole('button', { name: /like/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('handles missing author gracefully', () => {
    const postWithoutAuthor = { ...mockPost, author: null };
    render(<PostCard post={postWithoutAuthor} />);

    expect(screen.getByText(/unknown/i)).toBeInTheDocument();
  });

  it('handles missing category gracefully', () => {
    const postWithoutCategory = { ...mockPost, category: null };
    render(<PostCard post={postWithoutCategory} />);

    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
  });

  it('handles default values for views and likes', () => {
    const postWithoutStats = {
      ...mockPost,
      views: undefined,
      likes: undefined
    };
    render(<PostCard post={postWithoutStats} />);

    expect(screen.getByText(/0 views/i)).toBeInTheDocument();
    expect(screen.getByText(/0 likes/i)).toBeInTheDocument();
  });
});
