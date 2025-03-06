import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import Posts from '../components/Posts';
import { API_URLS } from '../config';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const navItems = [
    { to: '/dashboard/profile', label: 'Profile', active: true },
    { to: '/dashboard/browse', label: 'Browse', active: false }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        console.log('Fetching profile for username:', username);
        console.log('Current user from localStorage:', currentUser);
        console.log('Token from localStorage:', token.substring(0, 20) + '...');
        
        // If no username is provided, fetch the current user's profile
        const endpoint = username 
          ? API_URLS.profile(username)
          : API_URLS.auth.me;
        
        console.log('Using endpoint:', endpoint);
        console.log('Token present:', !!token);

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        console.log('Request headers:', headers);

        const res = await axios.get(endpoint, { headers });
        
        console.log('Profile data received:', res.data);
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
          // Optionally redirect to login
          window.location.href = '/login';
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
  }, [username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header navItems={navItems} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col items-center">
            <ProfilePicture user={user} />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">
              {loading ? 'Loading...' : error ? 'Error' : user?.username}
            </h2>
            {user?.bio && (
              <p className="text-gray-600 mt-2 text-center max-w-md">{user.bio}</p>
            )}
            <p className="text-gray-500 mt-2">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Show posts and allow posting only if viewing own profile */}
        {user && (
          <Posts 
            userId={user.id} 
            allowPost={!username || username === currentUser?.username} 
          />
        )}
      </main>
    </div>
  );
}

export default Profile;
