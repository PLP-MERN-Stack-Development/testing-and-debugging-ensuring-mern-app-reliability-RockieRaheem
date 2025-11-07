// Main App Component

import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import PostList from "./components/PostList";
import "./App.css";

function App() {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      setPosts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleEdit = (post) => {
    console.log("Edit post:", post);
    // Implement edit functionality
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>MERN Testing Blog</h1>
          <p>Testing and Debugging Assignment</p>
        </header>
        <main className="App-main">
          <PostList
            posts={posts}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
