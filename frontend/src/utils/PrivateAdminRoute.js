import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

    return isAdmin ? children : <Navigate to="/auth/home" />;
};

export default PrivateAdminRoute;