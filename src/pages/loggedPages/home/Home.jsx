import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Chào mừng trở lại</span>
                    <h1>안녕하세요, Minh 👋</h1>
                    <p>Hôm nay là ngày tốt để luyện thêm vài nét chữ.</p>
                </div>
            </div>

            <div className="home-grid">
                <div className="hero-card">
                    <span className="hero-char">한</span>
                    <h2>Luyện viết chữ hôm nay</h2>
                    <p>Viết theo chữ mẫu và để AI chấm điểm độ chính xác từng nét trong vài giây.</p>
                    <button className="btn btn-light">Bắt đầu luyện viết →</button>
                </div>

                <div className="card streak-card">
                    <div className="streak-row">
                        <div className="ring" style={{background: 'var(--gold)'}}></div>

                        <div>
                            <div className="streak-num">12 <span style={{fontSize: '15px'}}>ngày</span></div>
                            <div className="streak-label">Chuỗi ngày học liên tiếp</div>
                        </div>
                    </div>

                    <div>
                        <div
                            className="streak-target">
                            <span>Mục tiêu hôm nay</span><span className="mono">7/10 chữ</span>
                        </div>

                        <div className="goal-track">
                            <div className="goal-fill" style={{width: '70%'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-title">
                <h3>Tiếp tục bài học</h3>
                <span className="link-mini">Xem tất cả</span>
            </div>

            <div className="lesson-row">
                <div className="card lesson-card">
                    <div className="lesson-glyph">ㅏ</div>
                    <h4>Nguyên âm cơ bản</h4>
                    <p>10 nguyên âm đơn trong bảng Hangul</p>
                    <div className="goal-track">
                        <div className="goal-fill" style={{width: '80%'}}></div>
                    </div>
                </div>

                <div className="card lesson-card">
                    <div className="lesson-glyph">ㄱ</div>
                    <h4>Phụ âm cơ bản</h4>
                    <p>14 phụ âm đơn và cách phát âm</p>
                    <div className="goal-track">
                        <div className="goal-fill" style={{width: '45%'}}></div>
                    </div>
                </div>

                <div className="card lesson-card">
                    <div className="lesson-glyph">가</div>
                    <h4>Ghép âm tiết</h4>
                    <p>Kết hợp phụ âm và nguyên âm thành chữ</p>
                    <div className="goal-track">
                        <div className="goal-fill" style={{width: '20%'}}></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;