// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import common UI components and useAuth from App.tsx
import { useAuth, MessageDisplay, LoadingSpinner, ErrorMessage } from '../App.tsx';


/**
 * DashboardPage component to display user information after login.
 * This is an example protected page. Your main dashboard is Index.tsx.
 * Now simulates fetching user profile data from a hypothetical MySQL database via a backend API.
 */
const DashboardPage = () => {
  // Destructure auth, and the specific auth method from useAuth()
  const { auth, currentUser, authLoading, authError, signOut } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileError(null);

      // --- SIMULATED CALL TO YOUR BACKEND API TO FETCH USER PROFILE FROM MYSQL ---
      const backendApiUrl = `http://localhost:3001/api/user-profile/${currentUser.uid}`;
      try {
        const response = await fetch(backendApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${await currentUser.getIdToken()}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user profile from backend.');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile from backend:", err);
        setProfileError(`Error loading profile from backend: ${err.message}. (Backend server required for this functionality.)`);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    if (auth && signOut) {
      await signOut(auth);
      navigate('/login');
    }
  };

  if (authLoading) return <LoadingSpinner />;
  if (authError) return <ErrorMessage message={authError} />;

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-gray-200">
          <p className="text-lg text-red-600 font-semibold mb-4">You are not logged in.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            aria-label="Go to Login"
          >
            Go to Login/Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome to DashboardPage!</h2>
        <p className="mb-4 text-center text-sm text-gray-600">This is a separate protected page. Your main dashboard is at the root `/`.</p>
        {profileLoading && <LoadingSpinner message="Loading user profile..." />}
        {profileError && <MessageDisplay message={profileError} type="error" />}
        {currentUser && (
          <div className="text-center">
            <p className="text-lg mb-2">
              <strong>Logged in as:</strong> {currentUser.email}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Your User ID:</strong>{' '}
              <span className="break-words font-mono text-blue-700">
                {currentUser.uid}
              </span>
            </p>
            {userProfile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">Your Profile Data (from Simulated Backend):</h3>
                <p><strong>User ID:</strong> {userProfile.uid}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Created At:</strong> {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
            )}
            {!userProfile && !profileLoading && !profileError && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200 text-yellow-700">
                    <p>No profile data found from the simulated backend. Make sure your backend API is running and configured to return user profiles.</p>
                </div>
            )}
            <button
              onClick={handleLogout}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
