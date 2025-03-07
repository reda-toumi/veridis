import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainPage from '../components/MainPage';
import { API_URLS } from '../config';

function Browse() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(API_URLS.auth.me, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <MainPage
      user={user}
      isProfilePage={false}
      allowPost={true}
      currentPage="browse"
      loading={loading}
      error={error}
    />
  );
}

export default Browse;
