import React from 'react';
import './Admin.css';
import Sidebar from "./sidebar/Sidebar.jsx";
import Main from "./main/Main.jsx";

const Admin = () => {
    return (
        <div className="app">
            <Sidebar />

            <Main />
        </div>
    );
};

export default Admin;