const API_URL = 'http://localhost:5001';

export const API_URLS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    me: `${API_URL}/api/auth/me`,
    uploadProfilePicture: `${API_URL}/api/auth/upload-profile-picture`
  },
  profile: {
    get: (username) => `${API_URL}/api/profile/${username}`,
    search: (query) => `${API_URL}/api/profile/search/${query}`
  },
  posts: `${API_URL}/api/posts`,
  post: (id) => `${API_URL}/api/posts/${id}`,
  userPosts: (userId) => `${API_URL}/api/posts/user/${userId}`
}; 