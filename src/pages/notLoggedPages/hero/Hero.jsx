import React from 'react';
import './Hero.css';

import { BsLightningCharge } from "react-icons/bs";

const Hero = () => {
    return (
        <>
            <div className="hero" id="hero">
                <div className="hero-grid">

                    <div>
                        <span className="eyebrow-pill">
                            <i className="icon"><BsLightningCharge /></i>
                            Được hỗ trợ bởi AI
                        </span>
                        <h1>Học viết chữ Hangul, <span className="accent">được AI chấm điểm</span> ngay tức thì.</h1>
                        <p className="lead">Nền tảng học tiếng Hàn trực tuyến dành cho người mới bắt đầu — luyện viết trên
                            giao diện tương tác và nhận phản hồi chi tiết về từng nét chữ chỉ trong vài giây.</p>

                        <div className="hero-actions">
                            <button className="btn btn-primary">Bắt đầu miễn phí →</button>
                            <button className="btn btn-ghost">Xem cách hoạt động</button>
                        </div>

                        <div className="trust-row">
                            <div className="avatar-stack">
                                <span style={{background: 'var(--celadon)'}}>MH</span>
                                <span style={{background: 'var(--plum)'}}>TL</span>
                                <span style={{background: 'var(--gold)'}}>KV</span>
                            </div>

                            Hơn 500 người học đang luyện viết mỗi ngày
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="floating-streak">
                            <div className="dot"></div>
                            <span>12 ngày liên tiếp 🔥</span>
                        </div>

                        <div className="hero-card">
                            <div className="hero-card-top">
                                <p>Chữ đang luyện</p>
                                <span className="char-badge">한 · HAN</span>
                            </div>

                            <div className="hero-canvas">
                                <span className="ghost">한</span>

                                <svg className="stroke-demo" viewBox="0 0 200 200">
                                    <path d="M55 60 L55 150" stroke="#232823" strokeWidth="7" strokeLinecap="round"
                                          fill="none"/>
                                    <path d="M55 95 L110 95" stroke="#232823" strokeWidth="7" strokeLinecap="round"
                                          fill="none"/>
                                    <path d="M110 60 L110 150" stroke="#232823" strokeWidth="7" strokeLinecap="round"
                                          fill="none"/>
                                </svg>
                            </div>
                        </div>

                        <div className="floating-score">
                            <div className="num">92%</div>
                            <div className="lbl">Độ tương đồng</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-strip">
                <div className="stats-row">
                    <div className="stat-block">
                        <div className="num">500+</div>
                        <div className="lbl">Người học</div>
                    </div>

                    <div className="stat-block">
                        <div className="num">40</div>
                        <div className="lbl">Ký tự Hangul</div>
                    </div>

                    <div className="stat-block">
                        <div className="num">98%</div>
                        <div className="lbl">Hài lòng với phản hồi AI</div>
                    </div>

                    <div className="stat-block">
                        <div className="num">15K+</div>
                        <div className="lbl">Lượt luyện viết</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;