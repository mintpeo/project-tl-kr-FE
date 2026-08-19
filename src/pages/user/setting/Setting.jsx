import React from 'react';
import '../profile/Profile.css';

const Setting = () => {
    return (
        <div className="profile">
            <div className="page-head">
                <h1>Thông báo</h1>
                <p>Quản lý các thông báo.</p>
            </div>

            {/* Noise */}
            <div className="card">
                <div className="card-head">
                    <h3>Tùy chọn thông báo</h3>
                    <p>Chọn cách bạn muốn nhận nhắc nhở từ 글씨.</p>
                </div>

                <div className="toggle-row">
                    <div className="toggle-text"><p>Nhắc học hằng ngày</p><span>Gửi thông báo lúc 20:00 mỗi ngày</span></div>
                    <div className="switch on"><div className="knob"></div></div>
                </div>

                <div className="toggle-row">
                    <div className="toggle-text"><p>Email tổng kết tuần</p><span>Báo cáo tiến độ luyện viết mỗi Chủ nhật</span></div>
                    <div className="switch on"><div className="knob"></div></div>
                </div>

                <div className="toggle-row">
                    <div className="toggle-text"><p>Thông báo tính năng mới</p><span>Cập nhật về bài học và tính năng AI</span></div>
                    <div className="switch"><div className="knob"></div></div>
                </div>
            </div>
        </div>
    );
};

export default Setting;