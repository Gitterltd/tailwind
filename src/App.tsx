// src/App.tsx - Core Application Setup
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Toaster } from "@/components/ui/toaster"; // Assuming this path and named export are correct
import { Toaster as SonnerToaster } from "sonner"; // Assuming 'sonner' library, renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';

// --- Import your page components from src/pages/ ---
// Ensure these files exist in your src/pages/ directory with these names.
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx"; // Your example protected page

// Your existing project pages (placeholder components provided below for compilation)
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ForkliftsPage from "./pages/Forklifts.tsx";
import ReportsPage from "./pages/Reports.tsx";
import OperatorsPage from "./pages/Operators.tsx";
import OperationsPage from "./pages/Operations.tsx";
import MaintenancePage from "./pages/Maintenance.tsx";
import GasSupplyPage from "./pages/GasSupply.tsx";

// --- Auth Context for Global Firebase Access ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appId, setAppId] = useState('default-app-id');

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // --- Firebase Configuration for local development ---
        // If running in Canvas, __firebase_config is provided.
        // Otherwise, use your actual Firebase config object here for local development.
        const firebaseConfig = typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config)
          : {
            apiKey: "AIzaSyDpSfEn-89u0XxrbMA1w0Mnot89h5DL-Jc",
            authDomain: "tailwind-b7639.firebaseapp.com",
            projectId: "tailwind-b7639",
            storageBucket: "tailwind-b7639.firebasestorage.app",
            messagingSenderId: "458780924058",
            appId: "1:458780924058:web:5c680fd55027fae2942723"
            };

        if (!firebaseConfig || Object.keys(firebaseConfig).length === 0 || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY") {
          console.error("Firebase config is missing or empty or still using placeholder. Please ensure __firebase_config is defined in Canvas or replace placeholders for local development.");
          setAuthError("Firebase configuration missing or incomplete. Cannot initialize app.");
          setAuthLoading(false);
          return;
        }

        const app = initializeApp(firebaseConfig);
        setFirebaseApp(app);

        const authInstance = getAuth(app);
        setAuth(authInstance);

        // --- App ID for local development ---
        // If running in Canvas, __app_id is provided.
        // Otherwise, use a default ID for local development.
        setAppId(typeof __app_id !== 'undefined' ? __app_id : 'local-dev-app-id');

        // --- Initial Authentication for local development ---
        // If running in Canvas, __initial_auth_token is provided.
        // Otherwise, sign in anonymously for local development to allow basic functionality.
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(authInstance, __initial_auth_token);
            console.log("Signed in with custom token.");
          } catch (tokenError) {
            console.error("Error signing in with custom token, attempting anonymous sign-in for local dev:", tokenError);
            try {
                await signInAnonymously(authInstance);
                console.log("Signed in anonymously after custom token failure.");
            } catch (anonError) {
                console.error("Error signing in anonymously for local dev:", anonError);
                setAuthError("Authentication failed: Could not sign in.");
            }
          }
        } else {
          try {
            await signInAnonymously(authInstance);
            console.log("Signed in anonymously for local development.");
          } catch (anonError) {
            console.error("Error signing in anonymously for local dev:", anonError);
            setAuthError("Authentication failed: Could not sign in anonymously.");
          }
        }

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setCurrentUser(user);
          setAuthLoading(false);
          if (user) {
            console.log("Auth state changed, user:", user.uid);
          } else {
            console.log("Auth state changed, no user.");
          }
        });

        return () => unsubscribe();

      } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        setAuthError(`Firebase initialization failed: ${error.message}`);
        setAuthLoading(false);
      }
    };

    initializeFirebase();
  }, []);

  const contextValue = { 
    firebaseApp, 
    auth, 
    db: null, // db is null as we are simulating MySQL backend
    currentUser, 
    authLoading, 
    authError, 
    appId,
    // Provide auth methods directly for convenience
    signInWithEmailAndPassword: signInWithEmailAndPassword,
    createUserWithEmailAndPassword: createUserWithEmailAndPassword,
    signOut: signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Export useAuth so it can be imported by other page components
export function useAuth() {
  return useContext(AuthContext);
}

// --- Common UI Components (defined once and exported from App.tsx) ---
export function MessageDisplay({ message, type }) {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
  const borderColor = type === 'error' ? 'border-red-500' : 'border-green-500';

  return (
    <div className={`p-4 rounded-md border ${bgColor} ${borderColor} mb-4`} role="alert">
      <p className="font-semibold">{type === 'error' ? 'Error!' : 'Success!'}</p>
      <p>{message}</p>
    </div>
  );
}

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center border border-red-400 text-red-700">
        <h2 className="text-2xl font-bold mb-4">Application Error</h2>
        <p>{message}</p>
        <p className="mt-4 text-sm text-gray-600">Please try refreshing the page.</p>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute component to guard routes that require authentication.
 */
function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (accessible to all) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes (require authentication) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index /> {/* Your existing Index.tsx for the dashboard */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard" // This route also leads to dashboard (or you can remove it)
              element={
                <ProtectedRoute>
                  <DashboardPage /> {/* A sample protected page */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/forklifts"
              element={
                <ProtectedRoute>
                  <ForkliftsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operators"
              element={
                <ProtectedRoute>
                  <OperatorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations"
              element={
                <ProtectedRoute>
                  <OperationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute>
                  <MaintenancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gas-supply"
              element={
                <ProtectedRoute>
                  <GasSupplyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for any undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
