import React, { useState, useEffect } from "react";
import axios from "axios";

function Posts({ userId = null, allowPost = false }) {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Determine API endpoint based on whether `userId` is provided
  const API_URL = userId
    ? `http://localhost:5001/api/my-posts` // Fetch only user-specific posts
    : `http://localhost:5001/api/posts`; // Fetch all posts

  // Fetch posts on mount or when `userId` changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(API_URL, { headers });
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      }
    };

    fetchPosts();
  }, [userId]); // Re-run when `userId` changes

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (input.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to post!");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/posts",
        { content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Use the returned post (which includes user info)
      setPosts([response.data, ...posts]);
      setInput("");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete posts!");
        return;
      }

      // Send DELETE request to backend
      await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted post from state
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {userId ? "My Posts" : "All Posts"}
      </h2>

      {/* Post Input Box: Only show when `allowPost` is true */}
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

      {/* Display Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Display Posts */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id}
              className="relative bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              {/* Delete Button (Only show if the logged-in user is the author) */}
              {userId === post.userId && (
                <button
                  className="absolute top-4 right-4 p-2 text-sm font-medium text-gray-400 hover:text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      handleDelete(post.id);
                    }
                  }}
                  title="Delete Post"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">{post.user?.username[0] || "U"}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{post.user?.username || "Unknown User"}</p>
                  <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
              <div className="mt-4 flex items-center space-x-4 text-gray-500">
                <button 
                  className={`flex items-center space-x-1 transition-colors ${
                    post.liked ? 'text-indigo-600' : 'hover:text-indigo-600'
                  }`}
                  onClick={() => {
                    const updatedPosts = posts.map(p => 
                      p.id === post.id ? {...p, liked: !p.liked} : p
                    );
                    setPosts(updatedPosts);
                  }}
                >
                  <svg className="w-5 h-5" fill={post.liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Comment</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-6"></div>
        )}
      </div>
    </div>
  );
}

export default Posts;
