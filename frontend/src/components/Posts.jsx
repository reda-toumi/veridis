import React, { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import { API_URLS } from "../config";

function Posts({ userId = null, allowPost = false }) {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch posts on mount or when userId changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId);
    }
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const endpoint = userId ? API_URLS.userPosts(userId) : API_URLS.posts;

        const response = await axios.get(endpoint, { headers });
        
        // Sort posts by newest first
        const sortedPosts = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      }
    };

    fetchPosts();
  }, [userId]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a post!");
        return;
      }

      const response = await axios.post(
        API_URLS.posts,
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) => [response.data, ...prevPosts]);
      setInput("");
      setError("");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleLikeChange = (postId, liked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: liked,
              _count: {
                ...post._count,
                likes: liked
                  ? (post._count?.likes || 0) + 1
                  : (post._count?.likes || 1) - 1,
              },
            }
          : post
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {userId ? "User Posts" : "All Posts"}
      </h2>

      {/* Post Creation Form */}
      {allowPost && (
        <div className="mb-8">
          <div className="max-w-2xl flex gap-3">
            <textarea
              className="flex-1 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="What's on your mind?"
              value={input}
              onChange={handleInputChange}
              rows={2}
            />
            <button
              className={`h-fit px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 ${
                input.trim() === "" 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              }`}
              onClick={handleSubmit}
              disabled={input.trim() === ""}
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onLikeChange={handleLikeChange}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-6">No posts found</div>
        )}
      </div>
    </div>
  );
}

export default Posts;
