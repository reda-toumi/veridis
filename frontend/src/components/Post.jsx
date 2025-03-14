import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config";

function Post({ post, onDelete, onLikeChange, onDislikeChange, currentUserId }) {
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUserId) || false);
  const [isDisliked, setIsDisliked] = useState(post.dislikedBy?.includes(currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(post._count?.dislikes || 0);
  const [likedBy, setLikedBy] = useState(post.likedBy || []);
  const [dislikedBy, setDislikedBy] = useState(post.dislikedBy || []);

  // Update like/dislike state when currentUserId changes (e.g., after login/logout)
  useEffect(() => {
    setIsLiked(likedBy.includes(currentUserId));
    setIsDisliked(dislikedBy.includes(currentUserId));
  }, [currentUserId, likedBy, dislikedBy]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete!');
        return;
      }

      await axios.delete(
        API_URLS.post(post.id),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setError('Failed to delete. Please try again.');
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to like posts");
        return;
      }

<<<<<<< HEAD
      if (!currentUserId) {
        alert("Please log in to like posts");
        return;
      }

      // Toggle like state optimistically
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
      setLikedBy(prevLikedBy => 
        newLikedState 
          ? [...prevLikedBy, currentUserId]
          : prevLikedBy.filter(id => id !== currentUserId)
      );

      // If post was disliked, remove the dislike
      if (isDisliked) {
        setIsDisliked(false);
        setDislikesCount(prevCount => prevCount - 1);
        setDislikedBy(prevDislikedBy => 
          prevDislikedBy.filter(id => id !== currentUserId)
        );
      }
=======
      // Store previous state for rollback
      const previousState = {
        isLiked: isLiked,
        likesCount: likesCount
      };

      // Optimistically update UI
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
>>>>>>> b45ebb8 (LIKES WIHTOUT DISLIKE)

      // Send like/unlike request to backend
      const response = await axios.post(
        API_URLS.likes.toggle(post.id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update with server response
      if (response.data) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data._count.likes);
        
        // Notify parent component
        if (onLikeChange) {
          onLikeChange(post.id, response.data);
        }
      }
    } catch (error) {
<<<<<<< HEAD
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount(prevCount => isLiked ? prevCount + 1 : prevCount - 1);
      setLikedBy(prevLikedBy => 
        isLiked 
          ? [...prevLikedBy, currentUserId]
          : prevLikedBy.filter(id => id !== currentUserId)
      );
=======
      // Revert to previous state on error
      setIsLiked(previousState.isLiked);
      setLikesCount(previousState.likesCount);
>>>>>>> b45ebb8 (LIKES WIHTOUT DISLIKE)
      console.error("Error toggling like:", error);
      setError(error.response?.data?.error || "Failed to update like status");
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to dislike posts!");
        return;
      }

      if (!currentUserId) {
        alert("Please log in to dislike posts");
        return;
      }

      // Toggle dislike state optimistically
      const newDislikedState = !isDisliked;
      setIsDisliked(newDislikedState);
      setDislikesCount(prevCount => newDislikedState ? prevCount + 1 : prevCount - 1);
      setDislikedBy(prevDislikedBy => 
        newDislikedState 
          ? [...prevDislikedBy, currentUserId]
          : prevDislikedBy.filter(id => id !== currentUserId)
      );

      // If post was liked, remove the like
      if (isLiked) {
        setIsLiked(false);
        setLikesCount(prevCount => prevCount - 1);
        setLikedBy(prevLikedBy => 
          prevLikedBy.filter(id => id !== currentUserId)
        );
      }

      // Send dislike/undislike request to backend
      const response = await axios.post(
        API_URLS.dislikes.toggle(post.id),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Notify parent component about the dislike change
      if (onDislikeChange) {
        onDislikeChange(post.id, response.data.disliked);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsDisliked(!isDisliked);
      setDislikesCount(prevCount => isDisliked ? prevCount + 1 : prevCount - 1);
      setDislikedBy(prevDislikedBy => 
        isDisliked 
          ? [...prevDislikedBy, currentUserId]
          : prevDislikedBy.filter(id => id !== currentUserId)
      );
      console.error("Error toggling dislike:", error);
      if (error.response) {
        setError(error.response.data.error || "Failed to update dislike status. Please try again.");
      } else {
        setError("Failed to update dislike status. Please try again.");
      }
    }
  };

  return (
    <div className="relative bg-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Delete Button (Only show if the logged-in user is the author) */}
      {currentUserId === post.userId && (
        <button
          className="absolute top-4 right-4 p-2 text-sm font-medium text-gray-400 hover:text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              handleDelete();
            }
          }}
          title="Delete Post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-3 mb-3">
        <Link to={`/dashboard/profile/${post.user?.username}`} className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-medium">{post.user?.username[0] || "U"}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800 hover:text-indigo-600 transition-colors">
              {post.user?.username || "Unknown User"}
            </p>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </Link>
      </div>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
      <div className="mt-4 flex items-center space-x-4 text-gray-500">
        <button 
          className={`flex items-center space-x-1 transition-colors ${
            isLiked ? 'text-indigo-600' : 'hover:text-indigo-600'
          }`}
          onClick={handleLike}
          disabled={!currentUserId}
        >
          <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button 
          className={`flex items-center space-x-1 transition-colors ${
            isDisliked ? 'text-red-600' : 'hover:text-red-600'
          }`}
          onClick={handleDislike}
          disabled={!currentUserId}
        >
          <svg className="w-5 h-5 rotate-180" fill={isDisliked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span>{dislikesCount} {dislikesCount === 1 ? 'Dislike' : 'Dislikes'}</span>
        </button>
      </div>
    </div>
  );
}

export default Post;
