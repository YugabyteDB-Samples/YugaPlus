import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import UserHome from './userHome';
import LoginPage from './login';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => JSON.parse(localStorage.getItem('auth'))
            ||
            false);

    useEffect(() => {
        localStorage.setItem('auth', isAuthenticated);
        console.log('useEffect: ' + isAuthenticated);
    }, [isAuthenticated]);

    const setAuth = (auth) => {
        console.log('setAuth: ' + auth);
        setIsAuthenticated(auth);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <UserHome /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
            </Routes>
        </Router>
    );
}