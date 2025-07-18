// src/components/auth/AuthGuard.tsx
// This component guards routes, redirecting unauthenticated users to the login page.
// It now receives currentUser, authLoading, and LoadingSpinner as props from App.tsx
// to bypass Canvas environment import resolution issues.

import React from 'react';
import { Navigate } from 'react-router-dom';
// Removed direct import of useAuth and LoadingSpinner from App.tsx
// import { useAuth, LoadingSpinner } from '../../App.tsx'; 

interface AuthGuardProps {
  children: React.ReactNode;
  currentUser: any; // Passed from App.tsx
  authLoading: boolean; // Passed from App.tsx
  LoadingSpinner: React.FC<{ message?: string }>; // Passed from App.tsx
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, currentUser, authLoading, LoadingSpinner }) => {

  // Show a loading spinner while authentication state is being determined
  if (authLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If no user is logged in, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected content/page)
  return <>{children}</>;
};

export default AuthGuard;
