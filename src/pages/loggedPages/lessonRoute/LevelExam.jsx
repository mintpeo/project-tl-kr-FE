import React, { useEffect, useMemo, useRef, useState } from 'react';
import './LevelExam.css';
import { usePost } from "../../../components/use/usePost.js";
import { API_URL, LOCAL_STORAGE_KEYS } from "../../../components/API_URL.jsx";

const EXAM_CONFIG = {
    passPercent: 80,                         // % tối thiểu để đạt (BE trả "passed" thì ưu tiên BE)
    timeLimitSec: 600,                       // thời gian làm bài (giây) = 10 phút
    perChapter: { vowel: 5, consonant: 5 },  // số câu bốc từ mỗi chương
};

const EXAM_CHAPTERS = {
    vowel: 'Nguyên âm',
    consonant: 'Phụ âm',
};

// quizId của từng chương ở BE
const CHAPTER_QUIZ_ID = { vowel: 1, consonant: 2 };

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const fmtTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Props:
 *  - currentLevel / nextLevel : tên level hiện tại và level sẽ lên (hiển thị)
 *  - onPass(result)           : gọi khi bấm "Lên level mới" (gọi API nâng level ở đây)
 *  - onFinish(result)         : (tuỳ chọn) gọi mỗi khi BE chấm xong, đạt hay không
 *  - onClose()                : (tuỳ chọn) thoát về lộ trình
 *
 *  result = { correct, total, percent, passed, byChapter: { VOWEL: {correct,total}, ... } }
 */
export default function LevelExam({onFinish}) {
    const user = useMemo(() => {
        try { return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO)); }
        catch { return null; }
    }, []);

    useEffect(() => {
        handleLoadUserLevel();
        handleLoadLevelExam();
    }, []);

    const [levelExam, setLevelExam] = useState(null);
    const {executePost: loadLevelExam} = usePost(`${API_URL}/level-exam/get`);
    const handleLoadLevelExam = async () => {
        try {
            const data = await loadLevelExam({userId: user?.userId});
            setLevelExam(data);
        } catch (e) {
            console.log("Error Handle Load Level Exam", e);
        }
    }

    const [currentLevel, setCurrentLevel] = useState('');
    const [nextLevel, setNextLevel] = useState('');
    const {executePost: loadUserLevel} = usePost(`${API_URL}/user-level/get`);
    const handleLoadUserLevel = async () => {
        try {
            const data = await loadUserLevel({userId: user?.userId});
            setCurrentLevel(data?.userLevel);
            setNextLevel(data?.nextLevelTitle);
        } catch (e) {
            console.log("Error Handle Load User Level", e);
        }
    }

    const [view, setView] = useState('intro');          // intro | test | result
    const [exam, setExam] = useState([]);
    const [answers, setAnswers] = useState({});          // { [questionId]: optionId }
    const [current, setCurrent] = useState(0);
    const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.timeLimitSec);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const { executePost: loadQuestions } = usePost(`${API_URL}/quiz/get-quiz-id`);
    const { executePost: submitExam } = usePost(`${API_URL}/quiz/level-exam`);
    const [examBank, setExamBank] = useState({ vowel: [], consonant: [] });

    const mapQuestionRes = (q) => ({
        id: q?.id,
        question: q?.questionText,
        options: q?.options,
        audio: q?.audio,
        questionMediaUrl: q?.questionMediaUrl,
        questionAudio: q?.questionAudio
    });

    useEffect(() => {
        (async () => {
            try {
                const bank = {};
                for (const [chapter, quizId] of Object.entries(CHAPTER_QUIZ_ID)) {
                    const data = await loadQuestions({ quizId });
                    bank[chapter] = data?.questions?.map(mapQuestionRes) || [];
                }
                setExamBank(bank);
            } catch (e) {
                console.log("Error Load All Questions", e);
            }
        })();
        }, []);

    // Bốc câu hỏi từ mỗi chương, xáo câu và xáo đáp án
    const buildExam = () => {
        const picked = Object.entries(EXAM_CONFIG.perChapter).flatMap(([chapter, count]) =>
            shuffle(examBank[chapter] || []).slice(0, count).map((q) => ({ ...q, chapter }))
        );
        return shuffle(picked).map((q) => ({
            id: q.id,
            chapter: q.chapter,
            question: q.question,
            options: shuffle(q.options || []),
            audio: q?.audio,
            questionMediaUrl: q?.questionMediaUrl,
            questionAudio: q?.questionAudio
        }));
    };

    const totalQuestions = examBank.vowel.length + examBank.consonant.length;
    const answeredCount = Object.keys(answers).length;

    // Gửi danh sách đáp án lên BE để chấm
    const submit = async () => {
        if (submitting) return;
        setSubmitting(true);
        setSubmitError('');

        // Gửi đủ mọi câu của đề; câu chưa trả lời => optionId = null
        const req = {
            userId: user?.userId,
            answers: exam.map((q) => ({
                questionId: q.id,
                optionId: answers[q.id] ?? null,
                chapter: q.chapter.toUpperCase(),     // "VOWEL" | "CONSONANT"
            })),
        };

        try {
            const data = await submitExam(req);
            const percent = data?.percent ?? (data?.total ? Math.round((data.correct / data.total) * 100) : 0);
            const res = {
                correct: data?.correct ?? 0,
                total: data?.total ?? exam.length,
                percent,
                passed: data?.passed ?? percent >= EXAM_CONFIG.passPercent,
                byChapter: data?.byChapter || {},
            };
            setResult(res);
            setView('result');
            onFinish?.(res);
        } catch (e) {
            console.log("Error Submit Exam", e);
            setSubmitError('Nộp bài thất bại, vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    // Đếm ngược; hết giờ tự nộp (luôn gọi bản submit mới nhất)
    const submitRef = useRef(submit);
    submitRef.current = submit;
    useEffect(() => {
        if (view !== 'test') return;
        if (timeLeft <= 0) { submitRef.current(); return; }
        const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [view, timeLeft]);

    const start = () => {
        setLevelExam(null);
        setExam(buildExam());
        setAnswers({});
        setCurrent(0);
        setTimeLeft(EXAM_CONFIG.timeLimitSec);
        setResult(null);
        setSubmitError('');
        setView('test');
    };

    const handleSelect = (questionId, optionId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = () => {
        const left = exam.length - answeredCount;
        if (left > 0 && !window.confirm(`Bạn còn ${left} câu chưa trả lời. Vẫn nộp bài?`)) return;
        submit();
    };

    if (levelExam != null) {
        return (
            <div className="ex">
                <div className={`ex-panel ex-result ${levelExam.passed ? 'pass' : 'fail'}`}>
                    <span className="ex-eyebrow">{levelExam.passed ? 'Chúc mừng!' : 'Chưa đạt'}</span>
                    <div className="ex-score">{levelExam.percent}%</div>
                    <p className="ex-sub">
                        Đúng <strong>{levelExam.correct}</strong>/{levelExam.total} câu · Yêu cầu {EXAM_CONFIG.passPercent}%
                    </p>

                    <p className="ex-verdict">Hoàn thành vào: {levelExam?.completed}</p>

                    <div className="ex-actions">
                        <button className="ex-btn primary" onClick={() => {
                            setView('intro');
                            setLevelExam(null);
                        }}>Làm lại bài mới</button>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= GIỚI THIỆU ================= */
    if (view === 'intro') {
        return (
            <div className="ex">
                <div className="ex-panel ex-intro">
                    <span className="ex-eyebrow">Kiểm tra lại các kiến thức đã được học.</span>
                    <h2>Bài kiểm tra tổng hợp</h2>
                    {nextLevel != null &&
                        <p className="ex-sub">
                            Hoàn thành bài kiểm tra để lên <strong>{nextLevel}</strong>.
                        </p>
                    }

                    <div className="ex-level-path">
                        {nextLevel != null &&
                            <>
                                <span className="ex-level now">{currentLevel}</span>
                                <span className="ex-arrow">→</span>
                                <span className="ex-level next">{nextLevel}</span>
                            </>
                        }
                    </div>

                    <ul className="ex-rules">
                        <li><strong>{totalQuestions}</strong><span>câu trắc nghiệm</span></li>
                        <li><strong>{Math.round(EXAM_CONFIG.timeLimitSec / 60)}</strong><span>phút</span></li>
                        <li><strong>{EXAM_CONFIG.passPercent}%</strong><span>để đạt</span></li>
                    </ul>

                    <p className="ex-scope">
                        Nội dung: {Object.keys(EXAM_CONFIG.perChapter).map((k) => EXAM_CHAPTERS[k]).join(' · ')}
                    </p>
                    <p className="ex-note">Kết quả được chấm sau khi nộp bài. Hết giờ hệ thống tự nộp.</p>

                    <div className="ex-actions">
                        <button className="ex-btn primary" onClick={start}>Bắt đầu làm bài</button>
                    </div>
                </div>
            </div>
        );
    }

    /* ================= LÀM BÀI ================= */
    if (view === 'test') {
        const q = exam[current];
        if (!q) {
            return (
                <div className="ex">
                    <div className="ex-panel">
                        <p>Chưa có câu hỏi để làm bài.</p>
                        <div className="ex-actions">
                            <button className="ex-btn ghost" onClick={() => setView('intro')}>Quay lại</button>
                        </div>
                    </div>
                </div>
            );
        }
        const chosen = answers[q.id];
        const isLast = current === exam.length - 1;
        const lowTime = timeLeft <= 60;

        return (
            <div className="ex">
                <div className="ex-bar">
                    <span className="ex-chapter">{EXAM_CHAPTERS[q.chapter]}</span>
                    <span className={`ex-timer ${lowTime ? 'low' : ''}`}>{fmtTime(timeLeft)}</span>
                </div>

                <div className="ex-progress">
                    <div style={{ width: `${(answeredCount / exam.length) * 100}%` }} />
                </div>

                {/* Bảng số câu */}
                <div className="ex-nav" role="tablist" aria-label="Danh sách câu hỏi">
                    {exam.map((item, i) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`ex-dot ${i === current ? 'current' : ''} ${answers[item.id] !== undefined ? 'done' : ''}`}
                            onClick={() => setCurrent(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <div className="ex-panel">
                    <p className="ex-qno">Câu {current + 1} / {exam.length}</p>
                    <h3 className="ex-question">{q.question}</h3>
                    {q.questionAudio &&
                        <audio
                            style={{marginBottom: '10px'}}
                            controls
                            src={q?.questionMediaUrl}
                        />
                    }

                    <div className="ex-options">
                        {q.options.map((opt, i) => (
                            <button
                                key={opt?.optionId}
                                type="button"
                                className={`ex-option ${chosen === opt?.optionId ? 'picked' : ''}`}
                                onClick={() => handleSelect(q.id, opt?.optionId)}
                            >
                                <span className="ex-letter">{LETTERS[i]}</span>
                                {q?.audio ? (
                                    <audio
                                        key={opt?.optionId}
                                        controls
                                        className="quiz-option"
                                        src={opt?.optionText}
                                    />
                                ) : (
                                    <span className="ex-text">{opt?.optionText}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {submitError && <p className="ex-error" style={{ color: 'var(--plum)' }}>{submitError}</p>}

                    <div className="ex-actions">
                        <button className="ex-btn ghost" disabled={current === 0 || submitting} onClick={() => setCurrent((c) => c - 1)}>
                            ← Câu trước
                        </button>
                        {isLast ? (
                            <button className="ex-btn primary" disabled={submitting} onClick={handleSubmit}>
                                {submitting ? 'Đang chấm...' : 'Nộp bài'}
                            </button>
                        ) : (
                            <button className="ex-btn primary" onClick={() => setCurrent((c) => c + 1)}>Câu sau →</button>
                        )}
                    </div>

                    {!isLast && (
                        <button className="ex-submit-link" disabled={submitting} onClick={handleSubmit}>
                            Nộp bài sớm ({answeredCount}/{exam.length} câu đã trả lời)
                        </button>
                    )}
                </div>
            </div>
        );
    }

    /* ================= KẾT QUẢ ================= */
    return (
        <div className="ex">
            <div className={`ex-panel ex-result ${result.passed ? 'pass' : 'fail'}`}>
                <span className="ex-eyebrow">{result.passed ? 'Chúc mừng!' : 'Chưa đạt'}</span>
                <div className="ex-score">{result.percent}%</div>
                <p className="ex-sub">
                    Đúng <strong>{result.correct}</strong>/{result.total} câu · Yêu cầu {EXAM_CONFIG.passPercent}%
                </p>

                {result.passed ? (
                    <p className="ex-verdict">Bạn đã đủ điều kiện lên <strong>{nextLevel}</strong>.</p>
                ) : (
                    <p className="ex-verdict">Hãy ôn lại rồi thử lại nhé.</p>
                )}

                <div className="ex-breakdown">
                    {Object.entries(result.byChapter).map(([key, v]) => {
                        const k = key.toLowerCase();    // BE trả "VOWEL" hay "vowel" đều được
                        return (
                            <div key={key} className="ex-bd-row">
                                <span>{EXAM_CHAPTERS[k] || key}</span>
                                <div className="ex-bd-track">
                                    <div style={{ width: `${v.total ? (v.correct / v.total) * 100 : 0}%` }} />
                                </div>
                                <span className="ex-bd-num">{v.correct}/{v.total}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="ex-actions">
                    <button className="ex-btn primary" onClick={start}>Làm lại bài mới</button>
                </div>
            </div>
        </div>
    );
}