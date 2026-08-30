import React, {useEffect, useState} from 'react';
import './AdminLesson.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";

const AdminLesson = () => {
    const {data: lessonsRoad} = useFetch(`${API_URL}/admin/all-lessons-road`);
    // Format
    const mapLessonRoad = (lesson) => ({
        id: lesson?.id,
        createdAt: lesson?.createdAt,
        des: lesson?.description,
        active: lesson?.active,
        name: lesson?.name,
        orderIndex: lesson?.orderIndex,
        updateAt: lesson?.updatedAt,
        youtubeId: lesson?.youtubeId,
        duration: lesson?.duration,
        cateName: lesson?.cateRoute?.name || 'Chưa phân loại',
        cateId: lesson?.cateRoute?.id || 0
    });
    const lessonsRoadRes = lessonsRoad.map(mapLessonRoad);
    const [lessonsRoadListRes, setLessonsRoadListRes] = useState([]);
    useEffect(() => {
        setLessonsRoadListRes(lessonsRoadRes);
    }, []);

    // Edit Lesson
    const [editName, setEditName] = useState("");
    const [editCateId, setEditCateId] = useState("");
    const [editOrderIndex, setEditOrderIndex] = useState(1);
    const [editIsActive, setEditIsActive] = useState("");
    const [editDuration, setEditDuration] = useState("");
    const [editDes, setEditDes] = useState("");
    const [editYoutubeId, setEditYoutubeId] = useState("");
    const setEditInput = (name, value) => {
        switch (name) {
            case "name": setEditName(value); return;
            case "cateId": setEditCateId(value); return;
            case "orderIndex": setEditOrderIndex(value); return;
            case "isActive": setEditIsActive(value); return;
            case "duration": setEditDuration(value); return;
            case "des": setEditDes(value); return;
            case "youtube": setEditYoutubeId(value); return;
        }
    }
    // Modal
    const EMPTY_FORM = { title: '', category: 'alphabet', duration: '', status: 'draft', description: '' };
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isEditVideoLink, setIsEditVideoLink] = useState(true);
    const openEditModal = (lesson)  => {
        setEditingId(lesson.id);
        const res = {
            id: lesson?.id,
            createdAt: lesson?.createdAt,
            des: lesson?.des,
            active: lesson?.active,
            name: lesson?.name,
            orderIndex: lesson?.orderIndex,
            updateAt: lesson?.updateAt,
            youtubeId: lesson?.youtubeId,
            duration: lesson?.duration,
            cateName: lesson?.cateName || 'Chưa phân loại',
            cateId: lesson?.cateId || 0
        };
        setForm(res);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }
    const {executePost: handleEdit} = usePost(`${API_URL}/admin/edit-lesson`);
    const handleEditLessonRoute = async (e) => {
        e.preventDefault();

        if (editOrderIndex <= 0) {
            alert("Vị trí hiện thị trong danh mục không thể <= 0");
            return;
        }

        let active = "";
        if (editIsActive.trim() !== "") active = JSON.parse(editIsActive);

        const req = {
            id: editingId,
            name: editName,
            cateRouteId: editCateId,
            orderIndex: editOrderIndex,
            isActive: active,
            duration: editDuration,
            description: editDes,
            youtubeId: editYoutubeId
        }

        try {
            const data = await handleEdit(req);
            if (data) {
                alert("OK");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Edit Lesson", e);
        }
    }

    // Search Name Lesson
    const {executePost: handleSearch} = usePost(`${API_URL}/admin/search-lessons-name`);
    const [searchName, setSearchName] = useState("");
    useEffect(() => {
        const handleSearchNameLesson = async () => {
            const req = {
                lessonRoadName: searchName
            }

            try {
                const data = await handleSearch(req);
                const res = data.map(mapLessonRoad);
                setLessonsRoadListRes(res);
            } catch (e) {
                console.log("Error Search Name Lesson", e);
            }
        }
        handleSearchNameLesson();
    }, [searchName]);

    // Handle Filter Cate, Status
    const [statusFilter, setStatusFilter] = useState(-1);
    const [categoryFilter, setCategoryFilter] = useState(0);
    useEffect(() => {
        let list = [...lessonsRoadRes];
        if (categoryFilter !== 0) list = list.filter(l => l.cateId === categoryFilter);

        if (statusFilter === 1) list = list.filter(l => l.active);
        if (statusFilter === 0) list = list.filter(l => !l.active);

        setLessonsRoadListRes(list);
    }, [searchName, categoryFilter, statusFilter, lessonsRoad]);

    // Get All Cate Road
    const {data: getAllCateRoad} = useFetch(`${API_URL}/admin/all-cate-road`);
    const cateList = getAllCateRoad.map((cate) => ({
        id: cate.id,
        name: cate.name,
    }))

    // Handle Stat
    const lessonsActiveLength = lessonsRoad.filter(lesson => lesson.active).length;
    const lessonsNoActiveLength = lessonsRoad.filter(lesson => !lesson.active).length;
    // Stat Row
    const statRows = [
        {name: "Tổng số bài học", amount: lessonsRoadRes.length, icon: "lessons", tone: "tone-a"},
        {name: "Đang hiển thị", amount: lessonsActiveLength, icon: "active", tone: "tone-b"},
        {name: "Đang ẩn", amount: lessonsNoActiveLength, icon: "noActive", tone: "tone-c"},
        {name: "Danh mục", amount: cateList.length, icon: "cate", tone: "tone-d"},
    ];
    const iconStatRows = {
        lessons: (
            <svg viewBox="0 0 24 24">
                <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" />
                <path d="M17 3v16" />
            </svg>
        ),
        active: (
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
        ),
        noActive: (
            <svg viewBox="0 0 24 24"><path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
        ),
        cate: (
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
        )
    };

    // Spilt Text
    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };
    function openAddModal() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    }
    // function handleSubmit(e) {
    //     e.preventDefault();
    //     if (!form.title.trim()) return;
    //
    //     if (editingId === null) {
    //         const newLesson = {
    //             id: Math.max(0, ...lessons.map((l) => l.id)) + 1,
    //             title: form.title.trim(),
    //             category: form.category,
    //             videoCount: 1,
    //             duration: form.duration || '0:00',
    //             status: form.status,
    //             updatedAt: 'Vừa xong',
    //         };
    //         setLessons((prev) => [newLesson, ...prev]);
    //     } else {
    //         setLessons((prev) =>
    //             prev.map((l) => (l.id === editingId ? { ...l, ...form, updatedAt: 'Vừa xong' } : l))
    //         );
    //     }
    //     setModalOpen(false);
    // }
    // function deleteLesson(id) {
    //     if (!window.confirm('Xóa bài học này khỏi hệ thống?')) return;
    //     setLessons((prev) => prev.filter((l) => l.id !== id));
    // }

    return (
        <div className="admin-lessons">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý bài học</h1>
                    <p>Thêm, chỉnh sửa và xuất bản các bài học video theo từng danh mục.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    Thêm bài học
                </button>
            </div>

            <div className="stat-row">
                {
                    statRows.map((stat, index) => (
                        <div key={index} className="card stat-card">
                            <div className={`stat-icon ${stat.tone}`}>
                                {iconStatRows[stat.icon]}
                            </div>

                            <div>
                                <div className="stat-num">{stat.amount}</div>
                                <div className="stat-label">{stat.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên bài học..."
                        value={searchName || ""}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(Number(e.target.value))}>
                    <option value={0}>Tất cả danh mục</option>

                    {cateList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(Number(e.target.value))}>
                    <option value={-1}>Tất cả trạng thái</option>
                    <option value={1}>Đang hiển thị</option>
                    <option value={0}>Đang ẩn</option>
                </select>
            </div>

            <div className="card table-card">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>ID</th>
                            <th>Bài học</th>
                            <th>Danh mục</th>
                            <th>Vị trí hiển thị</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Cập nhật</th>
                            <th style={{ textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {lessonsRoadListRes .map((l, index) => (
                            <tr key={l.id}>
                                <td>{index + 1}</td>
                                <td>{l.id}</td>
                                <td>{truncateText(l.name, 20)}</td>
                                <td>{l.cateName}</td>
                                <td>{l.orderIndex}</td>
                                <td>{l.active ? 'Đang hiển thị' : 'Đang ẩn'}</td>
                                <td>{l.createdAt}</td>
                                <td>{l.updateAt}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="icon-btn" title="Chỉnh sửa" onClick={() => openEditModal(l)}>
                                            <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                        </button>

                                        <button className="icon-btn danger" title="Xóa">
                                            <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {lessonsRoadListRes.length === 0 && (
                            <tr><td colSpan={6} className="empty-row">Không tìm thấy bài học phù hợp.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId === null ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}</h3>

                        <form onSubmit={handleEditLessonRoute}>
                            <div className="field">
                                <label>Tên bài học</label>
                                <input
                                    type="text"
                                    defaultValue={form.name}
                                    onChange={(e) => setEditInput("name", e.target.value)}
                                    placeholder="VD: 10 nguyên âm cơ bản"
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Danh mục</label>
                                    <select
                                        defaultValue={form.cateId}
                                        onChange={(e) => setEditInput("cateId", e.target.value)}
                                    >
                                        {cateList.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Vị trí hiện thị trong danh mục</label>
                                    <input
                                        type="text"
                                        defaultValue={form.orderIndex}
                                        onChange={(e) => setEditInput("orderIndex", Number(e.target.value))}
                                        placeholder="VD: 1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Trạng thái</label>
                                    <select
                                        defaultValue={String(form.active)}
                                        onChange={(e) => setEditInput("isActive", e.target.value)}
                                    >
                                        <option value={String(form.active)}>{form.active ? `Đang hiển thị` : `Đang ẩn`}</option>
                                        <option value={String(!form.active)}>{!form.active ? `Đang hiển thị` : `Đang ẩn`}</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Thời lượng video</label>
                                    <input
                                        type="text"
                                        defaultValue={form.duration}
                                        onChange={(e) => setEditInput("duration", e.target.value)}
                                        placeholder="VD: 5:30"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>Mô tả</label>

                                <textarea
                                    rows={5}
                                    defaultValue={form.des}
                                    onChange={(e) => setEditInput("des", e.target.value)}
                                    placeholder="Mô tả ngắn về nội dung bài học..."
                                />
                            </div>

                            <div className="field">
                                <label>Video</label>

                                {isEditVideoLink ? (
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                                        <span style={{ padding: '8px 10px', background: '#f1f5f9', color: '#64748b', fontSize: '14px', borderRight: '1px solid #ccc' }}>
                                            https://www.youtube.com/watch?v=
                                        </span>
                                        <input
                                            type="text"
                                            style={{ border: 'none', outline: 'none', padding: '8px', flex: 1 }}
                                            placeholder="Nhập ID video..."
                                            defaultValue={form.youtubeId}
                                            onChange={(e) => setEditInput("youtube", e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="upload-box">
                                        <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                                        <span>Kéo thả file video hoặc bấm để chọn</span>
                                    </div>
                                )}
                            </div>

                            <div className="field toggle-field">
                                <label>Xuất bản ngay</label>

                                <div
                                    className={`switch ${form.active === 'published' ? 'on' : ''}`}
                                    onClick={() => setForm({ ...form, status: form.status === 'published' ? 'draft' : 'published' })}
                                >
                                    <div className="knob" />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId === null ? 'Thêm bài học' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminLesson;