import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import {LOCAL_STORAGE_KEYS} from "./API_URL.jsx";

const getUserInfoSafe = () => {
    try {
        const item = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Lỗi parse USER_INFO từ localStorage:", error);
        return null;
    }
};

const ProtectedRoute = ({allowedRoles}) => {
    const user_info = getUserInfoSafe();
    const isLogged = !!user_info;
    const role = user_info?.role;

    // Not Logged -> Go to /lessons -> Back to /auth
    if (!isLogged) return <Navigate to="/auth" replace />;

    if (allowedRoles && !allowedRoles.includes(role)) {
        const redirectPath = role === "ADMIN" ? "/admin" : "/home";
        return <Navigate to={redirectPath} replace />
    }
    return <Outlet />
};

export default ProtectedRoute;