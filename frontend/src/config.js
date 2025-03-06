export const API_BASE_URL = 'http://localhost:5001/api';

export const API_URLS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`
  },
  profile: (username) => `${API_BASE_URL}/profile/${username}`
}; 