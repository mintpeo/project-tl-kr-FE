import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-row">
                <div className="brand">
                    <div className="brand-mark" style={{width: '26px', height: '26px', fontSize: '13px'}}>글</div>
                    <span style={{fontWeight: '600', color: 'var(--ink)'}}>글씨</span>
                    <span>© 2026</span>
                </div>

                <div className="footer-links">
                    <a href="#">Điều khoản</a>
                    <a href="#">Bảo mật</a>
                    <a href="#">Liên hệ</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;