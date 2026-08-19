import React, {useState} from 'react';
import './ForgetPass.css';
import {useNavigate, useSearchParams} from "react-router-dom";
import {usePatch} from "../../../components/use/usePatch.js";
import {API_URL} from "../../../components/API_URL.jsx";

const ResetPass = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const {executePatch: resetPass} = usePatch(`${API_URL}/auth/reset-pass`);

    const step = ['', '', ''];
    const [currentStep, setCurrentStep] = useState(2);
    const [password, setPassword] = useState("");

    const handleResetPass = async (e) => {
        e.preventDefault();

        const resetPassReq = {
            email: email,
            password: password
        }

        try {
            const data = await resetPass(resetPassReq);
            if (data.email) {
                navigate("/auth")
                alert("Đổi mật khẩu thành công.");
            } else alert("Link đã hết hạn.");
        } catch (e) {
            console.log("Error Reset Pass", e);
        }
    }

    return (
        <div className="container">
            <div className="auth-card">
                <div className="stepper" id="stepper">
                    {step.map((item, index) => (
                        <div key={index}
                             className={`step-dot ${currentStep === index ? `current` : ``}`}
                             data-step={index + 1}
                        />
                    ))}
                </div>

                <form onSubmit={handleResetPass} className="step-panel active" id="panelReset">
                    <div className="icon-badge">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            <path d="M8 11V7a4 4 0 118 0v4"/>
                        </svg>
                    </div>

                    <h1>Đặt lại mật khẩu</h1>
                    <p className="desc">Tạo mật khẩu mới cho: <strong>{email}</strong></p>

                    <div className="field">
                        <label>Mật khẩu mới</label>

                        <div className="input-wrap">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                                <path d="M8 11V7a4 4 0 118 0v4"/>
                            </svg>

                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="newPassInput" placeholder="••••••••" required/>

                            <svg className="toggle-eye" viewBox="0 0 24 24">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                    </div>

                    <ul className="rule-list" id="ruleList">
                        <li id="ruleLen">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            Ít nhất 8 ký tự
                        </li>

                        <li id="ruleNum">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            Chứa ít nhất 1 chữ số
                        </li>

                        <li id="ruleCase">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            Chứa chữ hoa và chữ thường
                        </li>
                    </ul>

                    <div className="field">
                        <label>Xác nhận mật khẩu mới</label>

                        <div className="input-wrap">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                                <path d="M8 11V7a4 4 0 118 0v4"/>
                            </svg>

                            <input type="password" id="confirmPassInput" placeholder="••••••••" required/>

                            <svg className="toggle-eye" viewBox="0 0 24 24">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>

                        <div className="field-hint" id="matchHint"></div>
                    </div>

                    <button type="submit" className="btn btn-primary">Đặt lại mật khẩu</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPass;