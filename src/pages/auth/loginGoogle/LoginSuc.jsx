import React, {useEffect, useState} from 'react';
import './LoginSuc.css';
import {useNavigate} from "react-router-dom";
import {LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";

const LoginSuc = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const user = {
        name: data?.fullName,
        email: data?.email,
        isGoogle: data?.google
    }

    useEffect(() => {
        const loadGoogleUser = async () => {
            setLoading(true);

            try {
                const res = await fetch("http://localhost:8080/api/auth/go-info", {
                    credentials: "include",
                });

                const data = await res.json();
                if (data) {
                    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(data));
                    setData(data);
                    setLoading(false);

                    if (data.role === "ADMIN") navigate("/admin");
                }
            } catch (e) {
                console.error("Error Login With Google", e);
            }
        };

        loadGoogleUser();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown === 0) {
            navigate('/home');
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleGoHome = () => {
        navigate('/home');
    };

    const progressPercent = ((10 - countdown) / 10) * 100;

    if (loading) return <Skeleton />

    return (
        <div className="container">
            <div className="auth-card">
                <div className="avatar-wrap">
                    <div className="avatar-lg">{user.name.charAt(0)}</div>

                    <div className="check-badge">
                        <svg viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </div>
                </div>

                <h1>Đăng nhập thành công!</h1>
                <p className="desc">Chào mừng trở lại với 글씨, {user.name} 👋</p>

                <span className="google-chip">
                    <svg viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"/>
                        <path fill="#4CAF50" d="M24 43.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 34.4 27 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.8 39.1 16.3 43.5 24 43.5z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.6l6.5 5.5C41.5 35.8 43.5 30.4 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
                    </svg>
                        Đã xác thực qua Google
                </span>

                <div className="profile-card">
                    <div className="profile-avatar">{user.name.charAt(0)}</div>

                    <div>
                        <div className="profile-name">{user.name}</div>
                        <div className="profile-email">{user.email}</div>
                    </div>
                </div>

                <div className="streak-teaser">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2s6 5.5 6 10.5a6 6 0 01-12 0C6 7.5 12 2 12 2z"/>
                    </svg>

                    <p>Chuỗi <strong>12 ngày</strong> luyện viết của bạn đang chờ được tiếp tục hôm nay.</p>
                </div>

                <div className="progress-track">
                    <div className="progress-fill" id="progressFill" style={{
                        width: `${progressPercent}%`,
                        transition: 'width 1s linear'
                    }}></div>
                </div>

                <p className="redirect-text">Đang chuyển đến trang chủ trong <strong id="countdown">{countdown}</strong>s…</p>

                <button className="btn btn-primary" onClick={handleGoHome}>
                    Vào trang chủ ngay
                    <svg viewBox="0 0 24 24">
                        <path d="M5 12h14"/>
                        <path d="M13 6l6 6-6 6"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LoginSuc;