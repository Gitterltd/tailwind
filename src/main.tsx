//import { createRoot } from 'react-dom/client'
//import App from './App.tsx'
//import './index.css'

//createRoot(document.getElementById("root")!).render(<App />);

// src/main.tsx (or src/index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom'; // Assuming you'll use React Router

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap with BrowserRouter if using React Router */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);