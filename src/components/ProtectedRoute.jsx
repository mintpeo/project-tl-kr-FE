import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import {LOCAL_STORAGE_KEYS} from "./API_URL.jsx";

const ProtectedRoute = () => {
    const isLogged = !!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);

    // Not Logged -> Go to /lessons -> Back to /auth
    return isLogged ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;