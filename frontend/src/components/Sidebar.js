import React from 'react';
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <nav className="navbar align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 navbar-dark" style={{ background: "#1f1b24" }}>
      <div className="container-fluid d-flex flex-column p-0">
        <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="#">
          <div className="sidebar-brand-icon rotate-n-15" />
          <div className="sidebar-brand-text mx-3">
            <span>AVIAN</span>
          </div>
        </a>
        <hr className="sidebar-divider my-0" />
        <ul className="navbar-nav text-light" id="accordionSidebar">
          <li className="nav-item">
            <Link className="nav-link active" to="/">
              <i className="fas fa-tachometer-alt" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/cameras">
              <i className="far fa-eye" />
              <span>Cameras</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard/feeds">
              <i className="fas fa-table" />
              <span>Feeds</span>
            </Link>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline" />
      </div>
    </nav>
  );
};

export default Sidebar;