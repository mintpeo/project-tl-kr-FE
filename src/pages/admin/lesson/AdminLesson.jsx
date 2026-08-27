import React, { useMemo, useState } from 'react';
import './AdminLesson.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";

/* ============================================================
   DỮ LIỆU MẪU — thay bằng dữ liệu thật từ API /api/admin/lessons
   ============================================================ */
const CATEGORY_OPTIONS = [
    { value: 'alphabet', label: 'Bảng chữ cái' },
    { value: 'vowel', label: 'Nguyên âm' },
    { value: 'consonant', label: 'Phụ âm' },
    { value: 'syllable', label: 'Âm tiết ghép' },
];

const INITIAL_LESSONS = [
    { id: 1, title: 'Giới thiệu bảng chữ cái Hangul', category: 'alphabet', videoCount: 1, duration: '3:20', status: 'published', updatedAt: '12/06/2026' },
    { id: 2, title: 'Cách ghép nguyên âm và phụ âm', category: 'alphabet', videoCount: 1, duration: '4:10', status: 'published', updatedAt: '12/06/2026' },
    { id: 3, title: '10 nguyên âm cơ bản', category: 'vowel', videoCount: 1, duration: '8:45', status: 'published', updatedAt: '28/07/2026' },
    { id: 4, title: 'Phân biệt ㅓ và ㅗ', category: 'vowel', videoCount: 1, duration: '2:55', status: 'published', updatedAt: '28/07/2026' },
    { id: 5, title: 'Luyện phát âm nguyên âm đôi', category: 'vowel', videoCount: 1, duration: '5:12', status: 'draft', updatedAt: '02/08/2026' },
    { id: 6, title: '14 phụ âm cơ bản', category: 'consonant', videoCount: 1, duration: '9:30', status: 'published', updatedAt: '30/07/2026' },
    { id: 7, title: 'Thứ tự nét của ㄱ, ㄴ, ㄷ, ㄹ', category: 'consonant', videoCount: 1, duration: '4:48', status: 'draft', updatedAt: '05/08/2026' },
    { id: 8, title: 'Nguyên tắc ghép âm tiết', category: 'syllable', videoCount: 1, duration: '6:15', status: 'draft', updatedAt: '10/08/2026' },
];

const EMPTY_FORM = { title: '', category: 'alphabet', duration: '', status: 'draft', description: '' };

/* ============================================================
   COMPONENT
   ============================================================ */
const AdminLesson = () => {
    const {data: lessonsRoad, loading: loadingLessonsRoad} = useFetch(`${API_URL}/admin/all-lessons-road`)
    const lessonsRoadRes = lessonsRoad.map((lesson) => ({
        id: lesson.id,
        createdAt: lesson.createdAt,
        des: lesson.description,
        active: lesson.active,
        name: lesson.name,
        orderIndex: lesson.orderIndex,
        updateAt: lesson.updateAt,
        youtubeId: lesson.youtubeId,
        duration: lesson.duration,
        cate: lesson.cateRoute.name
    }))

    const [lessons, setLessons] = useState(INITIAL_LESSONS);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = đang thêm mới
    const [form, setForm] = useState(EMPTY_FORM);

    const truncateText = (text, maxLength) => {
        if (!text || text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const stats = useMemo(() => ({
        total: lessons.length,
        published: lessons.filter((l) => l.status === 'published').length,
        draft: lessons.filter((l) => l.status === 'draft').length,
        categories: CATEGORY_OPTIONS.length,
    }), [lessons]);

    function openAddModal() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    }

    function openEditModal(lesson) {
        setEditingId(lesson.id);
        setForm({
            title: lesson.title,
            category: lesson.category,
            duration: lesson.duration,
            status: lesson.status,
            description: lesson.description ?? '',
        });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim()) return;

        if (editingId === null) {
            const newLesson = {
                id: Math.max(0, ...lessons.map((l) => l.id)) + 1,
                title: form.title.trim(),
                category: form.category,
                videoCount: 1,
                duration: form.duration || '0:00',
                status: form.status,
                updatedAt: 'Vừa xong',
            };
            setLessons((prev) => [newLesson, ...prev]);
        } else {
            setLessons((prev) =>
                prev.map((l) => (l.id === editingId ? { ...l, ...form, updatedAt: 'Vừa xong' } : l))
            );
        }
        setModalOpen(false);
    }

    function deleteLesson(id) {
        if (!window.confirm('Xóa bài học này khỏi hệ thống?')) return;
        setLessons((prev) => prev.filter((l) => l.id !== id));
    }

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
                <div className="card stat-card">
                    <div className="stat-icon tone-a"><svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></svg></div>
                    <div><div className="stat-num">{stats.total}</div><div className="stat-label">Tổng số bài học</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-b"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg></div>
                    <div><div className="stat-num">{stats.published}</div><div className="stat-label">Đã xuất bản</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg></div>
                    <div><div className="stat-num">{stats.draft}</div><div className="stat-label">Bản nháp</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-d"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg></div>

                    <div>
                        <div className="stat-num">{stats.categories}</div>
                        <div className="stat-label">Danh mục</div>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên bài học..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">Tất cả danh mục</option>

                    {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                </select>
            </div>

            <div className="card table-card">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Bài học</th>
                            <th>Mô tả</th>
                            <th>Danh mục</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Cập nhật</th>
                            <th style={{ textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {lessonsRoadRes.map((l, index) => (
                            <tr key={l.id}>
                                <td>{index + 1}</td>
                                <td>{truncateText(l.name, 20)}</td>
                                <td>{truncateText(l.des, 20)}</td>
                                <td>{l.cate}</td>
                                <td>{l.active ? 'Đang hiển thị' : 'Đang ẩn'}</td>
                                <td className="muted">{l.createdAt}</td>
                                <td className="muted">{l.updatedAt}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="icon-btn" title="Chỉnh sửa" onClick={() => openEditModal(l)}>
                                            <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                        </button>

                                        <button className="icon-btn danger" title="Xóa" onClick={() => deleteLesson(l.id)}>
                                            <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {lessonsRoadRes.length === 0 && (
                            <tr><td colSpan={6} className="empty-row">Không tìm thấy bài học phù hợp.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId === null ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label>Tên bài học</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="VD: 10 nguyên âm cơ bản"
                                    required
                                />
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Danh mục</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    >
                                        {CATEGORY_OPTIONS.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Thời lượng video</label>
                                    <input
                                        type="text"
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                        placeholder="VD: 5:30"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>Mô tả</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Mô tả ngắn về nội dung bài học..."
                                />
                            </div>

                            <div className="field">
                                <label>Video</label>
                                <div className="upload-box">
                                    <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
                                    <span>Kéo thả file video hoặc bấm để chọn</span>
                                </div>
                            </div>

                            <div className="field toggle-field">
                                <label>Xuất bản ngay</label>
                                <div
                                    className={`switch ${form.status === 'published' ? 'on' : ''}`}
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