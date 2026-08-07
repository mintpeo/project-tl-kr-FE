import React, {useState} from 'react';
import './ForgetPass.css';
import {useNavigate} from "react-router-dom";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";
import BtnSpinner from "../../../components/loading/BtnSpinner.jsx";

const ForgetPass = () => {
    const navigate = useNavigate();
    const {executePost: sendResetPass} = usePost(`${API_URL}/verify/send-reset-pass`);

    const step = ['', '', ''];
    // 0: input email, 1: noise success send reset pass
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendResetPassEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const send = {
            email: email
        }

        try {
            const data = await sendResetPass(send);
            if (data) setCurrentStep(1);
            else alert("Email không tồn tại. Vui lòng kiểm tra lại!")
            setIsLoading(false);
        } catch (e) {
            console.log("Error Send Reset Pass", e);
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

                {/* EMAIL */}
                <form onSubmit={sendResetPassEmail} className={`step-panel ${currentStep === 0 ? `active` : ``}`} id="panelEmail">
                    <div className="icon-badge">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            <path d="M8 11V7a4 4 0 118 0v4"/>
                        </svg>
                    </div>

                    <h1>Quên mật khẩu?</h1>
                    <p className="desc">Nhập email đã đăng ký, mình sẽ gửi một đường <strong>Link</strong> để đặt lại mật khẩu.</p>

                    <div className="field">
                        <label>Email</label>

                        <div className="input-wrap">
                            <svg viewBox="0 0 24 24">
                                <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/>
                                <path d="M3 6l9 7 9-7"/>
                            </svg>

                            <input type="email" id="emailInput" onChange={(e) => setEmail(e.target.value)} placeholder="ban@email.com" required/>
                        </div>

                        <div className="field-hint" id="emailHint">Dùng email bạn đã đăng ký với 글씨.</div>
                    </div>

                    <BtnSpinner text={`Gửi mã xác thực`} isLoading={isLoading} />

                    <div className="back-link" onClick={() => navigate("/auth")}>
                        <svg viewBox="0 0 24 24">
                            <path d="M19 12H5"/>
                            <path d="M12 19l-7-7 7-7"/>
                        </svg>

                        Quay lại đăng nhập
                    </div>
                </form>

                {/* Send Link */}
                <div className={`step-panel ${currentStep === 1 ? `active` : ``}`} id="panelOtp">
                    <div className="icon-badge">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/>
                            <path d="M3 6l9 7 9-7"/>
                        </svg>
                    </div>

                    <h1>Nhập mã xác thực</h1>

                    <div className="desc" style={{marginBottom: 0}}>
                        <p>Đã gửi đường link để đặt lại mật khẩu đến</p>
                        <p className="email" id="emailDisplay">{email}</p>
                    </div>

                    {/*<div className="back-link" style={{marginTop: 0}} onClick={() => setCurrentStep(0)}>*/}
                    {/*    <svg viewBox="0 0 24 24">*/}
                    {/*        <path d="M19 12H5"/>*/}
                    {/*        <path d="M12 19l-7-7 7-7"/>*/}
                    {/*    </svg>*/}

                    {/*    Quay lại*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
};
export default ForgetPass;