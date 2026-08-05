import React, {useState} from 'react';
import {API_URL} from "../../../components/API_URL.jsx";
import './ThemeLS.css'
import {useNavigate} from "react-router-dom";
import BtnSpinner from "../../../components/loading/BtnSpinner.jsx";

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

            <BtnSpinner text={`Đăng ký`} isLoading={isLoading} />
            <p className="switch-line">Đã có tài khoản? <span className="link">Đăng nhập</span></p>
        </form>
    );
};

export default SignUp;