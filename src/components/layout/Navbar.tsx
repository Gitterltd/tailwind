// src/components/layouts/Navbar.tsx
// This version is adapted for Canvas environment limitations by removing external/aliased imports.
// In your local development, you should continue to use your original `cn` and `Badge` components.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Removed lucide-react imports; using inline SVGs for maximum Canvas compatibility
// import { Bell, Search, ChevronDown } from 'lucide-react';
// Removed cn and Badge imports; using direct Tailwind and simple HTML for Canvas compatibility
// import { cn } from '@/lib/utils';
// import Badge from '@/components/common/Badge';

// Import useAuth from App.tsx - adjusted path for sibling component access
// This path is correct for your multi-file structure. If Canvas still fails here,
// it indicates a severe limitation in its module resolution for nested paths.
import { useAuth } from '../../App.tsx'; 

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const { currentUser, auth, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (auth && signOut) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>} {/* Used text-gray-400 instead of text-muted-foreground */}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search - using inline SVG */}
        <div className="relative hidden md:block">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search..." 
            className="py-2 pl-10 pr-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs transition-all duration-300 text-white placeholder-gray-400"
          />
        </div>
        
        {/* Notifications - using inline SVG and simple div for badge */}
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {/* Simple red circle badge */}
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              {/* User Avatar - using first letter of email or 'U' if not available */}
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.email}</p>
                <p className="text-xs text-gray-400">Administrator</p> {/* Used text-gray-400 */}
              </div>
              {/* ChevronDown - using inline SVG */}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              {/* Logout Button - using direct Tailwind classes */}
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-red-500 hover:bg-red-600 text-white"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            // Display Login/Register links if no user is logged in
            <>
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white">Login</Link> {/* Used text-gray-300 */}
              <Link to="/register" className="text-sm font-medium text-gray-300 hover:text-white">Register</Link> {/* Used text-gray-300 */}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
