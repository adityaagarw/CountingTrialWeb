// frontend/src/components/Dashboard.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  // Simulate user role (replace with actual logic)
  const isAdmin = false; // Change to true if the user is an admin

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/feeds" className={`nav-link ${location.pathname === '/dashboard/feeds' ? 'active' : ''}`}>
                  Feeds
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/analytics" className={`nav-link ${location.pathname === '/dashboard/analytics' ? 'active' : ''}`}>
                  Analytics
                </Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link to="/dashboard/admin-panel" className={`nav-link ${location.pathname === '/dashboard/admin-panel' ? 'active' : ''}`}>
                    Admin Panel
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
          </div>
          
          {/* Add your dashboard content here */}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;