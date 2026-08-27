import React from 'react';
import {Outlet} from 'react-router-dom';

// import Pages
import Sidebar from "../pages/admin/sidebar/Sidebar.jsx";

const LayoutAdmin = () => {
    return (
        <div className="app">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="main">
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutAdmin;