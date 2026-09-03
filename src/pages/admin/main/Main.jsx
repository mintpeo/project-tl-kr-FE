import React, {useEffect, useState} from 'react';
import './Main.css';
import {API_URL} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import useFetch from "../../../components/use/useFetch.js";
import {usePost} from "../../../components/use/usePost.js";
import {usePatch} from "../../../components/use/usePatch.js";
import {useDelete} from "../../../components/use/useDelete.js";

const EMPTY_FORM = {id: null, fullName: '', email: '', password: '', phone: '', role: 'USER', active: true};

const Main = () => {
    const {data: loadAuth, loading: isLoadingAuth} = useFetch(`${API_URL}/admin/all`);
    const mapAuth = (auth) => ({
        id: auth?.authId,
        email: auth?.mail,
        role: auth?.role,
        createAt: auth?.authCreateAt,
        enabled: auth?.active,
        isGoogle: auth?.google,
        userId: auth?.userId,
        fullName: auth?.fullName,
        phone: auth?.phone
    });
    const authList = loadAuth.map(mapAuth);
    const [authListCustom, setAuthListCustom] = useState([]);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const handleFieldChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const openAddModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    };
    const openEditModal = (auth) => {
        setEditingId(auth.id);
        setForm({
            id: auth.id,
            fullName: auth.fullName || '',
            email: auth.email || '',
            password: '',
            phone: auth.phone || '',
            role: auth.role || 'USER',
            active: Boolean(auth.enabled)
        });
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setForm(EMPTY_FORM);
    };
    // Handle Submit
    const {executePatch: handleChangeProfile} = usePatch(`${API_URL}/admin/change`);
    const {executePost: handleCreateUser} = usePost(`${API_URL}/admin/create`);
    const handleSubmitForm = async (e) => {
        e.preventDefault();

        try {
            if (editingId !== null) {
                const req = {
                    email: form.email,
                    fullName: form.fullName.trim(),
                    phone: form.phone.trim(),
                    role: form.role,
                    isActive: form.active
                };

                const data = await handleChangeProfile(req);
                if (data) {
                    alert("Cập nhật thành công.");
                    window.location.reload();
                }
            } else {
                // Tạo tài khoản mới
                const req = {
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    numberPhone: form.phone.trim(),
                    active: form.active,
                    role: form.role
                };

                const data = await handleCreateUser(req);
                if (data) {
                    alert("Tạo tài khoản mới thành công.");
                    window.location.reload();
                } else {
                    alert("Email đã tồn tại.");
                }
            }
        } catch (err) {
            console.error("Lỗi khi lưu thông tin tài khoản:", err);
        }
    };

    // Handle Deleted
    const {executeDelete: handleDeleteUser} = useDelete(`${API_URL}/admin/delete`);
    const handleDeleteUserAdmin = async (authId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá bài học này?")) return;

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

    // Handle Filter Email Role, Enabled
    const [findByEmail, setFindByEmail] = useState("");
    const {executePost: handleFindByEmail} = usePost(`${API_URL}/admin/email`);
    const [selectedRole, setSelectedRole] = useState("");
    const [isEnabled, setIsEnabled] = useState("");
    useEffect(() => {
        const timer = setTimeout(async () => {
            let baseList = [...authList];

            if (findByEmail.trim()) {
                try {
                    const data = await handleFindByEmail({email: findByEmail});
                    baseList = Array.isArray(data) ? data.map(mapAuth) : [];
                    setAuthListCustom(baseList);
                } catch (e) {
                    console.log("Error Find By Email", e);
                }
            }

            let list = [...baseList];

            // Role
            if (selectedRole === "USER") list = list.filter(auth => auth.role === 'USER');
            if (selectedRole === "ADMIN") list = list.filter(auth => auth.role === 'ADMIN');

            // Enabled
            if (isEnabled === "true") list = list.filter(auth => auth.enabled);
            if (isEnabled === "false") list = list.filter(auth => !auth.enabled);

            setAuthListCustom(list);
        }, 300);

        return () => clearTimeout(timer);
    }, [findByEmail, selectedRole, isEnabled, loadAuth]);

    const authActive = authList.filter(auth => auth.enabled).length;
    const authNoActive = authList.filter(auth => !auth.enabled).length;
    const dataPagesCate = [
        { name: "Tổng số tài khoản", number: authList.length, iconKey: "user" },
        { name: "Đang hoạt động", number: authActive, iconKey: "active" },
        { name: "Chưa kích hoạt", number: authNoActive, iconKey: "lock" },
        // { name: "Mới trong tuần", number: "-", iconKey: "new" },
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
        <div className="main-admin">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý tài khoản</h1>
                    <p>Danh sách toàn bộ tài khoản người học và quản trị viên trong hệ thống.</p>
                </div>

                <button className="btn btn-primary" onClick={() => openAddModal()}>
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
                        <th>Mail</th>
                        <th>Tên người dùng</th>
                        <th>Vai trò</th>
                        <th>Ngày tham gia</th>
                        <th>Hoạt động</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody id="userTableBody">
                    {
                        authListCustom.map((auth, index) => (
                            <tr
                                className={editingId === auth.id ? `activeTR` : ``}
                                key={index}
                            >
                                <td>{index + 1}</td>
                                <td>{auth.email}</td>
                                <td>{auth.fullName}</td>
                                <td>{auth.role === 'USER' ? `Người học` : `Quản trị viên`}</td>
                                <td>{auth.createAt}</td>
                                <td>{auth.enabled ? `Đang hoạt động` : `Chưa kích hoạt`}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="icon-btn" title="Chỉnh sửa" onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(auth);
                                        }}>
                                            <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                        </button>

                                        <button className="icon-btn danger" title="Xóa" onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUserAdmin(auth.id);
                                        }}>
                                            <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

                {authListCustom.length === 0 && (
                    <div className="empty-state" id="emptyState">Không tìm thấy tài khoản phù hợp.</div>
                )}

                {/*<div className="table-foot">*/}
                {/*    <span>Hiển thị <strong id="rowCount">8</strong> / {authList.length} tài khoản</span>*/}

                {/*    <div className="pagination">*/}
                {/*        <button className="page-btn active">1</button>*/}
                {/*        <button className="page-btn">2</button>*/}
                {/*        <button className="page-btn">3</button>*/}
                {/*        <button className="page-btn">…</button>*/}
                {/*        <button className="page-btn">31</button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            {/* ---------------- MODAL ---------------- */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId === null ? 'Thêm tài khoản mới' : 'Chỉnh sửa tài khoản'}</h3>

                        <form onSubmit={handleSubmitForm}>
                            <div className="field">
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    value={form.fullName || ""}
                                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                                    placeholder="Nhập họ và tên..."
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={form.email || ""}
                                        onChange={(e) => handleFieldChange("email", e.target.value)}
                                        placeholder="example@gmail.com"
                                        disabled={editingId !== null} // Khóa đổi email khi đang ở chế độ sửa
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={form.phone || ""}
                                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                                        placeholder="0987654321"
                                    />
                                </div>
                            </div>

                            {/* Chỉ hiển thị trường mật khẩu khi thêm mới */}
                            {editingId === null && (
                                <div className="field">
                                    <label>Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={form.password || ""}
                                        onChange={(e) => handleFieldChange("password", e.target.value)}
                                        placeholder="Tối thiểu 6 ký tự..."
                                        required
                                    />
                                </div>
                            )}

                            <div className="field-row">
                                <div className="field">
                                    <label>Vai trò</label>
                                    <select
                                        value={form.role}
                                        onChange={(e) => handleFieldChange("role", e.target.value)}
                                    >
                                        <option value="USER">Người học</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Trạng thái</label>
                                    <select
                                        value={String(form.active)}
                                        onChange={(e) => handleFieldChange("active", e.target.value === 'true')}
                                    >
                                        <option value="true">Đang hoạt động</option>
                                        <option value="false">Chưa kích hoạt</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId === null ? 'Xác nhận tạo' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;