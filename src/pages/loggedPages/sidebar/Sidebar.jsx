import React, {useEffect, useState} from 'react';
import './Sidebar.css';
import {useLocation, useNavigate} from "react-router-dom";
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";

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
import { TbAlphabetKorean } from "react-icons/tb";
import { RxLetterCaseToggle } from "react-icons/rx";
import { PiRoadHorizonBold } from "react-icons/pi";

const Sidebar = () => {
    const USER_INFO = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user_info = JSON.parse(USER_INFO);

    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {executePost: getInfoUser} = usePost(`${API_URL}/user/me`);

    const dataPages = [
        {name: "Trang chủ", navi: "/home", icon: "RiHome2Line"},
        {name: "Lộ trình học", navi: "/road", icon: "PiRoadHorizonBold"},
        {name: "Bài học khác", navi: "/lessons/1", icon: "RiBook2Line"},
        // {name: "Thứ tự các nét", navi: "/strokes", icon: "TbAlphabetKorean"},
        // {name: 'Cách ghép chữ', navi: "/combine", icon: "TbAlphabetKorean"},
        {name: "Luyện viết AI", navi: "/practice", icon: "RiPencilAi2Line"},
        {name: "Tiến độ", navi: "/progress", icon: "RiBarChart2Line"},
    ];

    const ICON_MAP = {
        RiHome2Line: RiHome2Line,
        PiRoadHorizonBold: PiRoadHorizonBold,
        RiBook2Line: RiBook2Line,
        // TbAlphabetKorean: TbAlphabetKorean,
        TbAlphabetKorean: TbAlphabetKorean,
        RiPencilAi2Line: RiPencilAi2Line,
        RiBarChart2Line: RiBarChart2Line,
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handleResetInfoUser = async () => {
        const userReq = {
            email: user_info.email
        }

        try {
            const data = await getInfoUser(userReq);
            if (data) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(data));
            }
        } catch (e) {
            console.log("Error Reset Info User", e);
        }
    }

    useEffect(() => {
        handleResetInfoUser();
    }, [])

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
                {dataPages.map((item, index) => {
                    const IconComponent = ICON_MAP[item.icon];

                    return (
                        <button key={index}
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
                            onClick={() => navigate("/setting")}
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
                    <div className="avatar">{user_info.fullName.charAt(0)}</div>

                    <div>
                        <div className="name">{user_info.fullName}</div>
                        <div className="role">Người học</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;