import React, {useState} from 'react';
import {API_URL} from "../../../components/API_URL.jsx";
import './ThemeLS.css'
import '../../../components/loading/BtnSpinner.css';
import {useNavigate} from "react-router-dom";

const SignUp = ({isTabLogin}) => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passAgain, setPassAgain] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (pass !== passAgain) {
            alert("Hai mật khẩu phải trùng nhau!")
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/signUp`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: pass
                }),
            })
            if (!res.ok) {
                setIsLoading(false);
                alert("Email đã tồn tại!");
            }

            const data = await res.json();
            if (data) {
                setIsLoading(false);
                navigate("/verify", {
                    state: { email: email }
                });
            }
        } catch (e) {
            console.log("Error SignUp Auth", e);
        }
    }

    return (
        <form className={`panel-form ${!isTabLogin ? `active` : ``}`}
              onSubmit={handleSignUp}
        >
            <div className="form-head">
                <h2>Tạo tài khoản mới</h2>
                <p>Bắt đầu học Hangul cùng trợ lý AI ngay hôm nay.</p>
            </div>

            <div className="field">
                <label>Họ và tên</label>

                <div className="input-wrap">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/>
                        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
                    </svg>

                    <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Nguyễn Văn A" required/>
                </div>
            </div>

            <div className="field">
                <label>Email</label>

                <div className="input-wrap">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/>
                        <path d="M3 6l9 7 9-7"/>
                    </svg>

                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ban@email.com" required/>
                </div>
            </div>

            <div className="field-row">
                <div className="field">
                    <label>Mật khẩu</label>

                    <div className="input-wrap">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            <path d="M8 11V7a4 4 0 118 0v4"/>
                        </svg>

                        <input onChange={(e) => setPass(e.target.value)} type="password" placeholder="••••••••" required/>
                    </div>
                </div>

                <div className="field">
                    <label>Xác nhận</label>

                    <div className="input-wrap">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            <path d="M8 11V7a4 4 0 118 0v4"/>
                        </svg>

                        <input onChange={(e) => setPassAgain(e.target.value)} type="password" placeholder="••••••••" required/>
                    </div>
                </div>
            </div>

            <div className="row-between" style={{alignItems: 'flex-start'}}>
                <label className="checkbox-row">
                    <input type="checkbox" style={{marginTop: '2px'}} required/>

                    <span className="terms-line">Tôi đồng ý với <span className="link">Điều khoản</span> &amp; <span
                        className="link">Chính sách bảo mật</span></span>
                </label>
            </div>

            <button className={`btn btn-primary ${isLoading ? `gs-btn-loading` : ``}`}
                    type="submit" style={{display: "flex", alignItems: "center", justifyContent: "center"}}
            >
                <span className="gs-btn-spinner"></span>
                <span className="gs-btn-label" style={{marginLeft: '5px'}}>Tạo tài khoản</span>
            </button>

            <div className="divider">HOẶC</div>

            <button className="btn-google">
                <svg viewBox="0 0 48 48">
                    <path fill="#FFC107"
                          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
                    <path fill="#FF3D00"
                          d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"/>
                    <path fill="#4CAF50"
                          d="M24 43.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 34.4 27 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.8 39.1 16.3 43.5 24 43.5z"/>
                    <path fill="#1976D2"
                          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.6l6.5 5.5C41.5 35.8 43.5 30.4 43.5 24c0-1.2-.1-2.4-.3-3.5z"/>
                </svg>
                Đăng ký bằng Google
            </button>

            <p className="switch-line">Đã có tài khoản? <span className="link"
                                                              onClick="switchTab('login')">Đăng nhập</span></p>
        </form>
    );
};

export default SignUp;