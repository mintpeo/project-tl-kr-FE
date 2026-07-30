import React from 'react';
import {Outlet} from'react-router-dom';

// import Pages
import Sidebar from "../pages/sidebar/Sidebar.jsx";

const Layout = () => {
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

export default Layout;