import React, {useEffect, useMemo, useState} from 'react';
import './AdminExercise.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePatch} from "../../../components/use/usePatch.js";
import {usePost} from "../../../components/use/usePost.js";
import {useDelete} from "../../../components/use/useDelete.js";

const EMPTY_OPTIONS = ['', '', '', ''];

const INITIAL_QUESTIONS = [
    { id: 1, lesson: 'vowel-basic', question: "Đâu là nguyên âm đọc là 'a'?", options: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'], correct: 0 },
];

const EMPTY_FORM = { quizId: '', question: '', questionMediaUrl: '', options: [...EMPTY_OPTIONS], correct: 0, isAudio: false, questionAudio: false };

const AdminExercise = () => {
    const {data: loadAdminQuiz} = useFetch(`${API_URL}/admin/get-quizzes`);
    const {data: loadAdminQuestions} = useFetch(`${API_URL}/admin/get-questions`);
    const mapQuizRes = (quiz) => ({
        id: quiz?.id,
        name: quiz?.name,
    });
    const mapQuesRes = (q) => ({
        id: q?.id,
        quizId: q?.quizId,
        question: q?.question,
        options: q?.options,
        correct: q?.options.find((opt) => opt?.correct === true)?.id,
        audio: q?.audio,
        questionAudio: q?.questionAudio,
        questionMediaUrl: q?.questionMediaUrl
    });
    const quizRes = loadAdminQuiz.map(mapQuizRes);
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        setQuestions(loadAdminQuestions.map(mapQuesRes));
    }, [loadAdminQuestions]);

    // Delete Quiz
    const {executeDelete: deleteQuiz} = useDelete(`${API_URL}/quiz/delete`);
    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá bộ câu hỏi này?")) return;
        try {
            const data = await deleteQuiz({quizId: quizId});
            if (data) {
                alert("Xoá bộ câu hỏi mới thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Delete Quiz", e);
        }
    }

    // Handle Quiz size
    const handleQuizSize = (quizId) => {
        return questions.filter(q => q.quizId === quizId).length;
    }

    // Handle Add New Quiz
    const [openAddModalQuiz, setOpenAddModalQuiz] = useState(false);
    const [nameQuiz, setNameQuiz] = useState('');
    const {executePost: addNewQuiz} = usePost(`${API_URL}/quiz/add-new-quiz`);
    const handleSubmitNameQuiz = async () => {
        try {
            const data = await addNewQuiz({nameQuiz: nameQuiz});
            if (data) {
                alert("Thêm bộ câu hỏi mới thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Add New Quiz", e);
        }
    }

    // Handle Stat
    const stats = [
        {name: "Tổng số câu hỏi", amount: questions.length, icon: "total", tone: "tone-a"},
        {name: "Bộ câu hỏi", amount: quizRes.length, icon: "lesson", tone: "tone-b"},
        {name: "TB câu hỏi / bộ câu hỏi", amount: (questions.length / quizRes.length).toFixed(2), icon: "avg", tone: "tone-c"},
    ];
    const iconStatRows = {
        total: (
            <svg viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
        ),
        lesson: (
            <svg viewBox="0 0 24 24">
                <path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" />
                <path d="M17 3v16" />
            </svg>
        ),
        avg: (
            <svg viewBox="0 0 24 24">
                <path d="M4 20V10" />
                <path d="M12 20V4" />
                <path d="M20 20v-7" />
            </svg>
        ),
        cate: (
            <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
        )
    };

    // Handle Quiz Name
    const handleQuizName = (quizId) => {
        return quizRes.find(q => q?.id === quizId)?.name;
    }

    // Handle Filter
    const [search, setSearch] = useState("");
    const [lessonFilter, setLessonFilter] = useState(0);
    const filtered = useMemo(() => {
        return questions.filter((q) => {
            const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
            const matchesLesson = lessonFilter === 0 || q.quizId === lessonFilter;
            return matchesSearch && matchesLesson;
        });
    }, [questions, search, lessonFilter]);

    // Open Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const openAddModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setModalOpen(true);
    }

    const openEditModal = (q) => {
        setEditingId(q.id);
        setForm(mapQuesRes(q));
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const updateCorrect = (index, optId) => {
        if (editingId !== null) setForm({ ...form, correct: optId });
        else setForm({...form, correct: index});
    }

    const updateOption = (index, value) => {
        const next = [...form.options];
        next[index] = {...next[index], optionText: value};
        setForm({ ...form, options: next });
    }

    // Handle Update Question
    const {executePatch: handleUpdateQuestion} = usePatch(`${API_URL}/admin/update-question`);
    const {executePost: handleCreateQuestion} = usePost(`${API_URL}/admin/create-question`);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (form.question.trim() || form.options.some((o) => !o.trim())) return;

        if (editingId !== null) {
            const req = {
                id: editingId,
                quizId: form?.quizId,
                question: form?.question,
                questionMediaUrl: form?.questionMediaUrl,
                correct: form?.correct,
                options: form?.options,
                isAudio: form?.audio,
                isQuestionAudio: form?.questionAudio
            }
            try {
                const data = await handleUpdateQuestion(req);
                if (data) {
                    alert("Cập nhật câu hỏi thành công.");
                    window.location.reload();
                }
            } catch (e) {
                console.log("Error Update Question", e);
            }
        }

        if (editingId === null) {
            const req = {
                quizId: form.quizId,
                question: form.question.trim(),
                questionMediaUrl: '',
                correct: form.correct,
                options: form.options,
                isAudio: form?.audio
            }
            try {
                const data = await handleCreateQuestion(req);
                if (data) {
                    alert("Tạo câu hỏi thành công.");
                    window.location.reload();
                }
            } catch (e) {
                console.log("Error Create Question", e);
            }
        }
    }

    // Delete Question
    const {executeDelete: handleDeleteQuestion} = useDelete(`${API_URL}/admin/delete-question`);
    const deleteQuestion = async (id) => {
        if (!window.confirm('Xóa câu hỏi này khỏi bài luyện tập?')) return;
        const req = {
            questionId: id
        }
        try {
            const data = await handleDeleteQuestion(req);
            if (data) {
                alert("Xoá câu hỏi thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Delete Question", e);
        }
    }

    // Spilt Text
    const truncateText = (text, start = 5, end = 5) => {
        if (!text) return "";
        if (text.length <= start + end + 3) {
            return text;
        }
        return `${text.slice(0, start)}...${text.slice(-end)}`;
    };

    return (
        <div id="admin-exercises">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Quản lý bài luyện tập</h1>
                    <p>Câu hỏi trắc nghiệm dùng để kiểm tra kiến thức sau mỗi bài học.</p>
                </div>

                <div>
                    <button className="btn btn-ghost" onClick={() => setOpenAddModalQuiz(!openAddModalQuiz)}
                        style={{marginRight: '10px'}}
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Thêm/Sửa bộ câu hỏi
                    </button>

                    <button className="btn btn-primary" onClick={openAddModal}>
                        <svg viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Thêm câu hỏi
                    </button>
                </div>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                {stats.map((s, index) => (
                    <div key={index} className="card stat-card">
                        <div className={`stat-icon ${s.tone}`}>
                            {iconStatRows[s.icon]}
                        </div>

                        <div>
                            <div className="stat-num">{s.amount}</div>
                            <div className="stat-label">{s.name}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------------- TOOLBAR ---------------- */}
            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.3-4.3" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Tìm theo nội dung câu hỏi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select value={lessonFilter} onChange={(e) => setLessonFilter(Number(e.target.value))}>
                    <option value={0}>Tất cả bộ câu hỏi</option>
                    {loadAdminQuiz.map((l) => (
                        <option key={l?.id} value={l?.id}>{l?.name}</option>
                    ))}
                </select>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Câu hỏi</th>
                        <th>Đáp án</th>
                        <th>Thuộc bộ câu hỏi</th>
                        <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((q, index) => (
                        <tr key={q?.id}>
                            <td>{index + 1}</td>
                            <td className="question-cell">{truncateText(q?.question)}</td>
                            <td>
                                <div className="options-preview">
                                    {q.options.map((opt) => (
                                        <span key={opt?.id} className={`option-chip ${opt?.id === q.correct ? 'correct' : ''}`}>
                                        {truncateText(opt?.optionText)}
                                      </span>
                                    ))}
                                </div>
                            </td>
                            <td><span className="lesson-badge">{truncateText(handleQuizName(q?.quizId))}</span></td>
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
                                <label>Thuộc bộ câu hỏi</label>
                                <select value={form.quizId}
                                        onChange={(e) => setForm({...form, quizId: Number(e.target.value)})}
                                        required
                                >
                                    <option value=''>Chọn bộ câu hỏi</option>
                                    {loadAdminQuiz.map((l) => (
                                        <option key={l?.id} value={l?.id}>{l?.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '8px'}}>
                                    <label>Câu hỏi</label>
                                    <div className="audio-toggle">
                                        <span>Dạng âm thanh</span>
                                        <button
                                            type="button"
                                            className={`toggle-switch ${form?.questionAudio ? 'active' : ''}`}
                                            onClick={() => setForm({... form, questionAudio: !form.questionAudio})}
                                            aria-label="Bật tắt dạng âm thanh"
                                        >
                                            <span className="toggle-thumb"></span>
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    value={form.question}
                                    style={{marginBottom: '8px'}}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    placeholder="VD: Đâu là nguyên âm đọc là 'a'?"
                                    required
                                />

                                <input
                                    type="text"
                                    value={form.questionMediaUrl}
                                    disabled={!form?.questionAudio}
                                    onChange={(e) => setForm({ ...form, questionMediaUrl: e.target.value })}
                                    placeholder="Link âm thanh"
                                    required
                                />
                            </div>

                            <div className="field">
                                <div className="field-label-row">
                                    <label>Đáp án</label>
                                    <div className="audio-toggle">
                                        <span>Dạng âm thanh</span>
                                        <button
                                            type="button"
                                            className={`toggle-switch ${form?.audio ? 'active' : ''}`}
                                            onClick={() => setForm({... form, audio: !form.audio})}
                                            aria-label="Bật tắt dạng âm thanh"
                                        >
                                            <span className="toggle-thumb"></span>
                                        </button>
                                    </div>
                                </div>

                                <div className="options-form">
                                    {form.options.map((opt, i) => (
                                        <div className="option-row" key={i}>
                                            <button
                                                type="button"
                                                className={`radio-btn ${form.correct === opt?.id && editingId !== null ? 'checked' : 
                                                form.correct === i && editingId === null ? 'checked' : ''}`}
                                                onClick={() => updateCorrect(i, opt?.id)}
                                            >
                                                {(form.correct === i && editingId === null) && <span className="radio-dot" />}
                                                {(form.correct === opt?.id && editingId !== null) && <span className="radio-dot" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={opt?.optionText}
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

            {/*  Modal Add Quiz  */}
            {openAddModalQuiz && (
                <div className="modal-overlay" onClick={() => setOpenAddModalQuiz(!openAddModalQuiz)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h3>Thêm bộ câu hỏi mới</h3>

                        <div className="quiz-list">
                            <p className="quiz-list__title">Các bộ câu hỏi hiện có ({quizRes.length})</p>

                            <ul className="quiz-list__items">
                                {quizRes.map((quiz) => (
                                    <li key={quiz?.id} className="quiz-list__item">
                                        <span className="quiz-list__name">{quiz?.name} - ({handleQuizSize(quiz?.id)})</span>
                                        <button type="button" className="quiz-list__delete" title="Xóa" onClick={() => handleDeleteQuiz(quiz?.id)}>
                                            Xóa
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <form onSubmit={handleSubmitNameQuiz}>
                            <div className="field">
                                <input
                                    type="text"
                                    value={nameQuiz}
                                    onChange={(e) => setNameQuiz(e.target.value)}
                                    placeholder="VD: Trắc nghiệm ..."
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setOpenAddModalQuiz(!openAddModalQuiz)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">
                                    Thêm bộ câu hỏi
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