// Unit Tests for PostList Component

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostList from "../../components/PostList";

describe("PostList Component", () => {
  const mockPosts = [
    {
      _id: "1",
      title: "First Post",
      content: "First post content",
      author: { username: "user1" },
      createdAt: "2024-01-01T00:00:00.000Z",
      views: 10,
      likes: 5,
    },
    {
      _id: "2",
      title: "Second Post",
      content: "Second post content",
      author: { username: "user2" },
      createdAt: "2024-01-02T00:00:00.000Z",
      views: 20,
      likes: 10,
    },
  ];

  it("renders loading state", () => {
    render(<PostList loading={true} />);
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<PostList error="Failed to fetch posts" />);
    expect(
      screen.getByText(/error: failed to fetch posts/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders empty state when no posts", () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders list of posts", () => {
    render(<PostList posts={mockPosts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("renders correct number of posts", () => {
    render(<PostList posts={mockPosts} />);

    const postCards = screen.getAllByTestId("post-card");
    expect(postCards).toHaveLength(2);
  });

  it("passes action handlers to PostCard components", () => {
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();
    const handleLike = jest.fn();

    render(
      <PostList
        posts={mockPosts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLike={handleLike}
      />
    );

    // All action buttons should be rendered
    expect(screen.getAllByRole("button", { name: /edit/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /like/i })).toHaveLength(2);
  });

  it("handles undefined posts prop", () => {
    render(<PostList posts={undefined} />);
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });
});
