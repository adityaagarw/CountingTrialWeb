// frontend/src/components/SignupForm.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = 'http://127.0.0.1:8000';

const SignupForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                return;
            }
            // Check if password meets strength requirements (example: at least 8 characters)
            if (password.length < 8) {
                setErrorMessage('Password should be at least 8 characters long');
                return;
            }
            const username = email;
            // Check if isAdmin checkbox is ticked
            const isAdmin = document.getElementById('isAdmin').checked;
            const response = await axios.post(`${apiBaseUrl}/signup`, { username, password, isAdmin: isAdmin});
            console.log(response)
            setErrorMessage('');
            setSuccessMessage('Account created successfully. Redirecting to Login.');
            // Redirect to login page
            setTimeout(() => {
                // Redirect to login page
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Check if error detail is a string
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
                            <h2 className="text-center mb-4">Sign Up</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div style={{ position: 'relative' }}>
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        <div style={{ position: 'absolute', right: 0, top: 0 }}>
                                            <label htmlFor="isAdmin" className="form-check-label me-2">
                                            Admin
                                            </label>
                                            <input className="form-check-input" type="checkbox" id="isAdmin" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                                {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                            </form>
                            <p className="mt-3 mb-0 text-center">Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;