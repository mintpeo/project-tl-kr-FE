import React from 'react';
import './HowIW.css';

const HowIw = () => {
    return (
        <div className="steps-section" id="how">
            <div className="section" style={{padding: '70px 40px'}}>
                <div className="section-head">
                    <span className="eyebrow-pill">Quy trình đơn giản</span>
                    <h2>Chỉ 3 bước để bắt đầu luyện viết</h2>
                </div>

                <div className="steps-grid">
                    <div className="step">
                        <div className="step-connector"></div>
                        <div className="step-num">1</div>
                        <h4>Chọn bài học</h4>
                        <p>Bắt đầu với nguyên âm, phụ âm cơ bản hoặc âm tiết ghép tùy theo trình độ của bạn.</p>
                    </div>

                    <div className="step">
                        <div className="step-connector"></div>
                        <div className="step-num">2</div>
                        <h4>Luyện viết theo mẫu</h4>
                        <p>Viết đè lên chữ mẫu trên vùng tương tác, theo đúng thứ tự nét được hướng dẫn.</p>
                    </div>

                    <div className="step">
                        <div className="step-num">3</div>
                        <h4>Nhận đánh giá từ AI</h4>
                        <p>Xem điểm số tương đồng và phản hồi chi tiết để cải thiện ở lần luyện tiếp theo.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowIw;