import React, {useEffect, useState} from 'react';
import './AdminCharacter.css';
import {API_URL} from "../../../components/API_URL.jsx";
import useFetch from "../../../components/use/useFetch.js";
import {usePost} from "../../../components/use/usePost.js";
import {usePutUploadFile} from "../../../components/use/usePut.js";
import BtnSpinner from "../../../components/loading/BtnSpinner.jsx";

const CATEGORY_OPTIONS = [
    { value: 'VOWEL', label: 'Nguyên âm' },
    { value: 'CONSONANT', label: 'Phụ âm' },
];

const TYPE_OPTIONS = [
    {value: true, label: 'Đôi'},
    {value: false, label: 'Đơn'},
];

const EMPTY_FORM = { name: '', transcription: '', type: 'VOWEL', double: false, strokeCount: '', imgUrl: '', fileName: '' };

const AdminCharacter = () => {
    const {data: getAllChars} = useFetch(`${API_URL}/admin/all-char`);
    const mapChars = (char) => ({
        id: char?.id,
        double: char?.double,
        name: char?.name,
        strokeCount: char?.strokeCount,
        imgUrl: char?.imgUrl,
        transcription: char?.transcription,
        type: char?.type,
        fileName: char?.fileName,
        status: char?.status,
        pendingUrl: char?.pendingUrl,
        pendingPublicId: char?.pendingPublicId,
    });
    const charsRes = getAllChars.map(mapChars);
    const [chars, setChars] = useState([]);

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    // Upload File Character
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(file.name);
        }
    }
    // Handle Upload File
    const {executePutUploadFile: uploadFileChar, loading: loadingUploadFileChar} = usePutUploadFile(`${API_URL}/admin/upload-pending`);
    const handleUploadFile = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Vui lòng chọn file ảnh trước.');
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("charId", editingId);
        try {
            const data = await uploadFileChar(formData);
            if (data !== null) {
                alert("Tải ảnh mới lên thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Upload Character", e);
        }
    }

    // Field Change
    const handleFieldChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    }
    // console.log(form);

    const openEditModal = (item) => {
        setEditingId(item.id);
        setForm(mapChars(item));
        setModalOpen(true);
    }
    const closeModal = () => {
        setModalOpen(false);
    }

    // Handle Edit
    const {executePost: handleEdit} = usePost(`${API_URL}/admin/edit-char`);
    const handleEditChar = async (e) => {
        e.preventDefault();

        const req = {
            charId: editingId,
            name: form.name,
            transcription: form.transcription,
            isDouble: form.double,
            type: form.type,
            strokeCount: form.strokeCount
        }

        try {
            const data = await handleEdit(req);
            if (data) {
                alert("Cập nhật thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Edit Character", e);
        }
    }

    // Filter, Search
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [strokeFilter, setStrokeFilter] = useState('all'); // all | has | missing
    const {executePost: handleSearch} = usePost(`${API_URL}/admin/search-char`);
    useEffect(() => {
        const timer = setTimeout(async () => {
            let baseList = [...charsRes];

            if (search.trim()) {
                try {
                    const data = await handleSearch({keyword: search});
                    baseList = Array.isArray(data) ? data.map(mapChars) : [];
                    setChars(baseList);
                } catch (e) {
                    console.log("Error Search", e);
                }
            }

            let list = [...baseList];

            if (strokeFilter === 'has') list = list.filter(char => char.imgUrl !== null);
            else if (strokeFilter === 'missing') list = list.filter(char => char.imgUrl === null);

            if (categoryFilter === 'VOWEL') list = list.filter(char => char.type === 'VOWEL');
            else if (categoryFilter === 'CONSONANT') list = list.filter(char => char.type === 'CONSONANT');

            setChars(list);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, categoryFilter, strokeFilter, getAllChars]);

    // Category Table
    const categoryLabel = (value) => {
        return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value;
    }

    // Handle Stat
    const vowelsLength = charsRes.filter(char => char.type === "VOWEL").length;
    const consonantsLength = charsRes.filter(char => char.type === "CONSONANT").length;
    // Stat Row
    const statRows = [
        {name: "Tổng số ký tự", amount: charsRes.length, icon: "chars", tone: "tone-a"},
        {name: "Nguyên âm", amount: vowelsLength, icon: "vowels", tone: "tone-b"},
        {name: "Phụ âm", amount: consonantsLength, icon: "consonants", tone: "tone-c"},
        // {name: "Thiếu dữ liệu nét", amount: "", icon: "cate", tone: "tone-d"},
    ];
    const iconStatRows = {
        chars: (
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
        ),
        vowels: (
            <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></svg>
        ),
        consonants: (
            <svg viewBox="0 0 24 24"><path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
        ),
        notFound: (
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
        )
    };

    // Spite
    const formatStrokeId = (path) => {
        if (!path) return "";
        return path.split("/").pop();
    }

    return (
        <div className="admin-chars">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý ký tự tiếng Hàn</h1>
                    <p>Danh sách nguyên âm, phụ âm và âm tiết cùng dữ liệu thứ tự nét viết tương ứng.</p>
                </div>
            </div>

            {/* ---------------- STATS ---------------- */}
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

            {/* ---------------- TOOLBAR ---------------- */}
            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                    </svg>

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
                        <th>STT</th>
                        <th>Ký tự</th>
                        <th>Cách đọc</th>
                        <th style={{whiteSpace: "nowrap"}}>Danh mục</th>
                        <th style={{whiteSpace: "nowrap"}}>Số nét</th>
                        <th>Hình ảnh</th>
                        <th>Dữ liệu nét</th>
                        <th>Trạng thái</th>
                        <th>Âm</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chars.map((c, index) => (
                        <tr key={c.id}>
                            <td>{index + 1}</td>
                            <td><div className="glyph-cell">{c.name}</div></td>
                            <td className="mono">|{c.transcription}|</td>
                            <td style={{whiteSpace: "nowrap"}}><span className={`category-badge ${c.type}`}>{categoryLabel(c.type)}</span></td>
                            <td className="mono">{c.strokeCount > 0 ? `${c.strokeCount} nét` : ``}</td>
                            <td>
                                {c?.imgUrl ? (
                                    <div style={{display: "flex", alignItems: "center", gap: '10px'}}>
                                        <span className="stroke-badge has"><img src={c?.imgUrl} alt={c?.name}/></span>
                                        {c?.status === 'PENDING' && (
                                            <>
                                                <p>&rarr;</p>
                                                <span className="stroke-badge has">
                                                    <img src={c?.pendingUrl} alt={c?.name}/>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{display: "flex", alignItems: "center", gap: '10px'}}>
                                        <span className="stroke-badge missing">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 9v4m0 4h.01" />
                                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                            </svg>
                                            Chưa có
                                        </span>
                                        {c?.status === 'PENDING' && (
                                            <>
                                                <p>&rarr;</p>
                                                <span className="stroke-badge has">
                                                    <img src={c?.pendingUrl} alt={c?.name}/>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td>
                                <div style={{display: "flex", alignItems: "center", gap: '10px'}}>
                                    <span className="stroke-badge has">{formatStrokeId(c?.fileName)}</span>
                                    {c?.status === 'PENDING' && (
                                        <>
                                            <p>&rarr;</p>
                                            <span className="stroke-badge has">
                                                {formatStrokeId(c?.pendingPublicId)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </td>
                            <td><span className="stroke-badge">{c?.status}</span></td>
                            <td className="mono">{c.double ? `Đôi` : `Đơn`}</td>
                            <td>
                                <div className="row-actions">
                                    <button className="icon-btn" title="Chỉnh sửa" onClick={() => openEditModal(c)}>
                                        <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                    </button>

                                    {/*<button className="icon-btn danger" title="Xóa" onClick={() => deleteChar(c.id)}>*/}
                                    {/*    <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>*/}
                                    {/*</button>*/}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {chars.length === 0 && (
                        <tr><td colSpan={6} className="empty-row">Không tìm thấy ký tự phù hợp.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ---------------- MODAL SỬA ---------------- */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Chỉnh sửa ký tự</h3>

                        <form onSubmit={handleUploadFile}>
                            <div className="field-row">
                                <div className="field" style={{ maxWidth: 100 }}>
                                    <label>Ký tự</label>
                                    <input
                                        type="text"
                                        className="glyph-input"
                                        disabled={true}
                                        value={form.name}
                                        maxLength={2}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Cách đọc</label>
                                    <input
                                        type="text"
                                        disabled={true}
                                        value={form.transcription}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Âm</label>
                                    <select
                                        value={String(form.double)}
                                        disabled={true}
                                    >
                                        {TYPE_OPTIONS.map((c) => (
                                            <option key={c.value} value={String(c.value)}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field">
                                    <label>Danh mục</label>
                                    <select
                                        value={form.type}
                                        disabled={true}
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
                                        disabled={true}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>File dữ liệu nét (SVG)</label>

                                <label className="upload-box">
                                    <input type="file" accept=".svg" hidden onChange={handleFileChange} />
                                    <svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4" /><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /></svg>
                                    {previewUrl ? (<span>{`${formatStrokeId(form?.fileName)} -> ${previewUrl}`}</span>) : (
                                        <span>{formatStrokeId(form?.fileName) || 'Kéo thả file .svg hoặc bấm để chọn'}</span>
                                    )}
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                                <BtnSpinner text={"Lưu thay đổi"} isLoading={loadingUploadFileChar} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCharacter;