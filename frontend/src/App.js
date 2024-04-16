import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SignupForm from './components/SignupForm';
import CameraContent from './components/CameraContent';
import RegionSelectorPage from './components/RegionSelectorPage';
import ApexDashboardAnalytics from './components/ApexDashboardAnalytics';
import FeedContentLiveTest from './components/FeedContentLiveTest';

// Create a context to manage authentication status
export const AuthContext = React.createContext();

function App() {
  // State to store authentication status
  const storedAuthStatus = localStorage.getItem('isAuthenticated');

  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus === 'true');

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
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
            <Route path="cameras" element={<CameraContent />} />
            <Route path="feeds" element={<FeedContentLiveTest />} />
            <Route path="" element={<ApexDashboardAnalytics />} />
          </Route>
          {/* Add more routes here */}
          <Route path="/region-selector/:feedId" element={<RegionSelectorPage />} />
        </Routes>
      </AuthContext.Provider>
    </HashRouter>
  );
}

export default App;