import React, {useState} from 'react';
import './Sidebar.css';

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

const Sidebar = () => {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState(0);

    const dataPages = [
        {name: "Tài khoản", navi: "/", icon: "RiUser3Line"},
        {name: "Bài học", navi: "/lesson", icon: "RiBook2Line"},
        {name: "Ký tự tiếng Hàn", navi: "/character", icon: "TbAlphabetKorean"},
        {name: 'Chữ mẫu', navi: "/sample", icon: "RiBattery2Line"},
        {name: "Bài luyện tập", navi: "/exercise", icon: "RiBriefcase2Line"},
        {name: "Thứ tự nét", navi: "/progress", icon: "RiDatabase2Line"},
        {name: "Theo dõi hoạt động học tập", navi: "/progress", icon: "RiBarChart2Line"},
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
        <div className="sidebar">
            <div className="brand">
                <div className="brand-mark">글</div>

                <div>
                    <div className="brand-name">글씨</div>
                    <div className="brand-sub">Bảng quản trị</div>
                </div>
            </div>

            <div>
                <div className="nav-group-label">Quản lý</div>

                <div className="nav">
                    {
                        dataPages.map((item, index) => {
                            const IconComponent = ICON_MAP[item.icon];

                            return (
                                <button key={index} className={`nav-item ${selectedPage === index ? `active` : ``}`} onClick={() => {
                                    setSelectedPage(index);
                                    changeNavi(item.navi);
                                }}>
                                    {IconComponent && <IconComponent size={24} />}
                                    {item.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>

            <div className="sidebar-foot">
                <div style={{display: 'flex', gap: '10px'}}>
                    <div className="avatar">TT</div>

                    <div>
                        <div className="name">Nguyễn</div>
                        <div className="role">Quản trị viên</div>
                    </div>
                </div>

                <div className="logout" onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                }}><RiLogoutCircleRLine /></div>
            </div>
        </div>
    );
};

export default Sidebar;