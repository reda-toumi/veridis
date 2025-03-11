import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h1 className="ml-2 text-2xl font-bold text-gray-800">Veridis</h1>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-indigo-600">Veridis</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect, share, and engage with a community of like-minded individuals. Join us today and start sharing your thoughts with the world.
            </p>
            <div className="flex justify-center space-x-6">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Create Account
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 bg-white text-indigo-600 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-indigo-200 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Your Thoughts</h3>
              <p className="text-gray-600">Express yourself freely and connect with others through meaningful posts and discussions.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Engage & React</h3>
              <p className="text-gray-600">Like and interact with content that resonates with you. Build meaningful connections.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
              <div className="text-indigo-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Build Community</h3>
              <p className="text-gray-600">Join a vibrant community of users and create lasting connections with like-minded people.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-indigo-600 rounded-xl shadow-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
            <p className="text-indigo-100 mb-6">Join thousands of users already sharing their thoughts on Veridis.</p>
            <Link 
              to="/register" 
              className="inline-block px-8 py-3 bg-white text-indigo-600 text-lg font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Join Veridis Today
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Veridis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

