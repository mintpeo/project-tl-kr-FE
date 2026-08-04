import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import './Auth.css';

// import Pages
import Login from "./loginSign/Login.jsx";
import SignUp from "./loginSign/SignUp.jsx";

// import Icons
import { RiBook2Line, RiPencilAi2Line, RiBarChart2Line } from "react-icons/ri";

const Auth = () => {
    const navigate = useNavigate();
    const [isTabLogin, setIsTabLogin] = useState(true);

    return (
        <div className="auth-shell">
            {/* Left Brand Panel */}
            <div className="brand-panel">
                <span className="ghost-char">한</span>

                <div className="brand-mark-row" style={{cursor: "pointer"}} onClick={() => navigate("/")}>
                    <div className="brand-mark">글</div>

                    <div>
                        <div className="brand-name">글씨</div>
                        <div className="brand-sub">Học chữ Hàn cùng AI</div>
                    </div>
                </div>

                <div className="brand-copy">
                    <h1>Luyện viết Hangul, được AI chấm điểm ngay lập tức.</h1>
                    <p>Nền tảng học tiếng Hàn trực tuyến giúp bạn làm chủ bảng chữ cái Hangul thông qua thực hành viết
                        tay và phản hồi trực quan từ trí tuệ nhân tạo.</p>
                </div>

                <div className="feature-list">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <RiPencilAi2Line size={15}/>
                        </div>
                        AI phân tích và chấm điểm từng nét chữ
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">
                            <RiBook2Line size={15}/>
                        </div>
                        Bài học từ nguyên âm, phụ âm đến ghép âm tiết
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">
                            <RiBarChart2Line size={15}/>
                        </div>
                        Theo dõi tiến độ và mức độ thành thạo theo thời gian
                    </div>
                </div>
            </div>

            {/* Right Brand Panel */}
            <div className="form-panel">
                <div className="form-card">

                    <div className="auth-toggle">
                        <button className={`${isTabLogin ? `active` : ``}`} onClick={() => setIsTabLogin(true)}>Đăng nhập</button>
                        <button className={`${!isTabLogin ? `active` : ``}`} onClick={() => setIsTabLogin(false)}>Đăng ký</button>
                    </div>

                    {/* Login */}
                    <Login isTabLogin={isTabLogin} />
                    <SignUp isTabLogin={isTabLogin} />
                </div>
            </div>
        </div>
    );
};
export default Auth;