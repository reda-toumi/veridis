import React from 'react';
import Header from './Header';
import ProfilePicture from './ProfilePicture';
import Posts from './Posts';

function MainPage({ 
  user, 
  isProfilePage, 
  allowPost, 
  currentPage, 
  loading, 
  error 
}) {
  const navItems = [
    { to: '/dashboard/profile', label: 'Profile', active: currentPage === 'profile' },
    { to: '/dashboard/browse', label: 'Browse', active: currentPage === 'browse' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Unknown date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Debug user data
  React.useEffect(() => {
    if (user) {
      console.log('User data:', user);
      console.log('CreatedAt:', user.createdAt);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header navItems={navItems} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile section - only visible on profile page */}
        {isProfilePage && (
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
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Posts section */}
        {user && (
          <Posts 
            userId={isProfilePage ? user.id : null} 
            allowPost={allowPost} 
          />
        )}
      </main>
    </div>
  );
}

export default MainPage; 