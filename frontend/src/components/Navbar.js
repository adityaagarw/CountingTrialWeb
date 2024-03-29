import React from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // Set the local storage isAuthenticated to false
    localStorage.setItem('isAuthenticated', false);
    // Redirect to the login page
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand bg-white shadow mb-4 topbar static-top navbar-light">
      <div className="container-fluid">
        <ul className="navbar-nav flex-nowrap ms-auto">
          <li className="nav-item dropdown d-sm-none no-arrow">
            <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
              <i className="fas fa-search" />
            </a>
            <div className="dropdown-menu dropdown-menu-end p-3 animated--grow-in" aria-labelledby="searchDropdown">
              <form className="me-auto navbar-search w-100">
                <div className="input-group">
                  <input className="bg-light form-control border-0 small" type="text" placeholder="Search for ..." />
                  <div className="input-group-append">
                    <button className="btn btn-primary py-0" type="button">
                      <i className="fas fa-search" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          <div className="d-none d-sm-block topbar-divider" />
          <li className="nav-item dropdown no-arrow">
            <div className="nav-item dropdown no-arrow">
              <a className="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#">
                <span className="d-none d-lg-inline me-2 text-gray-600 small">Admin</span>
                <i className="far fa-user" style={{fontSize: 23}} />
              </a>
              <div className="dropdown-menu shadow dropdown-menu-end animated--grow-in">
                <a className="dropdown-item" href="#">
                  <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400" />&nbsp;Profile
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fas fa-cogs fa-sm fa-fw me-2 text-gray-400" />&nbsp;Settings 
                </a>
                <a className="dropdown-item" href="#">
                  <i className="fas fa-list fa-sm fa-fw me-2 text-gray-400" />&nbsp;Activity log
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400" />&nbsp;Logout   
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;