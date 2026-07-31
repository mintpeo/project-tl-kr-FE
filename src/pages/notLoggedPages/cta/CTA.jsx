import React from 'react';
import './CTA.css';
import {useNavigate} from "react-router-dom";

const Cta = () => {
    const navigate = useNavigate();

    return (
        <div className="cta-section">
            <div className="cta-card">
                <span className="ghost-char">한</span>
                <h2>Sẵn sàng bắt đầu hành trình học tiếng Hàn?</h2>
                <p>Tạo tài khoản miễn phí và luyện viết chữ Hangul đầu tiên của bạn ngay hôm nay.</p>

                <div className="cta-actions">
                    <button className="btn btn-light" onClick={() => navigate("/auth")}>Đăng ký miễn phí</button>
                    <button className="btn" style={{background: 'rgba(255,255,255,0.14)', color: '#fff'}}>Tìm hiểu thêm</button>
                </div>
            </div>
        </div>
    );
};

export default Cta;