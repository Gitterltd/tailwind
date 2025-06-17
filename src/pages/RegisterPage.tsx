// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import common UI components and useAuth from App.tsx
import { useAuth, MessageDisplay, LoadingSpinner, ErrorMessage } from '../App.tsx';


/**
 * RegisterPage component for user registration.
 * Now simulates storing user profile data in a hypothetical MySQL database via a backend API.
 */
const RegisterPage = () => {
  // Destructure auth, and the specific auth methods from useAuth()
  const { auth, authLoading, authError, createUserWithEmailAndPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!auth || !createUserWithEmailAndPassword) {
      setError("Firebase Auth not initialized or registration method unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- SIMULATED CALL TO YOUR BACKEND API TO STORE USER PROFILE IN MYSQL ---
      const backendApiUrl = 'http://localhost:3001/api/user-profile';
      try {
        const response = await fetch(backendApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save user profile in backend.');
        }

        const data = await response.json();
        console.log("User profile saved in simulated MySQL backend:", data);
        setMessage('Registration successful and profile saved! You can now log in.');
        navigate('/login'); // After registration, navigate to login
      } catch (backendErr) {
        console.error("Error saving user profile to backend:", backendErr);
        setError(`Registration successful, but profile save failed: ${backendErr.message}`);
        setMessage('Registration successful, but profile data could not be saved. Please try logging in.');
        navigate('/login'); // Still navigate to login if Firebase Auth was successful
      }
      // --- END SIMULATED BACKEND CALL ---

    } catch (err) {
      console.error("Registration error:", err);
      setError(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <LoadingSpinner />;
  if (authError) return <ErrorMessage message={authError} />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
        <MessageDisplay message={message} type="success" />
        <MessageDisplay message={error} type="error" />
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm appearance-none border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
            disabled={loading}
            aria-label="Register"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none focus:underline"
            aria-label="Login here"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
