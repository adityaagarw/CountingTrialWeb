import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../assets/bootstrap/css/bootstrap.min.css';
import '../assets/fonts/fontawesome-all.min.css';
import '../assets/bootstrap/js/bootstrap.min.js';
import '../assets/js/chart.min.js';
import '../assets/js/theme.js';
import '../assets/js/bs-init.js';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
      <title>Avian</title>
      <link rel="stylesheet" type="text/html" href="../assets/bootstrap/css/bootstrap.min.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
      />
      <link rel="stylesheet" type="text/html" href="../assets/fonts/fontawesome-all.min.css" />
      <div id="wrapper">
        <Sidebar onNavigation={handleNavigation} />
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content">
            <Navbar />
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;