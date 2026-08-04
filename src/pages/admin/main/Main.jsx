import React from 'react';
import './Main.css';

const Main = () => {
    return (
        <div className="main">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý tài khoản</h1>
                    <p>Danh sách toàn bộ tài khoản người học và quản trị viên trong hệ thống.</p>
                </div>

                <button className="btn btn-primary" onClick="alert('Mở form thêm tài khoản mới')">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>

                    Thêm tài khoản
                </button>
            </div>

            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-icon total">
                        <svg viewBox="0 0 24 24">
                            <path d="M17 20h5v-2a4 4 0 00-3-3.87"/>
                            <path d="M9 20H4v-2a4 4 0 013-3.87"/>
                            <path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/>
                        </svg>
                    </div>

                    <div>
                        <div className="stat-num">248</div>
                        <div className="stat-label">Tổng số tài khoản</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon active">
                        <svg viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                    </div>

                    <div>
                        <div className="stat-num">231</div>
                        <div className="stat-label">Đang hoạt động</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon locked">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                            <path d="M8 11V7a4 4 0 118 0v4"/>
                        </svg>
                    </div>

                    <div>
                        <div className="stat-num">17</div>
                        <div className="stat-label">Đã khóa</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon new">
                        <svg viewBox="0 0 24 24">
                            <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z"/>
                        </svg>
                    </div>

                    <div>
                        <div className="stat-num">12</div>
                        <div className="stat-label">Mới trong tuần</div>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7"/>
                        <path d="M21 21l-4.3-4.3"/>
                    </svg>

                    <input type="text" id="searchInput" placeholder="Tìm theo tên hoặc email..."/>
                </div>

                <select className="select filter-select" id="roleFilter">
                    <option value="all">Tất cả vai trò</option>
                    <option value="learner">Người học</option>
                    <option value="admin">Quản trị viên</option>
                </select>

                <select className="select filter-select" id="statusFilter">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="locked">Đã khóa</option>
                </select>
            </div>

            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>Người dùng</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tham gia</th>
                        <th>Lượt luyện viết</th>
                        <th style={{textAlign: 'right'}}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody id="userTableBody"></tbody>
                </table>

                <div className="empty-state" id="emptyState">Không tìm thấy tài khoản phù hợp.</div>

                <div className="table-foot">
                    <span>Hiển thị <strong id="rowCount">8</strong> / 248 tài khoản</span>

                    <div className="pagination">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <button className="page-btn">…</button>
                        <button className="page-btn">31</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;