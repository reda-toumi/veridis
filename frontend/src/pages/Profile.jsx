import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import { API_URLS } from '../config';
import Posts from '../components/Posts';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navItems = [
    { to: '/dashboard/profile', label: 'Profile', active: true },
    { to: '/dashboard/browse', label: 'Browse', active: false }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        const res = await axios.get(API_URLS.auth.me, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setUser(res.data);
      } catch (err) {
        console.error('Error details:', err);
        if (err.response) {
          setError(err.response.data.error || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('No response from server. Please check if the backend is running.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header navItems={navItems} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col items-center">
            <ProfilePicture />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">
              {loading ? 'Loading...' : error ? 'Error' : user?.username}
            </h2>
          </div>
        </div>

        {/* Show only this user's posts and allow posting */}
        {user && <Posts userId={user.id} allowPost={true} />}
      </main>
    </div>
  );
}

export default Profile;
