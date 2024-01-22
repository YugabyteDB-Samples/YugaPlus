import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import UserHome from './userHome';
import LoginPage from './login';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => JSON.parse(sessionStorage.getItem('auth')) || false);

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('auth', isAuthenticated);
    }, [isAuthenticated]);

    const setAuth = (auth) => {
        setIsAuthenticated(auth);
        if (auth)
            navigate('/');
        else
            navigate('/login');
    };

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <UserHome setAuth={setAuth} /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setAuth={setAuth} />} />
        </Routes >
    );
}