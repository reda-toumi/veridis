import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../config';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 2) {
                searchUsers();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close results when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URLS.profile.search(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(response.data);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            <input 
                type="text" 
                placeholder="Search users..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="w-48 px-3 py-1.5 text-sm text-black bg-transparent border-0 focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            
            {/* Search Results */}
            {showResults && (query.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    {loading ? (
                        <div className="p-3 text-center text-gray-500">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-1">
                            {results.map(user => (
                                <Link
                                    key={user.id}
                                    to={`/dashboard/profile/${user.username}`}
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => {
                                        setQuery('');
                                        setShowResults(false);
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                        {user.avatarUrl ? (
                                            <img 
                                                src={user.avatarUrl} 
                                                alt={user.username}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-indigo-600 font-medium">
                                                {user.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-800">{user.username}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-3 text-center text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;