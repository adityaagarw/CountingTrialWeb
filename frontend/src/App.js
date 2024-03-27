import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SignupForm from './components/SignupForm';

// Create a context to manage authentication status
export const AuthContext = React.createContext();

function App() {
  // State to store authentication status
  const storedAuthStatus = localStorage.getItem('isAuthenticated');

  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus === 'true');
  // Check authentication status on component mount
  // useEffect(() => {
  //   const storedAuthStatus = localStorage.getItem('isAuthenticated');
  //   setIsAuthenticated(storedAuthStatus === 'true');
  // }, []);

  // Function to set authentication status
  const setAuthStatus = (status) => {
    setIsAuthenticated(status);
    // Persist authentication status to localStorage
    localStorage.setItem('isAuthenticated', status);
  };

  return (
    <HashRouter>
      <AuthContext.Provider value={{ isAuthenticated, setAuthStatus }}>
        <Routes>
         {/* Initial route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

          {/* Route to login page */}
          <Route path="/login" element={<Login />} />
          {/* Route to signup page */}
          <Route path="/signup" element={<SignupForm />} />
          {/* Protected route to dashboard page */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          {/* Add more routes here */}
        </Routes>
      </AuthContext.Provider>
    </HashRouter>
  );
}

export default App;