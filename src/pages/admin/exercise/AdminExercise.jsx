import React, { useMemo, useState } from 'react';
import './AdminExercise.css';

/* ============================================================
   DỮ LIỆU MẪU — thay bằng dữ liệu thật từ API /api/admin/exercises
   "lessonId" nên khớp với id bài học trong AdminLessons.jsx thật.
   ============================================================ */
const LESSON_OPTIONS = [
    { value: 'vowel-basic', label: 'Nguyên âm cơ bản' },
    { value: 'consonant-basic', label: 'Phụ âm cơ bản' },
    { value: 'syllable-combine', label: 'Âm tiết ghép' },
];

const EMPTY_OPTIONS = ['', '', '', ''];

const INITIAL_QUESTIONS = [
    { id: 1, lesson: 'vowel-basic', question: "Đâu là nguyên âm đọc là 'a'?", options: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'], correct: 0 },
    { id: 2, lesson: 'vowel-basic', question: "Đâu là nguyên âm đọc là 'eo'?", options: ['ㅕ', 'ㅓ', 'ㅑ', 'ㅛ'], correct: 1 },
    { id: 3, lesson: 'vowel-basic', question: "Đâu là nguyên âm đọc là 'u'?", options: ['ㅡ', 'ㅣ', 'ㅜ', 'ㅠ'], correct: 2 },
    { id: 4, lesson: 'vowel-basic', question: "Nguyên âm 'ㅣ' có bao nhiêu nét viết?", options: ['1 nét', '2 nét', '3 nét', '4 nét'], correct: 0 },
    { id: 5, lesson: 'consonant-basic', question: "Đâu là phụ âm đọc là 'nieun'?", options: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'], correct: 1 },
    { id: 6, lesson: 'consonant-basic', question: "Phụ âm 'ㄱ' có bao nhiêu nét viết?", options: ['1 nét', '2 nét', '3 nét', '4 nét'], correct: 0 },
    { id: 7, lesson: 'syllable-combine', question: "ㄱ + ㅏ ghép thành chữ nào?", options: ['가', '나', '다', '사'], correct: 0 },
];

function lessonLabel(value) {
    return LESSON_OPTIONS.find((l) => l.value === value)?.label ?? value;
}

const EMPTY_FORM = { lesson: 'vowel-basic', question: '', options: [...EMPTY_OPTIONS], correct: 0 };

/* ============================================================
   COMPONENT
   ============================================================ */
const AdminExercise = () => {
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [search, setSearch] = useState('');
    const [lessonFilter, setLessonFilter] = useState('all');

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const filtered = useMemo(() => {
        return questions.filter((q) => {
            const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
            const matchesLesson = lessonFilter === 'all' || q.lesson === lessonFilter;
            return matchesSearch && matchesLesson;
        });
    }, [questions, search, lessonFilter]);

    const stats = useMemo(() => {
        const byLesson = {};
        questions.forEach((q) => { byLesson[q.lesson] = (byLesson[q.lesson] || 0) + 1; });
        return {
            total: questions.length,
            lessonCount: Object.keys(byLesson).length,
            avgPerLesson: Object.keys(byLesson).length
                ? Math.round(questions.length / Object.keys(byLesson).length)
                : 0,
        };
    }, [questions]);

    function openAddModal() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    }

    function openEditModal(q) {
        setEditingId(q.id);
        setForm({ lesson: q.lesson, question: q.question, options: [...q.options], correct: q.correct });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
    }

    function updateOption(index, value) {
        const next = [...form.options];
        next[index] = value;
        setForm({ ...form, options: next });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.question.trim() || form.options.some((o) => !o.trim())) return;

        if (editingId === null) {
            const newQ = {
                id: Math.max(0, ...questions.map((q) => q.id)) + 1,
                lesson: form.lesson,
                question: form.question.trim(),
                options: form.options.map((o) => o.trim()),
                correct: form.correct,
            };
            setQuestions((prev) => [newQ, ...prev]);
        } else {
            setQuestions((prev) =>
                prev.map((q) => (q.id === editingId ? { ...q, ...form } : q))
            );
        }
        setModalOpen(false);
    }

    function deleteQuestion(id) {
        if (!window.confirm('Xóa câu hỏi này khỏi bài luyện tập?')) return;
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    }

    return (
        <div className="admin-exercises">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý bài luyện tập</h1>
                    <p>Câu hỏi trắc nghiệm dùng để kiểm tra kiến thức sau mỗi bài học.</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    Thêm câu hỏi
                </button>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                <div className="card stat-card">
                    <div className="stat-icon tone-a"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg></div>
                    <div><div className="stat-num">{stats.total}</div><div className="stat-label">Tổng số câu hỏi</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-b"><svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></svg></div>
                    <div><div className="stat-num">{stats.lessonCount}</div><div className="stat-label">Bài học có luyện tập</div></div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon tone-c"><svg viewBox="0 0 24 24"><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></svg></div>
                    <div><div className="stat-num">{stats.avgPerLesson}</div><div className="stat-label">TB câu hỏi / bài học</div></div>
                </div>
            </div>

            {/* ---------------- TOOLBAR ---------------- */}
            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Tìm theo nội dung câu hỏi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select value={lessonFilter} onChange={(e) => setLessonFilter(e.target.value)}>
                    <option value="all">Tất cả bài học</option>
                    {LESSON_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                </select>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>Câu hỏi</th>
                        <th>Thuộc bài học</th>
                        <th>Đáp án</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((q) => (
                        <tr key={q.id}>
                            <td className="question-cell">{q.question}</td>
                            <td><span className="lesson-badge">{lessonLabel(q.lesson)}</span></td>
                            <td>
                                <div className="options-preview">
                                    {q.options.map((opt, i) => (
                                        <span key={i} className={`option-chip ${i === q.correct ? 'correct' : ''}`}>
                        {opt}
                      </span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <div className="row-actions">
                                    <button className="icon-btn" title="Chỉnh sửa" onClick={() => openEditModal(q)}>
                                        <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></svg>
                                    </button>
                                    <button className="icon-btn danger" title="Xóa" onClick={() => deleteQuestion(q.id)}>
                                        <svg viewBox="0 0 24 24"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" /></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={4} className="empty-row">Không tìm thấy câu hỏi phù hợp.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ---------------- MODAL THÊM/SỬA ---------------- */}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId === null ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label>Thuộc bài học</label>
                                <select value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })}>
                                    {LESSON_OPTIONS.map((l) => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Câu hỏi</label>
                                <input
                                    type="text"
                                    value={form.question}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    placeholder="VD: Đâu là nguyên âm đọc là 'a'?"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label>Đáp án (chọn nút tròn để đánh dấu đáp án đúng)</label>
                                <div className="options-form">
                                    {form.options.map((opt, i) => (
                                        <div className="option-row" key={i}>
                                            <button
                                                type="button"
                                                className={`radio-btn ${form.correct === i ? 'checked' : ''}`}
                                                onClick={() => setForm({ ...form, correct: i })}
                                            >
                                                {form.correct === i && <span className="radio-dot" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(i, e.target.value)}
                                                placeholder={`Đáp án ${i + 1}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId === null ? 'Thêm câu hỏi' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminExercise;