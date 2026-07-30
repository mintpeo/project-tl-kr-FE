import React from 'react';
import './Sidebar.css';
import {useLocation, useNavigate} from "react-router-dom";

// import Icons
import { RiHome2Line, RiBook2Line, RiPencilAi2Line, RiBarChart2Line } from "react-icons/ri";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dataPages = [
        {id: 1, name: "Trang chủ", navi: "/", icon: "RiHome2Line"},
        {id: 2, name: "Bài học", navi: "/lessons", icon: "RiBook2Line"},
        {id: 3, name: "Luyện viết AI", navi: "/practice", icon: "RiPencilAi2Line"},
        {id: 4, name: "Tiến độ", navi: "/progress", icon: "RiBarChart2Line"},
    ];

    const ICON_MAP = {
        RiHome2Line: RiHome2Line,
        RiBook2Line: RiBook2Line,
        RiPencilAi2Line: RiPencilAi2Line,
        RiBarChart2Line: RiBarChart2Line,
    };

    return (
        <div className="sidebar">
            <div className="brand">
                <div className="brand-mark">글</div>

                <div>
                    <div className="brand-name">글씨</div>
                    <div className="brand-sub">Học chữ Hàn cùng AI</div>
                </div>
            </div>

            <div className="nav">
                {dataPages.map((item) => {
                    const IconComponent = ICON_MAP[item.icon];

                    return (
                        <button key={item.id}
                                className={`nav-item ${location.pathname === item.navi ? `active` : ``}`}
                                onClick={() => navigate(`/${item.navi}`)}>
                            {IconComponent && <IconComponent size={24} />}
                            {item.name}
                        </button>
                    );
                })}
            </div>

            <div className="sidebar-foot">
                <div className="avatar">TM</div>

                <div>
                    <div className="name">Trần Quốc Minh</div>
                    <div className="role">Người học</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;