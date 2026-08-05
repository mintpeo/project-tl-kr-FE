import React from 'react';
import './Profile.css';
import {LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";

const Profile = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    return (
        <div className="profile">
            <div className="page-head">
                <h1>Tài khoản của tôi</h1>
                <p>Quản lý thông tin cá nhân, mật khẩu và tùy chọn của bạn.</p>
            </div>

            {/* Info */}
            <div className="card">
                <div className="card-head">
                    <h3>Thông tin cá nhân</h3>
                    <p>Thông tin này sẽ hiển thị trên hồ sơ học tập của bạn.</p>
                </div>

                <div className="avatar-row">
                    <div className="avatar-lg">{user?.name.charAt(0)}</div>

                    <div className="avatar-actions">
                        <button className="btn btn-ghost">Đổi ảnh đại diện</button>
                        <button className="btn btn-ghost">Xóa ảnh</button>
                    </div>
                </div>

                <div className="field-grid">
                    <div className="field">
                        <label>Họ và tên</label>
                        <input type="text" value={user?.name} />
                    </div>

                    <div className="field">
                        <label>Vai trò</label>
                        <input type="text" value="Người học" disabled/>
                    </div>

                    <div className="field full">
                        <label>Email</label>
                        <input type="email" value={user?.email} disabled />
                        <div className="field-hint">Email dùng để đăng nhập, không thể thay đổi trực tiếp — liên hệ hỗ trợ nếu cần.</div>
                    </div>
                </div>

                <div className="card-actions">
                    <button className="btn btn-ghost">Hủy</button>
                    <button className="btn btn-primary">Lưu thay đổi</button>
                </div>
            </div>

            {/* Password */}
            <div className="card">
                <div className="card-head">
                    <h3>Đổi mật khẩu</h3>
                    <p>Nên dùng mật khẩu mạnh và không trùng với các tài khoản khác.</p>
                </div>

                <div className="field full">
                    <label>Mật khẩu hiện tại</label>
                    <input type="password" placeholder="••••••••" />
                </div>

                <div className="field-grid">
                    <div className="field">
                        <label>Mật khẩu mới</label>
                        <input type="password" placeholder="••••••••" />
                    </div>

                    <div className="field">
                        <label>Xác nhận mật khẩu mới</label>
                        <input type="password" placeholder="••••••••" />
                    </div>
                </div>

                <div className="card-actions">
                    <button className="btn btn-primary">Cập nhật mật khẩu</button>
                </div>
            </div>

            {/* Link Google */}
            <div className="card">
                <div className="card-head">
                    <h3>Liên kết tài khoản</h3>
                    <p>Đăng nhập nhanh hơn bằng các tài khoản đã liên kết.</p>
                </div>

                <div className="connect-row">
                    <div className="connect-left">
                        <div className="provider-icon">
                            <svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5c-7.6 0-14.1 4.3-17.7 10.2z"/><path fill="#4CAF50" d="M24 43.5c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5C29.6 34.4 27 35.5 24 35.5c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.8 39.1 16.3 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.2 5.6l6.5 5.5C41.5 35.8 43.5 30.4 43.5 24c0-1.2-.1-2.4-.3-3.5z"/></svg>
                        </div>

                        <div>
                            <div className="connect-name">Google</div>
                            <div className="connect-sub">minh.tran@gmail.com</div>
                        </div>
                    </div>

                    <span className="badge-connected">Đã liên kết</span>
                </div>
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

            {/* Danger */}
            <div className="card danger-card">
                <div className="card-head">
                    <h3>Xóa tài khoản</h3>
                </div>

                <div className="danger-row">
                    <p>Toàn bộ tiến độ học tập, lịch sử luyện viết và dữ liệu cá nhân sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.</p>
                    <button className="btn btn-danger-outline">Xóa tài khoản</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;