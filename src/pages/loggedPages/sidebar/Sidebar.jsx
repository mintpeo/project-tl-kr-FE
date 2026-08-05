import React, {useState} from 'react';
import './Sidebar.css';
import {useLocation, useNavigate} from "react-router-dom";
import {LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";

// import Icons
import {
    RiHome2Line,
    RiBook2Line,
    RiPencilAi2Line,
    RiBarChart2Line,
    RiUser3Line,
    RiSettings3Line,
    RiLogoutCircleRLine
} from "react-icons/ri";

const Sidebar = () => {
    const USER_INFO = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user_info = JSON.parse(USER_INFO);

    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dataPages = [
        {id: 1, name: "Trang chủ", navi: "/home", icon: "RiHome2Line"},
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

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

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

            <div className="sidebar-foot-wrapper" onMouseLeave={() => setIsMenuOpen(false)}>
                {isMenuOpen && (
                    <div className="user-dropdown-menu">
                        <button
                            className="menu-item"
                            onClick={() => navigate("/profile")}
                        >
                            <RiUser3Line size={18} />
                            <span>Thông tin cá nhân</span>
                        </button>

                        <button
                            className="menu-item"
                            // onClick={() => handleNavigate("/settings")}
                        >
                            <RiSettings3Line size={18} />
                            <span>Cài đặt</span>
                        </button>

                        <div className="menu-divider"></div>

                        <button
                            className="menu-item logout"
                            onClick={handleLogout}
                        >
                            <RiLogoutCircleRLine size={18} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                )}

                <div className="sidebar-foot" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className="avatar">{user_info.name.charAt(0)}</div>

                    <div>
                        <div className="name">Trần Quốc Minh</div>
                        <div className="role">Người học</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;