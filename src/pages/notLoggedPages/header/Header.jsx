import React from 'react';
import './Header.css';
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="header">
            <div className="nav-row">
                <div className="brand" style={{cursor: "pointer"}} onClick={handleScrollToTop}>
                    <div className="brand-mark">글</div>
                    <span className="brand-name">글씨</span>
                </div>

                <nav className="nav-links">
                    <a href="#features">Tính năng</a>
                    <a href="#how">Cách hoạt động</a>
                    <a href="#">Bảng chữ cái</a>
                    <a href="#">Về chúng tôi</a>
                </nav>

                <div className="nav-actions">
                    <button className="btn btn-ghost" onClick={() => navigate("/auth")}>Đăng nhập</button>
                    <button className="btn btn-primary" onClick={() => navigate("/auth")}>Đăng ký miễn phí</button>
                </div>
            </div>
        </div>
    );
};

export default Header;