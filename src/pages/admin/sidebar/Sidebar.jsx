import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
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
                <div className="nav-group-label">Tổng quan</div>

                <div className="nav">
                    <button className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <path d="M3 11l9-8 9 8"/>
                            <path d="M5 10v10h14V10"/>
                        </svg>

                        Tổng quan
                    </button>
                </div>
            </div>

            <div>
                <div className="nav-group-label">Quản lý</div>

                <div className="nav">
                    <button className="nav-item active">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <path d="M17 20h5v-2a4 4 0 00-3-3.87"/>
                            <path d="M9 20H4v-2a4 4 0 013-3.87"/>
                            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/>
                            <path d="M16 8a4 4 0 010 7.75"/>
                            <path d="M8 8a4 4 0 000 7.75"/>
                        </svg>

                        Tài khoản
                    </button>

                    <button className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/>
                            <path d="M17 3v16"/>
                        </svg>

                        Bài học
                    </button>

                    <button className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <rect x="4" y="4" width="16" height="16" rx="3"/>
                            <path d="M9 9h6v6H9z"/>
                        </svg>

                        Ký tự Hangul
                    </button>

                    <button className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
                        </svg>

                        Chữ mẫu
                    </button>

                    <button className="nav-item">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                            <path d="M4 20V10"/>
                            <path d="M12 20V4"/>
                            <path d="M20 20v-7"/>
                        </svg>

                        Bài luyện tập
                    </button>
                </div>
            </div>

            <div className="sidebar-foot">
                <div className="avatar">TT</div>

                <div>
                    <div className="name">Nguyễn</div>
                    <div className="role">Quản trị viên</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;