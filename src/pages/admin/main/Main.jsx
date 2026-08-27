import React, {useEffect, useState} from 'react';
import './Main.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import {usePost} from "../../../components/use/usePost.js";
import {usePatch} from "../../../components/use/usePatch.js";
import {useDelete} from "../../../components/use/useDelete.js";

const Main = () => {
    const {data: loadAuth, loading: isLoadingAuth} = useFetch(`${API_URL}/admin/all`);
    const {executePost: handleFindByEmail} = usePost(`${API_URL}/admin/email`);
    const {executePatch: handleChangeProfile} = usePatch(`${API_URL}/user/change-profile`);
    const {executePost: handleCreateUser} = usePost(`${API_URL}/admin/create`);
    const {executeDelete: handleDeleteUser} = useDelete(`${API_URL}/admin/delete`);

    const [authListCustom, setAuthListCustom] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUser, setSelectedUser] = useState(0);
    const [userDetail, setUserDetail] = useState();
    const [editUser, setEditUser] = useState(false);
    const [isEnabled, setIsEnabled] = useState("");
    const [findByEmail, setFindByEmail] = useState("");
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);

    // Create New User
    const [createFullName, setCreateFullName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [createPhone, setCreatePhone] = useState("");
    const [createActive, setCreateActive] = useState("true");
    const [createRole, setCreateRole] = useState("USER");

    // Change Profile
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [isActive, setIsActive] = useState("");

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
    const authNoActive = authList.filter(auth => !auth.enabled).length;
    const authListUser = authList.filter(auth => auth.role === 'USER');
    const authListAdmin = authList.filter(auth => auth.role === 'ADMIN');
    const authListEnabled = authList.filter(auth => auth.enabled);
    const authListNoEnabled = authList.filter(auth => !auth.enabled);

    const handleDeleteUserAdmin = async (authId) => {
        const req = {
            authId: authId
        }

        try {
            const data = await handleDeleteUser(req);
            if (data) {
                alert("Xoá tài khoản thành công.")
                window.location.reload();
            } else alert("Xoá tài khoản thất bại.")
        } catch (e) {
            console.log("Error Delete User", e);
        }
    }

    const dataInput = [
        {name: "Họ và tên", type: "fullName", typeInput: "text", placeholderInput: "Nhập họ và tên...", valueInput: createFullName},
        {name: "Số điện thoại", type: "phone", typeInput: "text", placeholderInput: "0987654321", valueInput: createPhone},
        {name: "Email", type: "email", typeInput: "text", placeholderInput: "example@gmail.com", valueInput: createEmail},
        {name: "Mật khẩu", type: "pass", typeInput: "password", placeholderInput: "Tối thiểu 6 ký tự...", valueInput: createPassword},
    ];

    const handleChangeCreateUser = (value, type) => {
        switch (type) {
            case "fullName": setCreateFullName(value); return;
            case "email": setCreateEmail(value); return;
            case "pass": setCreatePassword(value); return;
            case "phone": setCreatePhone(value); return;
        }
    }

    const handleCreateNewUser = async (e) => {
        e.preventDefault();

        const req = {
            fullName: createFullName,
            email: createEmail,
            password: createPassword,
            numberPhone: createPhone,
            active: JSON.parse(createActive),
            role: createRole
        }

        try {
            const data = await handleCreateUser(req);
            console.log(data);
            if (data) {
                alert("Tạo tài khoản mới thành công.");
                window.location.reload();
            } else alert("Email đã tồn tại.");
        } catch (e) {
            console.log("Error Create New User", e);
        }
    }

    const handleChangeUserProfile = async () => {
        const req = {
            email: userDetail?.email,
            fullName: fullName,
            phone: phone,
            role: role,
            isActive: JSON.parse(isActive)
        }

        try {
            const data = await handleChangeProfile(req);
            if (data) {
                alert("Cập nhật thành công");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Change User Profile", e);
        }
    }

    useEffect(() => {
        const handleSearchUserByEmail = async () => {
            const body = {
                email: findByEmail
            }

            try {
                const data = await handleFindByEmail(body);
                const authList = data.map((item) => ({
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
                setAuthListCustom(authList);
            } catch (e) {
                console.log("Error Find By Email", e);
            }
        }
        handleSearchUserByEmail();
    }, [findByEmail]);

    useEffect(() => {
        if (selectedRole === "USER") setAuthListCustom(authListUser);
        else if (selectedRole === "ADMIN") setAuthListCustom(authListAdmin);
        else setAuthListCustom(authList);
    }, [loadAuth, selectedRole]);
    useEffect(() => {
        if (isEnabled === "true") setAuthListCustom(authListEnabled);
        else if (isEnabled === "false") setAuthListCustom(authListNoEnabled);
        else setAuthListCustom(authList);
    }, [isEnabled]);

    useEffect(() => {
        const res = authList.find(auth => auth.id === selectedUser);
        setUserDetail(res);
        setEditUser(false);
    }, [selectedUser]);

    const dataPagesCate = [
        { name: "Tổng số tài khoản", number: authList.length, iconKey: "user" },
        { name: "Đang hoạt động", number: authActive, iconKey: "active" },
        { name: "Chưa kích hoạt", number: authNoActive, iconKey: "lock" },
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

                <button className="btn btn-primary" onClick={() => setIsOpenAddModal(true)}>
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

                    <input type="text" id="searchInput" placeholder="Tìm theo tên hoặc email..."
                           onChange={(e) => setFindByEmail(e.target.value)}
                    />
                </div>

                <select className="select filter-select" id="roleFilter"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="all">Tất cả vai trò</option>
                    <option value="USER">Người học</option>
                    <option value="ADMIN">Quản trị viên</option>
                </select>

                <select className="select filter-select" id="statusFilter"
                        value={isEnabled}
                        onChange={(e) => setIsEnabled(e.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Chưa kích hoạt</option>
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
                        <th></th>
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
                                <td>{auth.enabled ? `Đang hoạt động` : `Chưa kích hoạt`}</td>
                                <td>{auth.isGoogle ? `Có` : `Không`}</td>
                                <td><button onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUserAdmin(auth.id);
                                }} className="btn btn-ghost">Xoá</button></td>
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
                                        <input
                                            onChange={(e) => setFullName(e.target.value)}
                                            type="text" style={{textAlign: "right"}}
                                            defaultValue={userDetail?.fullName || ''}/>
                                    </span>
                                )
                            }
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Số điện thoại:</span>
                            {
                                !editUser ? (
                                    <span className="detail-value">{userDetail?.phone}</span>
                                ) : (
                                    <span className="detail-valute">
                                        <input
                                            onChange={(e) => setPhone(e.target.value)}
                                            type="text"
                                            style={{textAlign: "right"}}
                                            defaultValue={userDetail?.phone}/>
                                    </span>
                                )
                            }
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
                                    <select onChange={(e) => setRole(e.target.value)} className="select filter-select" id="statusFilter">
                                        <option value={userDetail?.role === 'USER' ? 'USER' : 'ADMIN'}>{userDetail?.role === 'USER' ? 'Người học' : 'Quản trị viên'}</option>
                                        <option value={userDetail?.role !== 'USER' ? 'USER' : 'ADMIN'}>{userDetail?.role !== 'USER' ? 'Người học' : 'Quản trị viên'}</option>
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
                                    <select onChange={(e) => setIsActive(e.target.value)} className="select filter-select" id="statusFilter">
                                        <option value={String(userDetail?.enabled)}>{userDetail?.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}</option>
                                        <option value={String(!userDetail?.enabled)}>{!userDetail?.enabled ? 'Đang hoạt động' : 'Chưa kích hoạt'}</option>
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

                        <button className={`btn btn-primary ${editUser ? `disable` : ``}`} onClick={() => setEditUser(!editUser)}>Chỉnh sửa</button>
                        <button className={`btn btn-primary ${editUser ? `` : `disable`}`} onClick={() => {
                            handleChangeUserProfile();
                            setEditUser(!editUser);
                        }}>Lưu</button>
                    </div>
                </div>
            )}

            {isOpenAddModal && (
                <div className="modal-overlay" onClick={() => setIsOpenAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Thêm tài khoản mới</h2>
                            <button className="btn btn-ghost" onClick={() => setIsOpenAddModal(false)}>✕</button>
                        </div>

                        <form
                            onSubmit={handleCreateNewUser}
                            className="modal-form"
                        >
                            {
                                dataInput.map((input) => (
                                    <div className="form-group">
                                        <label>{input.name}</label>
                                        <input
                                            type={input.typeInput}
                                            name={input.type}
                                            required
                                            placeholder={input.placeholderInput}
                                            value={input.valueInput || ""}
                                            onChange={(e) => handleChangeCreateUser(e.target.value, input.type)}
                                        />
                                    </div>
                                ))
                            }

                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Vai trò</label>

                                    <select
                                        name="role"
                                        className="select"
                                        value={createRole}
                                        onChange={(e) => setCreateRole(e.target.value)}
                                    >
                                        <option value="USER">Người học</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>

                                <div className="form-group flex-1">
                                    <label>Trạng thái hoạt động</label>

                                    <select
                                        name="active"
                                        className="select"
                                        value={createActive}
                                        onChange={(e) => setCreateActive(e.target.value)}
                                    >
                                        <option value="true">Kích hoạt ngay</option>
                                        <option value="false">Không kích hoạt</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsOpenAddModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">Xác nhận tạo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;