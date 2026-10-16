import React, {useEffect, useMemo, useState} from 'react';
import './AdminSample.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePutUploadFile} from "../../../components/use/usePut.js";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import {useDelete} from "../../../components/use/useDelete.js";

/* ============================================================
   DỮ LIỆU MẪU — thay bằng dữ liệu thật từ API /api/admin/samples
   Mỗi ký tự có 1 mảng "samples" (nhiều ảnh chữ mẫu tham chiếu
   để AI so sánh khi chấm điểm nét viết của người học).
   ============================================================ */
const CATEGORY_OPTIONS = [
    { value: 'vowel', label: 'Nguyên âm' },
    { value: 'consonant', label: 'Phụ âm' },
];

/* ============================================================
   COMPONENT
   ============================================================ */
const AdminSample = () => {
    const {data: getAllTempChars} = useFetch(`${API_URL}/admin/all-temp`);
    const mapChars = (c) => ({
        id: c?.id,
        glyph: c?.glyph,
        romanization: c?.romanization,
        category: c?.category?.toLowerCase(),
        samples: c?.samples
    });
    const [chars, setChars] = useState([]);
    useEffect(() => {
        setChars(getAllTempChars.map(mapChars));
    }, [getAllTempChars]);

    const categoryLabel = (value) => {
        return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
    }

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sampleFilter, setSampleFilter] = useState('all'); // all | has | missing

    const [activeCharId, setActiveCharId] = useState(null); // ký tự đang mở panel quản lý mẫu

    const filtered = useMemo(() => {
        return chars.filter((c) => {
            const matchesSearch = c.glyph.includes(search) || c.romanization.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
            const matchesSample =
                sampleFilter === 'all' ||
                (sampleFilter === 'has' && c.samples.length > 0) ||
                (sampleFilter === 'missing' && c.samples.length === 0);
            return matchesSearch && matchesCategory && matchesSample;
        });
    }, [chars, search, categoryFilter, sampleFilter]);

    const stats = useMemo(() => {
        const totalSamples = chars.reduce((sum, c) => sum + c.samples.length, 0);
        const withSamples = chars.filter((c) => c.samples.length > 0).length;
        const missing = chars.filter((c) => c.samples.length === 0).length;
        return { totalSamples, withSamples, missing, totalChars: chars.length };
    }, [chars]);

    const activeChar = chars.find((c) => c.id === activeCharId) ?? null;

    // Add Char Temp
    const {executePutUploadFile: uploadCharTemp, loading: loadingUploadCharTemp} = usePutUploadFile(`${API_URL}/admin/upload-char-temp`);
    const addSample = async (charId, file) => {
        const label = file ? file.name : `Viết tay ${Math.floor(Math.random() * 90 + 10)}`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("charId", charId);
        try {
            const data = await uploadCharTemp(formData);
            if (data !== null) {
                alert("Tải lên ảnh mẫu thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Upload Character Temp", e);
        }
    }

    const {executeDelete: deleteChar, loading: loadingDeleteCharTemp} = useDelete(`${API_URL}/admin/delete-char-temp`);
    const removeSample = async (sampleId) => {
        const req = {
            id: sampleId
        }
        try {
            await deleteChar(req);
        } catch (e) {
            console.log("Error Delete Char Temp", e);
        }
        alert("Xoá ảnh mẫu thành công.");
        window.location.reload();
    }

    const handleFileInput = (e, charId) => {
        const file = e.target.files?.[0];
        if (file) addSample(charId, file);
        e.target.value = '';
    }

    return (
        <div id="admin-samples">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý chữ mẫu</h1>
                    <p>Ảnh chữ viết tham chiếu dùng để AI so sánh và chấm điểm nét viết của người học.</p>
                </div>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-icon tone-a"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg></div>
                    <div><div className="stat-num">{stats.totalSamples}</div><div className="stat-label">Tổng số chữ mẫu</div></div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon tone-b"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg></div>
                    <div>
                        <div className="stat-num">{stats.withSamples}/{stats.totalChars}</div>
                        <div className="stat-label">Ký tự đã có mẫu</div>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg></div>
                    <div><div className="stat-num">{stats.missing}</div><div className="stat-label">Ký tự chưa có mẫu</div></div>
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

                <select value={sampleFilter} onChange={(e) => setSampleFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="has">Đã có chữ mẫu</option>
                    <option value="missing">Chưa có chữ mẫu</option>
                </select>
            </div>

            {/* ---------------- GRID KÝ TỰ ---------------- */}
            <div className="char-grid">
                {filtered.map((c) => (
                    <div className="char-card" key={c.id} onClick={() => setActiveCharId(c.id)}>
                        <div className="char-card-thumb">
                            {c.samples.length > 0 ? (
                                <span className="thumb-glyph">{c.glyph}</span>
                            ) : (
                                <span className="thumb-glyph placeholder">{c.glyph}</span>
                            )}
                        </div>

                        <div className="char-card-info">
                            <p>{c.glyph} <span className="mono">· {c.romanization}</span></p>
                            <span className={`category-badge ${c.category}`}>
                                {categoryLabel(c.category)}
                            </span>
                        </div>

                        <div className={`sample-count ${c.samples.length === 0 ? 'zero' : ''}`}>
                            {c.samples.length} mẫu
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="empty-state">Không tìm thấy ký tự phù hợp.</div>
                )}
            </div>

            {/* ---------------- PANEL QUẢN LÝ MẪU CỦA 1 KÝ TỰ ---------------- */}
            {activeChar && (
                <div className="modal-overlay" onClick={() => setActiveCharId(null)}>
                    <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <div className="modal-head-glyph">{activeChar.glyph}</div>

                            <div>
                                <h3>{activeChar.glyph} · {activeChar.romanization}</h3>
                                <span className={`category-badge ${activeChar.category}`}>{categoryLabel(activeChar.category)}</span>
                            </div>

                            <button className="close-btn" onClick={() => setActiveCharId(null)}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 6L6 18" />
                                    <path d="M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="sample-grid">
                            {(loadingUploadCharTemp || loadingDeleteCharTemp) && (<Skeleton />)}
                            {!(loadingUploadCharTemp || loadingDeleteCharTemp) && (
                                <>
                                    {activeChar?.samples?.map((s) => (
                                        <div className="sample-tile" key={s.id}>
                                            <div className="sample-thumb">
                                                <img src={s?.imgUrl} alt={activeChar.glyph}/>
                                            </div>

                                            <div className="sample-info">
                                                <p>{s.label}</p>
                                                <span>{s.uploadedAt}</span>
                                            </div>

                                            <button className="sample-remove" onClick={() => removeSample(s.id)} title="Xóa mẫu này">
                                                <svg viewBox="0 0 24 24"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}

                                    {activeChar.samples.length < 3 && (
                                        <label className="sample-tile add-tile">
                                            <input type="file" accept="image/*" hidden onChange={(e) => handleFileInput(e, activeChar.id)} />
                                            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                                            <span>Thêm chữ mẫu</span>
                                        </label>
                                    )}
                                </>
                            )}
                        </div>

                        {activeChar.samples.length === 0 && (
                            <p className="empty-hint">
                                Ký tự này chưa có chữ mẫu nào — AI sẽ không thể chấm điểm chính xác cho tới khi có ít nhất 1 mẫu tham chiếu.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSample;