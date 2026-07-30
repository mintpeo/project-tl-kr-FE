import React from 'react';

const Progress = () => {
    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Thống kê học tập</span>
                    <h1>Tiến độ của bạn</h1>
                    <p>Theo dõi quá trình luyện viết và mức độ thành thạo từng chữ.</p>
                </div>
            </div>

            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-num">86%</div>
                    <div className="stat-label">Độ chính xác trung bình</div>
                </div>

                <div className="card stat-card">
                    <div className="stat-num">142</div>
                    <div className="stat-label">Lượt luyện viết</div>
                </div>

                <div className="card stat-card">
                    <div className="stat-num">38</div>
                    <div className="stat-label">Chữ đã thành thạo</div>
                </div>

                <div className="card stat-card">
                    <div className="stat-num">12</div>
                    <div className="stat-label">Ngày liên tiếp</div>
                </div>
            </div>

            <div className="card chart-card">
                <h3 style={{margin: '0 0 2px', fontSize: '15px'}}>Độ chính xác 7 ngày qua</h3>
                <p style={{margin: 0, fontSize: '12px', color: 'var(--ink-soft)'}}>Điểm trung bình do AI đánh giá mỗi ngày</p>
                <div className="bars" id="barsChart"></div>
            </div>

            <div className="card">
                <h3 style={{margin: '0 0 14px', fontSize: '15px'}}>Mức độ thành thạo theo chữ</h3>
                <div className="mastery-grid" id="masteryGrid"></div>
            </div>
        </>
    );
};

export default Progress;