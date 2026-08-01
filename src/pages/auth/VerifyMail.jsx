import React, {useEffect, useRef, useState} from 'react';
import './VerifyMail.css';
import {useLocation, useNavigate} from "react-router-dom";
import {usePost} from "../../components/usePost.js";
import {API_URL} from "../../components/API_URL.jsx";

const VerifyMail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {executePost} = usePost(`${API_URL}/verify/email`);

    const email = location.state?.email;
    const [timeSendMail, setTimeSendMail] = useState(5);
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timeSendMail <= 0) return;
        const timer = setInterval(() => {
            setTimeSendMail((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeSendMail]);

    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d{4}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setCode(newOtp);
            inputRefs.current[3].focus();
        }
    };

    const verifyEmail = async (e) => {
        e.preventDefault();

        const verifyEmailReq = {
            email: email,
            code: code.join(''),
        }

        try {
            const res = await executePost(verifyEmailReq);
            alert("Success");
        } catch (e) {
            console.log("Error Verify Email", e);
        }
    };

    return (
        <div className="container">
            <form className="auth-card" onSubmit={verifyEmail}>
                <div className="mail-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/>
                        <path d="M3 6l9 7 9-7"/>
                    </svg>
                </div>

                <h1>Xác thực email của bạn</h1>
                <p className="desc">Mình đã gửi mã gồm 4 chữ số đến</p>
                <p className="desc" style={{marginBottom: '2px'}}><span className="email">minh.tran@nlu.edu.vn</span></p>
                <span className="change-email">Nhập sai email? Đổi lại</span>

                <div className="otp-row" id="otpRow" onPaste={handlePaste}>
                    {
                        code.map((digit, index) => (
                            <input
                                key={index}
                                className="otp-box"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="1"
                                data-index={index}
                                value={digit}
                                required
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}/>
                        ))
                    }
                </div>

                <div className="status-line" id="statusLine"></div>

                <button type="submit" className="btn btn-primary" id="verifyBtn" disabled={code.join('').length < 4}>Xác nhận</button>

                <div className="resend-row">
                    Chưa nhận được mã?
                    <span className="resend-link disabled" id="resendLink"> Gửi lại (<span id="countdown">{timeSendMail}</span>s)</span>
                </div>

                <div className="back-link" onClick={() => navigate("/auth")}>
                    <svg viewBox="0 0 24 24">
                        <path d="M19 12H5"/>
                        <path d="M12 19l-7-7 7-7"/>
                    </svg>
                    Quay lại đăng ký
                </div>
            </form>
        </div>
    );
};

export default VerifyMail;