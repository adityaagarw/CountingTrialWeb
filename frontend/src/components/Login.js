// src/components/Login.js

import React, { useState, useContext  } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = 'http://127.0.0.1:8000';

const Login = () => {
  const { setAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const username = email;
      const response = await axios.post(`${apiBaseUrl}/auth/login`, { username, password });
      console.log(response);
      setAuthStatus(true);
      if (response.data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
      if (error.response && typeof error.response.data.detail === 'string') {
          setErrorMessage(error.response.data.detail);
      } else {
          setErrorMessage('Something went wrong');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card rounded-3 shadow-lg">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>
              {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <p className="mt-3 mb-0 text-center">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;