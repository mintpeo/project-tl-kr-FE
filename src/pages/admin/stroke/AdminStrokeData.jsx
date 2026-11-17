import React, {useEffect, useMemo, useState} from 'react';
import './AdminStrokeData.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";
import {usePutUploadFile} from "../../../components/use/usePut.js";

const AdminStrokeData = () => {
    const {data: getAllStroke} = useFetch(`${API_URL}/admin/all-stroke`);
    const mapStroke = (s) => ({
        id: s?.id ?? 0,
        svgRaw: s?.activePublicId,
        sourceFile: s?.activeUrl,
        note: s?.note,
        pendingPublicId: s?.pendingPublicId,
        pendingUrl: s?.pendingUrl,
        status: s?.status?.toLowerCase(),
        updatedAt: s?.updatedAt,
        glyph: s?.glyph,
        romanization: s?.romanization,
        declaredStrokes: s?.declaredStrokes,
        charId: s?.charId,
        options: s?.options,
        type: s?.type,
        double: s?.double
    });
    const [items, setItems] = useState([]);
    useEffect(() => {
        setItems(getAllStroke.map(mapStroke));
    }, [getAllStroke]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(file.name);
        }
    }

    const CATEGORY_OPTIONS = [
        { value: 'VOWEL', label: 'Nguyên âm' },
        { value: 'CONSONANT', label: 'Phụ âm' },
    ];

    const TYPE_OPTIONS = [
        {value: true, label: 'Đôi'},
        {value: false, label: 'Đơn'},
    ];

    const categoryLabel = (value) => {
        return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
    }

    const typeLabel = (value) => {
        return TYPE_OPTIONS.find((c) => c.value === value)?.label ?? value;
    }

    // Get Option Stroke Data
    const {data: loadOptionStrokeData} = useFetch(`${API_URL}/admin/all-option-stroke`);
    // Handle Check Change
    const {executePost: postCheckChange} = usePost(`${API_URL}/admin/handle-option-stroke`);
    const [strokeOptionData, setStrokeOptionData] = useState([]);
    const [noteDraft, setNoteDraft] = useState('');
    const handleCheckChange = async (option, value, itemId) => {
        const data = {
            id: option?.id,
            strokeId: itemId,
            content: option?.content,
            accepted: value
        };
        setStrokeOptionData((prev) => {
            const exists = prev.some((s) => s?.id === data?.id);
            if (exists) return prev.map((s) => (s?.id === data?.id ? {...s, accepted: value} : s));
            return [...prev, data];
        })
    }
    const currentSelected = (optionId) => {
        const cur = strokeOptionData.find((d) => d.id === optionId);
        return cur?.accepted;
    };

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [charDouble, setCharDouble] = useState('all');
    const [activeId, setActiveId] = useState(null);

    const filtered = useMemo(() => {
        return items.filter((it) => {
            const matchesSearch = it.glyph.includes(search) || it.romanization.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || it.status === statusFilter;
            const matchesCate = categoryFilter === 'all' || it.type === categoryFilter;
            const matchesChar = charDouble === 'all' || String(!!it.double) === charDouble;
            return matchesSearch && matchesStatus && matchesCate && matchesChar;
        });
    }, [items, search, statusFilter, categoryFilter, charDouble]);

    const stats = useMemo(() => ({
        total: items.length,
        verified: items.filter((i) => i.status === 'verified').length,
        pending: items.filter((i) => i.status === 'pending' || i.status === 'flagged').length,
        missing: items.filter((i) => i.status === 'missing').length,
    }), [items]);

    const activeItem = items.find((i) => i.id === activeId) ?? null;

    const [selectedItem, setSelectedItem] = useState();
    const [charId, setCharId] = useState();
    const openDetail = (item) => {
        setActiveId(item?.id);
        setCharId(item?.charId);
        setSelectedItem(item);
        setNoteDraft(item?.flagReason ?? '');
    }

    const closeDetail = () => {
        setActiveId(null);
        setStrokeOptionData([]);
        setStrokeOptionData(null);
        setPreviewUrl(null);
    }

    // Handle Upload File
    const {executePutUploadFile: uploadFileChar} = usePutUploadFile(`${API_URL}/admin/upload-pending`);
    const {executePost: handleActive} = usePost(`${API_URL}/admin/upload-active`);
    const [loadingUploadFile, setLoadingUploadFile] = useState(false);
    const handleUploadFile = async (e) => {
        // e.preventDefault();
        if (!selectedFile) {
            alert('Vui lòng chọn file ảnh trước.');
            return;
        }

        setLoadingUploadFile(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("charId", charId);

        const req = {
            charId: charId
        }

        try {
            const data = await uploadFileChar(formData);
            if (data === null) {
                alert("Tải ảnh mới lên không thành công.");
                return;
            }
            const active = await handleActive(req);
            if (active) {
                alert("Tải ảnh mới lên thành công.");
                setLoadingUploadFile(false);
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Upload Character", e);
        }
    }

    // const {executePost: handleActive, loading: loadingHandleActive} = usePost(`${API_URL}/admin/upload-active`);
    // const approve = async () => {
    //     if (strokeOptionData.length <= 0) {
    //         alert("Không để trống các mục Có/Không.");
    //         return;
    //     }
    //
    //     const req = {
    //         charId: selectedItem?.charId
    //     }
    //
    //     try {
    //         const check = await postCheckChange(strokeOptionData);
    //         if (!check) return;
    //         const data = await handleActive(req);
    //         if (data) {
    //             alert("Duyệt thành công.");
    //             window.location.reload();
    //         }
    //     } catch (e) {
    //         console.log("Error Check Change", e);
    //     }
    //     closeDetail();
    // }

    // Handle flag
    const {executePost: handleFlag} = usePost(`${API_URL}/admin/flag-stroke`);
    const flag = async () => {
        if (!noteDraft.trim()) {
            alert('Nhập lý do trước khi yêu cầu chỉnh sửa.');
            return;
        }

        const req = {
            id: activeId,
            note: noteDraft
        }
        try {
            const data = await handleFlag(req);
            if (data) {
                alert("Yêu cầu chỉnh sửa thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Handle Flag", e);
        }

        closeDetail();
    }

    const STATUS_LABEL = {
        verified: 'Đã duyệt',
        pending: 'Chờ duyệt',
        flagged: 'Cần chỉnh sửa',
        missing: 'Thiếu dữ liệu',
    };

    // Spite
    const formatStrokeId = (path) => {
        if (!path) return "—";
        return path.split("/").pop();
    }

    return (
        <div className="admin-stroke">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý dữ liệu thứ tự nét</h1>
                    <p>Xem trước và xác nhận file SVG thứ tự nét trước khi đưa vào sử dụng.</p>
                </div>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-icon tone-a"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg></div>
                    <div><div className="stat-num">{stats.total}</div><div className="stat-label">Tổng số ký tự</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-b"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg></div>
                    <div><div className="stat-num">{stats.verified}</div><div className="stat-label">Đã có dữ liệu</div></div>
                </div>
                {/*<div className="card stat-card">*/}
                {/*    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></div>*/}
                {/*    <div><div className="stat-num">{stats.pending}</div><div className="stat-label">Chờ duyệt / cần sửa</div></div>*/}
                {/*</div>*/}
                <div className="card stat-card">
                    <div className="stat-icon tone-d"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg></div>
                    <div><div className="stat-num">{stats.missing}</div><div className="stat-label">Thiếu dữ liệu</div></div>
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
                <select value={charDouble} onChange={(e) => setCharDouble(e.target.value)}>
                    <option value="all">Tất cả âm</option>
                    {TYPE_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="verified">Đã có dữ liệu</option>
                    {/*<option value="verified">Đã duyệt</option>*/}
                    {/*<option value="pending">Chờ duyệt</option>*/}
                    {/*<option value="flagged">Cần chỉnh sửa</option>*/}
                    <option value="missing">Thiếu dữ liệu</option>
                </select>
            </div>

            {/* ---------------- GRID ---------------- */}
            <div className="char-grid">
                {filtered.map((it, index) => (
                    <div className="char-card" key={index} onClick={() => openDetail(it)}>
                        <div className={`char-card-thumb status-${it.status}`}>
                            {it.svgRaw ? (
                                <div className="thumb-svg">
                                    <img src={it?.sourceFile} alt={it?.glyph}/>
                                </div>
                            ) : (
                                <span className="thumb-glyph">{it.glyph}</span>
                            )}
                        </div>
                        <div className="char-card-info">
                            <p className="info">{it.glyph} <span className="mono">· {it.romanization}</span></p>
                            {/*<span className={`status-badge ${it.status}`}>{STATUS_LABEL[it.status]}</span>*/}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="empty-state">Không tìm thấy ký tự phù hợp.</div>}
            </div>

            {/* ---------------- MODAL ---------------- */}
            {activeItem && (
                <div className="modal-overlay" onClick={closeDetail}>
                    <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <div className="modal-head-glyph">{selectedItem?.glyph}</div>

                            <div>
                                <h3>{selectedItem?.glyph} · {selectedItem?.romanization}</h3>
                                {/*<span className={`status-badge ${selectedItem?.status}`}>{STATUS_LABEL[selectedItem?.status]}</span>*/}
                            </div>

                            <button className="close-btn" onClick={closeDetail}>
                                <svg viewBox="0 0 24 24"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="detail-body">
                            <div className="preview-col">
                                {/*{selectedItem?.pendingUrl && (*/}
                                {/*    <div style={{justifyItems: "center"}}>*/}
                                {/*        <div className="svg-preview">*/}
                                {/*            <p>Ảnh mới</p>*/}
                                {/*            <img src={selectedItem?.pendingUrl} alt={selectedItem?.glyph}/>*/}
                                {/*        </div>*/}
                                {/*        <p>↓</p>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {selectedItem?.sourceFile ? (
                                    <div className="svg-preview">
                                        {/*{selectedItem?.pendingUrl && (<p>Ảnh cũ</p>)}*/}
                                        <img src={selectedItem?.sourceFile} alt={selectedItem?.glyph}/>
                                    </div>
                                ) : (
                                    <div className="no-preview">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 9v4m0 4h.01" />
                                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                        Chưa có file SVG để xem trước
                                    </div>
                                )}

                                <label className="upload-box" style={{marginTop: '18px'}}>
                                    <input type="file" accept=".svg" hidden onChange={handleFileChange} />
                                    <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4" /><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
                                    {previewUrl ? (<span>{`${formatStrokeId(selectedItem?.svgRaw)} -> ${previewUrl}`}</span>) : (
                                        <span>{formatStrokeId(selectedItem?.svgRaw) || 'Kéo thả file .svg hoặc bấm để chọn'}</span>
                                    )}
                                </label>
                            </div>

                            {/* ---- checklist + metadata ---- */}
                            <div className="info-col">
                                <div className="meta-row"><span>Kí tự</span><strong className="mono">{selectedItem?.glyph}</strong></div>
                                <div className="meta-row"><span>Cách đọc</span><strong className="mono">{selectedItem?.romanization}</strong></div>
                                <div className="meta-row"><span>Số nét khai báo</span><strong>{selectedItem?.declaredStrokes} nét</strong></div>
                                <div className="meta-row"><span>Danh mục</span><strong>{categoryLabel(selectedItem?.type)}</strong></div>
                                <div className="meta-row"><span>Âm</span><strong>{typeLabel(selectedItem?.double)}</strong></div>
                                <div className="meta-row"><span>File nguồn</span><strong className="mono">{formatStrokeId(selectedItem?.svgRaw)}</strong></div>
                                <div className="meta-row" style={{border: "none"}}><span>Cập nhật lần cuối</span><strong>{selectedItem?.updatedAt ?? '—'}</strong></div>

                                {/*{selectedItem?.status === 'verified' && (*/}
                                {/*    selectedItem?.options.map((option, index) => (*/}
                                {/*        <div key={index} className={`check-row ${index === loadOptionStrokeData.length - 1 && `last`}`}>*/}
                                {/*            <span className="check-item">{option?.content}</span>*/}

                                {/*            <div className="radio-group">*/}
                                {/*                <label className="radio-label">*/}
                                {/*                    <input*/}
                                {/*                        type="radio"*/}
                                {/*                        value="true"*/}
                                {/*                        name={option?.id}*/}
                                {/*                        checked={option?.accepted === true}*/}
                                {/*                        readOnly*/}
                                {/*                    />*/}
                                {/*                    Có*/}
                                {/*                </label>*/}

                                {/*                <label className="radio-label">*/}
                                {/*                    <input*/}
                                {/*                        type="radio"*/}
                                {/*                        value="false"*/}
                                {/*                        name={option?.id}*/}
                                {/*                        checked={option?.accepted === false}*/}
                                {/*                        readOnly*/}
                                {/*                    />*/}
                                {/*                    Không*/}
                                {/*                </label>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    ))*/}
                                {/*)}*/}

                                {/*{selectedItem?.status !== 'verified' && loadOptionStrokeData.map((option, index) => (*/}
                                {/*    <div key={index} className={`check-row ${index === loadOptionStrokeData.length - 1 && `last`}`}>*/}
                                {/*        <span className="check-item">{option?.content}</span>*/}

                                {/*        <div className="radio-group">*/}
                                {/*            <label className="radio-label">*/}
                                {/*                <input*/}
                                {/*                    type="radio"*/}
                                {/*                    value="true"*/}
                                {/*                    name={option?.id}*/}
                                {/*                    checked={currentSelected(option?.id) === true}*/}
                                {/*                    onChange={() => handleCheckChange(option, true, selectedItem?.id)}*/}
                                {/*                />*/}
                                {/*                Có*/}
                                {/*            </label>*/}

                                {/*            <label className="radio-label">*/}
                                {/*                <input*/}
                                {/*                    type="radio"*/}
                                {/*                    value="false"*/}
                                {/*                    name={option?.id}*/}
                                {/*                    checked={currentSelected(option?.id) === false}*/}
                                {/*                    onChange={() => handleCheckChange(option, false, selectedItem?.id)}*/}
                                {/*                />*/}
                                {/*                Không*/}
                                {/*            </label>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*))}*/}

                                {/*<div className="field">*/}
                                {/*    <label>Ghi chú (bắt buộc nếu yêu cầu chỉnh sửa)</label>*/}
                                {/*    <textarea*/}
                                {/*        rows={3}*/}
                                {/*        defaultValue={selectedItem?.note ?? ''}*/}
                                {/*        disabled={selectedItem?.status === 'verified'}*/}
                                {/*        onChange={(e) => setNoteDraft(e.target.value)}*/}
                                {/*        placeholder="VD: Thiếu mũi tên hướng nét, cần bổ sung..."*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <div className="modal-actions">
                                    {/*<button className="btn btn-danger-outline" onClick={flag}>Yêu cầu chỉnh sửa</button>*/}
                                    {/*<button onClick={approve} disabled={selectedItem?.status === 'verified'} className={`btn btn-primary ${loadingHandleActive ? `gs-btn-loading` : ``}`}*/}
                                    {/*        style={{display: "flex", alignItems: "center", justifyContent: "center"}}>*/}
                                    {/*    <span className="gs-btn-spinner"></span>*/}
                                    {/*    <span className="gs-btn-label" style={{marginLeft: '5px'}}>Duyệt dữ liệu</span>*/}
                                    {/*</button>*/}
                                    <button onClick={() => closeDetail()} className={"btn btn-danger"}>Huỷ</button>
                                    <button onClick={() => handleUploadFile()} className={`btn btn-primary ${loadingUploadFile ? `gs-btn-loading` : ``}`}>
                                        <span className="gs-btn-spinner"></span>
                                        <span className="gs-btn-label" style={{marginLeft: '5px'}}>Lưu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AdminStrokeData;