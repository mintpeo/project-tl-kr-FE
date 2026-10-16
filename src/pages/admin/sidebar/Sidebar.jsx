import React, {useState} from 'react';
// import './Sidebar.css';

// import Icons
import {
    RiBook2Line,
    RiBarChart2Line,
    RiUser3Line,
    RiBriefcase2Line,
    RiBattery2Line,
    RiDatabase2Line,
    RiLogoutCircleRLine
} from "react-icons/ri";
import { TbAlphabetKorean } from "react-icons/tb";
import {useNavigate} from "react-router-dom";
import {LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import {IoMenu} from "react-icons/io5";

const Sidebar = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState(0);
    const [isMenuContent, setIsMenuContent] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const dataPages = [
        {name: "Tài khoản", navi: "/", icon: "RiUser3Line"},
        {name: "Bài học", navi: "/lesson", icon: "RiBook2Line"},
        {name: "Ký tự tiếng Hàn", navi: "/character", icon: "TbAlphabetKorean"},
        {name: 'Chữ mẫu', navi: "/sample", icon: "RiBattery2Line"},
        {name: "Bài luyện tập", navi: "/exercise", icon: "RiBriefcase2Line"},
        {name: "Thứ tự nét", navi: "/stroke", icon: "RiDatabase2Line"},
        {name: "Theo dõi hoạt động học tập", navi: "/activity", icon: "RiBarChart2Line"},
    ];

    const changeNavi = (navi) => {
        navigate(`/admin${navi}`);
    }

    const ICON_MAP = {
        RiUser3Line: RiUser3Line,
        RiBook2Line: RiBook2Line,
        TbAlphabetKorean: TbAlphabetKorean,
        RiBattery2Line: RiBattery2Line,
        RiBriefcase2Line: RiBriefcase2Line,
        RiDatabase2Line: RiDatabase2Line,
        RiBarChart2Line: RiBarChart2Line,
    };

    return (
        <div id="sidebar">
            <button
                className="btn btn-ghost mobile-toggle-btn"
                onClick={() => setIsMenuContent(prev => !prev)}
            >
                <IoMenu />
            </button>

            {isMenuContent && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsMenuContent(false)}
                />
            )}

            <div className={`menu-content ${isMenuContent ? 'open' : ''}`}>
                <div className="header-sidebar">
                    <div className="brand-sidebar">
                        <div className="brand-mark">글</div>

                        <div>
                            <div className="brand-name">글씨</div>
                            <div className="brand-sub">Bảng quản trị</div>
                        </div>
                    </div>

                    <div className="nav">
                        {dataPages.map((item, index) => {
                            const IconComponent = ICON_MAP[item.icon];

                            return (
                                <button key={index}
                                        className={`nav-item ${selectedPage === index ? `active` : ``}`}
                                        onClick={() => {
                                            changeNavi(`/${item.navi}`);
                                            setSelectedPage(index);
                                        }}>
                                    {IconComponent && <IconComponent size={24} />}
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="sidebar-foot-wrapper">
                    <div className="sidebar-foot-logged" style={{justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <div className="avatar">{user?.email?.charAt(0)}</div>

                            <div>
                                <div className="name">{user?.email}</div>
                                <div className="role">Quản trị viên</div>
                            </div>
                        </div>

                        <div className="logout" onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}><RiLogoutCircleRLine /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;