import React from 'react';
import './Features.css';

const Features = () => {
    return (
        <div className="section" id="features">
            <div className="section-head">
                <span className="eyebrow-pill">Tính năng nổi bật</span>
                <h2>Mọi thứ bạn cần để bắt đầu viết chữ Hàn</h2>
                <p>Từ những nét cơ bản đến ghép âm tiết hoàn chỉnh, được cá nhân hóa theo tiến độ học của riêng bạn.</p>
            </div>

            <div className="feature-grid">
                <div className="feature-card">
                    <div className="feature-icon fi-celadon">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/>
                            <path d="M17 3v16"/>
                        </svg>
                    </div>

                    <h3>Bài học có lộ trình rõ ràng</h3>
                    <p>Bắt đầu từ nguyên âm, phụ âm cơ bản, đến ghép âm tiết — được sắp xếp theo đúng thứ tự phù hợp với
                        người mới học.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon fi-gold">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
                        </svg>
                    </div>

                    <h3>Luyện viết tương tác</h3>
                    <p>Viết đè lên chữ mẫu ngay trên màn hình, xem hướng dẫn thứ tự nét và luyện tập không giới hạn.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon fi-plum">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"/>
                            <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2 1.7-2 3.3M12 17h.01"/>
                        </svg>
                    </div>

                    <h3>AI chấm điểm tức thì</h3>
                    <p>So sánh chữ viết của bạn với chữ mẫu, đưa ra điểm số tương đồng và gợi ý cải thiện chi tiết theo
                        từng nét.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon fi-celadon">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 20V10"/>
                            <path d="M12 20V4"/>
                            <path d="M20 20v-7"/>
                        </svg>
                    </div>

                    <h3>Theo dõi tiến độ</h3>
                    <p>Xem lịch sử luyện viết, mức độ thành thạo từng chữ và chuỗi ngày học liên tiếp để duy trì động
                        lực.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon fi-gold">
                        <svg viewBox="0 0 24 24">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.7 21a2 2 0 01-3.4 0"/>
                        </svg>
                    </div>

                    <h3>Nhắc học mỗi ngày</h3>
                    <p>Thông báo nhẹ nhàng giúp bạn duy trì thói quen luyện viết đều đặn, không bỏ lỡ mục tiêu hằng
                        ngày.</p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon fi-plum">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/>
                            <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
                        </svg>
                    </div>

                    <h3>Học mọi lúc, mọi nơi</h3>
                    <p>Giao diện tương thích trên máy tính lẫn điện thoại, đồng bộ tiến độ học tập trên mọi thiết
                        bị.</p>
                </div>
            </div>
        </div>
    );
};

export default Features;