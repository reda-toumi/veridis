import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Veridis</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded border border-gray-300 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Welcome to Veridis
          </h2>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

