import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PRIVATE ROUTE COMPONENT
 * Protects routes that require authentication
 */

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
