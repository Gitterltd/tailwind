// src/App.tsx
import React, { useState, useEffect } from 'react'; // <--- ADD useState and useEffect here!
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { useAuth } from './context/AuthContext';
import { Button } from './components/ui/button';
import api from './services/api'; // Don't forget to import the api service for Dashboard


// A simple protected component example
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await api.get('/users/me'); // Using the 'api' instance
        setData(response.data);
      } catch (error) {
        console.error('Error fetching protected data:', error);
        setFetchError('Failed to fetch user data. Token might be invalid or expired.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchProtectedData();
  }, []);

  if (loadingData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {user?.username}!</h1>
      {fetchError && <p className="text-red-500">{fetchError}</p>}
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Your Profile Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <Button onClick={logout} className="mt-4">Logout</Button>
    </div>
  );
};

// A component to protect routes
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>; // Or a spinner
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};


function App() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex justify-between items-center p-4 border-b">
        <Link to="/" className="text-xl font-bold">My App</Link>
        <div>
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost">Register</Button>
              </Link>
            </>
          ) : (
            <Button variant="ghost" onClick={logout}>Logout</Button>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<div><h2>Home Page</h2><p>Welcome! Please login or register.</p></div>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;