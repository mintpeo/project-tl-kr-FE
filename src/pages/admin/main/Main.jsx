import React, {useEffect, useState} from 'react';
import './Main.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";

const Main = () => {
    const {data: loadAuth, loading: isLoadingAuth} = useFetch(`${API_URL}/admin/all`);
    const [authListCustom, setAuthListCustom] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUser, setSelectedUser] = useState(0);
    const [userDetail, setUserDetail] = useState();
    const [editUser, setEditUser] = useState(false);

    const authList = loadAuth.map((item) => ({
        id: item.authId,
        email: item.mail,
        role: item.role,
        createAt: item.authCreateAt,
        enabled: item.active,
        isGoogle: item.google,
        userId: item.userId,
        fullName: item.fullName,
        phone: item.phone
    }));
    const authActive = authList.filter(auth => auth.enabled).length;
    const authListUser = authList.filter(auth => auth.role === 'USER');
    const authListAdmin = authList.filter(auth => auth.role === 'ADMIN');

    useEffect(() => {
        if (selectedRole === "USER") setAuthListCustom(authListUser);
        else if (selectedRole === "ADMIN") setAuthListCustom(authListAdmin);
        else setAuthListCustom(authList);
    }, [loadAuth, selectedRole]);

    useEffect(() => {
        const res = authList.find(auth => auth.id === selectedUser);
        setUserDetail(res);
    }, [selectedUser]);
    console.log(userDetail);

    const dataPagesCate = [
        { name: "Tổng số tài khoản", number: authList.length, iconKey: "user" },
        { name: "Đang hoạt động", number: authActive, iconKey: "active" },
        { name: "Đã khóa", number: "-", iconKey: "lock" },
        { name: "Mới trong tuần", number: "-", iconKey: "new" },
    ]

    const ICONS = {
        user: (
            <svg viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 00-3-3.87"/>
                <path d="M9 20H4v-2a4 4 0 013-3.87"/>
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
        ),
        active: (
            <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        ),
        lock: (
            <svg viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                <path d="M8 11V7a4 4 0 118 0v4"/>
            </svg>
        ),
        new: (
            <svg viewBox="0 0 24 24">
                <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z"/>
            </svg>
        ),
    };

    if (isLoadingAuth) return <Skeleton />
    return (
        <div className="main">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý tài khoản</h1>
                    <p>Danh sách toàn bộ tài khoản người học và quản trị viên trong hệ thống.</p>
                </div>

                <button className="btn btn-primary">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>

                    Thêm tài khoản
                </button>
            </div>

            <div className="stat-row">
                {
                    dataPagesCate.map((item, index) => (
                        <div key={index} className="card stat-card">
                            <div className="stat-icon total">
                                {ICONS[item.iconKey]}
                            </div>

                            <div>
                                <div className="stat-num">{item.number}</div>
                                <div className="stat-label">{item.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7"/>
                        <path d="M21 21l-4.3-4.3"/>
                    </svg>

                    <input type="text" id="searchInput" placeholder="Tìm theo tên hoặc email..."/>
                </div>

                <select className="select filter-select" id="roleFilter"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="all">Tất cả vai trò</option>
                    <option value="USER">Người học</option>
                    <option value="ADMIN">Quản trị viên</option>
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
                        <th>STT</th>
                        <th>ID</th>
                        <th>Mail</th>
                        <th>Vai trò</th>
                        <th>Ngày tham gia</th>
                        <th>Hành động</th>
                        <th>Đăng nhập Google</th>
                    </tr>
                    </thead>
                    <tbody id="userTableBody">
                    {
                        authListCustom.map((auth, index) => (
                            <tr
                                className={selectedUser === auth.id ? `activeTR` : ``}
                                style={{cursor: "pointer"}} key={index}
                                onClick={() => setSelectedUser(auth.id)}
                            >
                                <td>{index + 1}</td>
                                <td>{auth.id}</td>
                                <td>{auth.email}</td>
                                <td>{auth.role === 'USER' ? `Người học` : `Quản trị viên`}</td>
                                <td>{auth.createAt}</td>
                                <td>{auth.enabled ? `Hoạt động` : `Chưa kích hoạt`}</td>
                                <td>{auth.isGoogle ? `Có` : `Không`}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

                {authListCustom.length === 0 && (
                    <div className="empty-state" id="emptyState">Không tìm thấy tài khoản phù hợp.</div>
                )}

                <div className="table-foot">
                    <span>Hiển thị <strong id="rowCount">8</strong> / {authList.length} tài khoản</span>

                    <div className="pagination">
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">3</button>
                        <button className="page-btn">…</button>
                        <button className="page-btn">31</button>
                    </div>
                </div>
            </div>

            {selectedUser !== 0 && (
                <div className="card detail-panel">
                    <div className="detail-header">
                        <h3>Thông tin chi tiết</h3>
                        <button className="btn-close" onClick={() => setSelectedUser(0)}>✕</button>
                    </div>

                    <div className="detail-body">
                        <div className="detail-item">
                            <span className="detail-label">Mã tài khoản (ID):</span>
                            <span className="detail-value">{userDetail?.id}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Tên:</span>
                            {
                                !editUser ? (
                                    <span className="detail-value">{userDetail?.fullName}</span>
                                ) : (
                                    <span className="detail-valute">
                                        <input type="text" style={{textAlign: "right"}} value={userDetail?.fullName}/>
                                    </span>
                                )
                            }
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Số điện thoại:</span>
                            <span className="detail-value">{userDetail?.phone}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{userDetail?.email}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Vai trò:</span>
                            {
                                !editUser ? (
                                    <span className={`badge ${userDetail?.role === 'ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                                        {userDetail?.role === 'USER' ? 'Người học' : 'Quản trị viên'}
                                    </span>
                                ) : (
                                    <select className="select filter-select" id="statusFilter">
                                        <option>{userDetail?.role === 'USER' ? 'Người học' : 'Quản trị viên'}</option>
                                        <option>{userDetail?.role !== 'USER' ? 'Người học' : 'Quản trị viên'}</option>
                                    </select>
                                )
                            }
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Trạng thái:</span>
                            {
                                !editUser ? (
                                    <span className={`badge ${userDetail?.enabled ? 'badge-success' : 'badge-danger'}`}>
                                        {userDetail?.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}
                                    </span>
                                ) : (
                                    <select className="select filter-select" id="statusFilter">
                                        <option>{userDetail?.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}</option>
                                        <option>{!userDetail?.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}</option>
                                    </select>
                                )
                            }
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Đăng nhập Google:</span>
                            <span className="detail-value">{userDetail?.isGoogle ? 'Có' : 'Không'}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Ngày tạo:</span>
                            <span className="detail-value">{userDetail?.createAt}</span>
                        </div>

                        <button className="btn btn-primary" onClick={() => setEditUser(!editUser)}>{editUser ? `Lưu` : `Chỉnh sửa`}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;