import React, { useMemo, useState } from 'react';
import './AdminCharacter.css';

/* ============================================================
   DỮ LIỆU MẪU — thay bằng dữ liệu thật từ API /api/admin/characters
   ============================================================ */
const CATEGORY_OPTIONS = [
    { value: 'vowel', label: 'Nguyên âm' },
    { value: 'consonant', label: 'Phụ âm' },
    { value: 'syllable', label: 'Âm tiết ghép' },
];

const INITIAL_CHARS = [
    { id: 1, glyph: 'ㅏ', romanization: 'a', category: 'vowel', strokeCount: 2, strokeFile: '15_a.svg' },
    { id: 2, glyph: 'ㅑ', romanization: 'ya', category: 'vowel', strokeCount: 3, strokeFile: null },
    { id: 3, glyph: 'ㅓ', romanization: 'eo', category: 'vowel', strokeCount: 2, strokeFile: null },
    { id: 4, glyph: 'ㅗ', romanization: 'o', category: 'vowel', strokeCount: 2, strokeFile: null },
    { id: 5, glyph: 'ㅜ', romanization: 'u', category: 'vowel', strokeCount: 2, strokeFile: null },
    { id: 6, glyph: 'ㅡ', romanization: 'eu', category: 'vowel', strokeCount: 1, strokeFile: null },
    { id: 7, glyph: 'ㅣ', romanization: 'i', category: 'vowel', strokeCount: 1, strokeFile: null },
    { id: 8, glyph: 'ㄱ', romanization: 'giyeok', category: 'consonant', strokeCount: 1, strokeFile: null },
    { id: 9, glyph: 'ㄴ', romanization: 'nieun', category: 'consonant', strokeCount: 1, strokeFile: '02_nieun.svg' },
    { id: 10, glyph: 'ㄷ', romanization: 'digeut', category: 'consonant', strokeCount: 2, strokeFile: '03_digeut.svg' },
    { id: 11, glyph: 'ㄹ', romanization: 'rieul', category: 'consonant', strokeCount: 3, strokeFile: null },
    { id: 12, glyph: 'ㅁ', romanization: 'mieum', category: 'consonant', strokeCount: 3, strokeFile: '05_mieum.svg' },
    { id: 13, glyph: '한', romanization: 'han', category: 'syllable', strokeCount: 4, strokeFile: null },
    { id: 14, glyph: '가', romanization: 'ga', category: 'syllable', strokeCount: 3, strokeFile: null },
];

const EMPTY_FORM = { glyph: '', romanization: '', category: 'vowel', strokeCount: 1, strokeFile: null };

function categoryLabel(value) {
    return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
}

/* ============================================================
   COMPONENT
   ============================================================ */
const AdminCharacter = () => {
    const [chars, setChars] = useState(INITIAL_CHARS);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [strokeFilter, setStrokeFilter] = useState('all'); // all | has | missing

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const filtered = useMemo(() => {
        return chars.filter((c) => {
            const matchesSearch =
                c.glyph.includes(search) || c.romanization.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
            const matchesStroke =
                strokeFilter === 'all' ||
                (strokeFilter === 'has' && c.strokeFile) ||
                (strokeFilter === 'missing' && !c.strokeFile);
            return matchesSearch && matchesCategory && matchesStroke;
        });
    }, [chars, search, categoryFilter, strokeFilter]);

    const stats = useMemo(() => ({
        total: chars.length,
        vowel: chars.filter((c) => c.category === 'vowel').length,
        consonant: chars.filter((c) => c.category === 'consonant').length,
        missingStroke: chars.filter((c) => !c.strokeFile).length,
    }), [chars]);

    function openAddModal() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    }

    function openEditModal(item) {
        setEditingId(item.id);
        setForm({
            glyph: item.glyph,
            romanization: item.romanization,
            category: item.category,
            strokeCount: item.strokeCount,
            strokeFile: item.strokeFile,
        });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.glyph.trim() || !form.romanization.trim()) return;

        if (editingId === null) {
            const newItem = {
                id: Math.max(0, ...chars.map((c) => c.id)) + 1,
                glyph: form.glyph.trim(),
                romanization: form.romanization.trim(),
                category: form.category,
                strokeCount: Number(form.strokeCount) || 1,
                strokeFile: form.strokeFile,
            };
            setChars((prev) => [newItem, ...prev]);
        } else {
            setChars((prev) =>
                prev.map((c) => (c.id === editingId ? { ...c, ...form, strokeCount: Number(form.strokeCount) || 1 } : c))
            );
        }
        setModalOpen(false);
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (file) setForm((f) => ({ ...f, strokeFile: file.name }));
    }

    function deleteChar(id) {
        if (!window.confirm('Xóa ký tự này khỏi hệ thống?')) return;
        setChars((prev) => prev.filter((c) => c.id !== id));
    }

    return (
        <div className="admin-chars">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý ký tự tiếng Hàn</h1>
                    <p>Danh sách nguyên âm, phụ âm và âm tiết cùng dữ liệu thứ tự nét viết tương ứng.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    Thêm ký tự
                </button>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-icon tone-a"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg></div>
                    <div><div className="stat-num">{stats.total}</div><div className="stat-label">Tổng số ký tự</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-b"><svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></svg></div>
                    <div><div className="stat-num">{stats.vowel}</div><div className="stat-label">Nguyên âm</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg></div>
                    <div><div className="stat-num">{stats.consonant}</div><div className="stat-label">Phụ âm</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-d"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg></div>
                    <div><div className="stat-num">{stats.missingStroke}</div><div className="stat-label">Thiếu dữ liệu nét</div></div>
                </div>
            </div>

            {/* ---------------- TOOLBAR ---------------- */}
            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Tìm theo ký tự hoặc cách đọc..."
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
                <select value={strokeFilter} onChange={(e) => setStrokeFilter(e.target.value)}>
                    <option value="all">Tất cả dữ liệu nét</option>
                    <option value="has">Đã có SVG</option>
                    <option value="missing">Chưa có SVG</option>
                </select>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>Ký tự</th>
                        <th>Cách đọc</th>
                        <th>Danh mục</th>
                        <th>Số nét</th>
                        <th>Dữ liệu nét</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((c) => (
                        <tr key={c.id}>
                            <td><div className="glyph-cell">{c.glyph}</div></td>
                            <td className="mono">{c.romanization}</td>
                            <td><span className={`category-badge ${c.category}`}>{categoryLabel(c.category)}</span></td>
                            <td className="mono">{c.strokeCount} nét</td>
                            <td>
                                {c.strokeFile ? (
                                    <span className="stroke-badge has">
                      <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                                        {c.strokeFile}
                    </span>
                                ) : (
                                    <span className="stroke-badge missing">
                      <svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                      Chưa có
                    </span>
                                )}
                            </td>
                            <td>
                                <div className="row-actions">
                                    <button className="icon-btn" title="Chỉnh sửa" onClick={() => openEditModal(c)}>
                                        <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                    </button>
                                    <button className="icon-btn danger" title="Xóa" onClick={() => deleteChar(c.id)}>
                                        <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={6} className="empty-row">Không tìm thấy ký tự phù hợp.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ---------------- MODAL THÊM/SỬA ---------------- */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId === null ? 'Thêm ký tự mới' : 'Chỉnh sửa ký tự'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="field-row">
                                <div className="field" style={{ maxWidth: 100 }}>
                                    <label>Ký tự</label>
                                    <input
                                        type="text"
                                        className="glyph-input"
                                        value={form.glyph}
                                        onChange={(e) => setForm({ ...form, glyph: e.target.value })}
                                        placeholder="ㅏ"
                                        maxLength={2}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Cách đọc (romanization)</label>
                                    <input
                                        type="text"
                                        value={form.romanization}
                                        onChange={(e) => setForm({ ...form, romanization: e.target.value })}
                                        placeholder="VD: a, giyeok, han"
                                        required
                                    />
                                </div>
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
                                    <label>Số nét viết</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={form.strokeCount}
                                        onChange={(e) => setForm({ ...form, strokeCount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>File dữ liệu nét (SVG)</label>
                                <label className="upload-box">
                                    <input type="file" accept=".svg" hidden onChange={handleFileChange} />
                                    <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4" /><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
                                    <span>{form.strokeFile || 'Kéo thả file .svg hoặc bấm để chọn'}</span>
                                </label>
                                <p className="field-hint">
                                    Dùng file từ bộ <code>hangeul-stroke-order</code> — chứa sẵn class <code>.jamo</code>,{' '}
                                    <code>.stroke-number</code>, <code>.order-arrow</code> để hệ thống tự tô màu.
                                </p>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId === null ? 'Thêm ký tự' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCharacter;