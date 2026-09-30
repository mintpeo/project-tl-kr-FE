import React, {useEffect, useMemo, useState} from 'react';
import './AdminStrokeData.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";

const STATUS_LABEL = {
    verified: 'Đã duyệt',
    pending: 'Chờ duyệt',
    flagged: 'Cần chỉnh sửa',
    missing: 'Thiếu dữ liệu',
};

// Bỏ dòng <?xml ...?> ở đầu file — không hợp lệ khi nhúng trực tiếp vào DOM
// (đúng lỗi InvalidCharacterError đã gặp ở Stroke.jsx trước đây).
function stripXmlDeclaration(raw) {
    return raw ? raw.replace(/<\?xml[^>]*\?>/, '') : raw;
}

// Kiểm tra cấu trúc file bằng cách tìm class name trong chuỗi SVG thô —
// đơn giản nhưng đủ dùng để phát hiện file thiếu thành phần trước khi duyệt.
function validateSvgStructure(svgRaw) {
    if (!svgRaw) return { hasJamo: false, hasNumber: false, hasArrow: false };
    return {
        hasJamo: svgRaw.includes('class="jamo"'),
        hasNumber: svgRaw.includes('class="stroke-number"'),
        hasArrow: svgRaw.includes('class="order-arrow"'),
    };
}

/* ============================================================
   COMPONENT
   ============================================================ */
export default function AdminStrokeData() {
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
    });
    const [items, setItems] = useState([]);
    useEffect(() => {
        setItems(getAllStroke.map(mapStroke));
    }, [getAllStroke]);

    // Get Option Stroke Data
    const {data: loadOptionStrokeData} = useFetch(`${API_URL}/admin/all-option-stroke`);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeId, setActiveId] = useState(null);
    const [noteDraft, setNoteDraft] = useState('');

    const filtered = useMemo(() => {
        return items.filter((it) => {
            const matchesSearch = it.glyph.includes(search) || it.romanization.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || it.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, search, statusFilter]);

    const stats = useMemo(() => ({
        total: items.length,
        verified: items.filter((i) => i.status === 'verified').length,
        pending: items.filter((i) => i.status === 'pending' || i.status === 'flagged').length,
        missing: items.filter((i) => i.status === 'missing').length,
    }), [items]);

    const activeItem = items.find((i) => i.id === activeId) ?? null;

    function openDetail(item) {
        setActiveId(item.id);
        setNoteDraft(item.flagReason ?? '');
    }
    function closeDetail() {
        setActiveId(null);
    }

    function setStatus(id, status, reason) {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, status, flagReason: reason ?? it.flagReason, updatedAt: 'Vừa xong' } : it))
        );
    }

    function approve() {
        setStatus(activeItem.id, 'verified', undefined);
        closeDetail();
    }
    function flag() {
        if (!noteDraft.trim()) {
            alert('Nhập lý do trước khi yêu cầu chỉnh sửa.');
            return;
        }
        setStatus(activeItem.id, 'flagged', noteDraft.trim());
        closeDetail();
    }

    // Spite
    const formatStrokeId = (path) => {
        if (!path) return "—";
        return path.split("/").pop();
    }

    // Modal
    const StrokeDetailModal = ({ item, noteDraft, onNoteChange, onApprove, onFlag, onClose }) => {
        const hasFile = Boolean(item.svgRaw);
        const hasFilePending = Boolean(item.pendingPublicId);
        const check = validateSvgStructure(item.svgRaw);
        const allValid = check.hasJamo && check.hasNumber && check.hasArrow;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                        <div className="modal-head-glyph">{item.glyph}</div>
                        <div>
                            <h3>{item.glyph} · {item.romanization}</h3>
                            <span className={`status-badge ${item.status}`}>{STATUS_LABEL[item.status]}</span>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <svg viewBox="0 0 24 24"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="detail-body">
                        {/* ---- preview tĩnh ---- */}
                        <div className="preview-col">
                            {hasFile ? (
                                <div className="svg-preview">
                                    <img src={item?.sourceFile} alt={item?.glyph}/>
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

                            {hasFilePending && (
                                <div style={{justifyItems: "center"}}>
                                    <p>↓</p>
                                    <div className="svg-preview">
                                        <img src={item?.pendingUrl} alt={item?.glyph}/>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ---- checklist + metadata ---- */}
                        <div className="info-col">
                            <div className="meta-row"><span>Số nét khai báo</span><strong>{item.declaredStrokes} nét</strong></div>
                            <div className="meta-row"><span>File nguồn</span><strong className="mono">{formatStrokeId(item?.svgRaw)}</strong></div>
                            <div className="meta-row"><span>Cập nhật lần cuối</span><strong>{item.updatedAt ?? '—'}</strong></div>

                            <div className="checklist">
                                <div className={`check-item ${check.hasJamo ? 'ok' : 'bad'}`}>
                                    <CheckIcon ok={check.hasJamo} />
                                    Có group <code>.jamo</code> (hình chữ)
                                </div>
                                <div className={`check-item ${check.hasNumber ? 'ok' : 'bad'}`}>
                                    <CheckIcon ok={check.hasNumber} />
                                    Có group <code>.stroke-number</code> (số thứ tự)
                                </div>
                                <div className={`check-item ${check.hasArrow ? 'ok' : 'bad'}`}>
                                    <CheckIcon ok={check.hasArrow} />
                                    Có <code>.order-arrow</code> (mũi tên hướng nét)
                                </div>
                            </div>

                            <div className="field">
                                <label>Ghi chú (bắt buộc nếu yêu cầu chỉnh sửa)</label>
                                <textarea
                                    rows={3}
                                    value={noteDraft}
                                    onChange={(e) => onNoteChange(e.target.value)}
                                    placeholder="VD: Thiếu mũi tên hướng nét, cần bổ sung..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-danger-outline" onClick={onFlag}>Yêu cầu chỉnh sửa</button>
                                <button className="btn btn-primary" onClick={onApprove} disabled={!allValid}>Duyệt dữ liệu</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    <div><div className="stat-num">{stats.verified}</div><div className="stat-label">Đã duyệt</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></div>
                    <div><div className="stat-num">{stats.pending}</div><div className="stat-label">Chờ duyệt / cần sửa</div></div>
                </div>
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
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="verified">Đã duyệt</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="flagged">Cần chỉnh sửa</option>
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
                            <p>{it.glyph} <span className="mono">· {it.romanization}</span></p>
                            <span className={`status-badge ${it.status}`}>{STATUS_LABEL[it.status]}</span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="empty-state">Không tìm thấy ký tự phù hợp.</div>}
            </div>

            {/* ---------------- MODAL CHI TIẾT / DUYỆT ---------------- */}
            {activeItem && (
                <StrokeDetailModal
                    item={activeItem}
                    noteDraft={noteDraft}
                    onNoteChange={setNoteDraft}
                    onApprove={approve}
                    onFlag={flag}
                    onClose={closeDetail}
                />
            )}
        </div>
    );
}

/* ============================================================
   MODAL: xem SVG tĩnh + checklist cấu trúc file
   ============================================================ */

function CheckIcon({ ok }) {
    return ok ? (
        <svg viewBox="0 0 24 24" className="ic ok"><path d="M20 6L9 17l-5-5" /></svg>
    ) : (
        <svg viewBox="0 0 24 24" className="ic bad"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
    );
}