import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MainPage from '../components/MainPage';
import { API_URLS } from '../config';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Debug log for URL params and current user
  console.log('URL username:', username);
  console.log('Current user:', currentUser);

  useEffect(() => {
    // If the URL username matches the current user's username, redirect to /dashboard/profile
    if (username && currentUser?.username && username === currentUser.username) {
      console.log('Matching usernames, redirecting...');
      console.log('URL username:', username);
      console.log('Current user username:', currentUser.username);
      navigate('/dashboard/profile', { replace: true });
      return;
    } else {
      console.log('No match or missing data:');
      console.log('- username from URL exists:', !!username);
      console.log('- currentUser exists:', !!currentUser);
      console.log('- currentUser.username exists:', !!currentUser?.username);
      console.log('- username:', username);
      console.log('- currentUser?.username:', currentUser?.username);
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        // If no username is provided, fetch the current user's profile
        const endpoint = username 
          ? API_URLS.profile(username)
          : API_URLS.auth.me;
        
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const res = await axios.get(endpoint, { headers });
        setUser(res.data);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          navigate('/login');
          return;
        }
        
        if (err.response) {
          console.error('Error response:', err.response.data);
          setError(err.response.data.error || `Server error: ${err.response.status}`);
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('No response from server. Please check if the backend is running.');
        } else {
          console.error('Error setting up request:', err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, navigate, currentUser]);

  return (
    <MainPage
      user={user}
      isProfilePage={true}
      allowPost={!username || username === currentUser?.username}
      currentPage="profile"
      loading={loading}
      error={error}
    />
  );
}

export default Profile;
