import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-col brand-col">
                        <div className="brand">
                            <div className="brand-mark">글</div>
                            <span className="brand-name">글씨</span>
                        </div>

                        <p className="brand-desc">
                            Nền tảng học tiếng Hàn trực tuyến tích hợp công nghệ AI, hỗ trợ nhận diện nét viết Hangul và phản hồi chi tiết theo thời gian thực.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Học tập</h4>
                        <ul className="footer-nav">
                            <li><a href="#alphabet">Bảng chữ cái Hangul</a></li>
                            <li><a href="#stroke-practice">Luyện nét chữ AI</a></li>
                            <li><a href="#vocabulary">Từ vựng & Mẫu câu</a></li>
                            <li><a href="#progress">Tiến độ cá nhân</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Hỗ trợ</h4>
                        <ul className="footer-nav">
                            <li><a href="#faq">Câu hỏi thường gặp</a></li>
                            <li><a href="#guide">Hướng dẫn luyện viết</a></li>
                            <li><a href="#feedback">Góp ý hệ thống</a></li>
                            <li><a href="#contact">Liên hệ</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Liên hệ</h4>
                        <p className="contact-info">Email: support@geulssi.vn</p>
                        <p className="contact-info">Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        © 2026 글씨
                    </p>

                    <div className="footer-legal">
                        <a href="#terms">Điều khoản sử dụng</a>
                        <span className="dot-divider">•</span>
                        <a href="#privacy">Chính sách bảo mật</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;