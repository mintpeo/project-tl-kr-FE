import React, {useEffect, useState} from 'react';
import './Quiz.css';
import {usePost} from "../use/usePost.js";
import {API_URL, LOCAL_STORAGE_KEYS} from "../API_URL.jsx";

/**
 * Quiz — component trắc nghiệm dùng chung cho các chương trong LessonRoadmap.
 *
 * Props:
 *  - questions: [{ id, question, options: string[], correct: number }]
 *    (đúng cấu trúc dữ liệu từ AdminExercises.jsx / API /api/admin/exercises)
 *  - onFinish?: (score: number, total: number) => void
 *  - onPracticeClick?: () => void  // bấm "Luyện viết ngay" ở màn kết quả
 */

const Quiz = ({quizId, onFinish, onPracticeClick }) => {
    // User
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    // Get Quiz By Quiz Id
    const {executePost: loadQuiz, loading: loadingQuiz} = usePost(`${API_URL}/quiz/all`);
    const [dataQuestions, setDataQuestions] = useState([]);
    const getAllQuiz = async () => {
        const req = {
            quizId: quizId
        }
        try {
            const data = await loadQuiz(req);
            setDataQuestions(data?.questions);
        } catch (e) {
            console.log("Error Get All Quiz", e);
        }
    }
    useEffect(() => {
        getAllQuiz();
        handleUserQuiz();
    }, []);
    const mapQuestions = (question) => ({
        id: question?.id,
        title: question?.questionText,
        options: question?.options,
    });
    const questions = dataQuestions.map(mapQuestions);

    // Handle Question is Correct
    const [selected, setSelected] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(0);
    const [score, setScore] = useState(0);
    const [userIsDone, setUserIsDone] = useState(false);
    const [dataComplete, setDataComplete] = useState('');
    const {executePost: handleQuestionCorrect} = usePost(`${API_URL}/quiz/is-correct`);
    // Handle Question
    const handleQuestion = async (optId, queId) => {
        const req = {
            optionId: optId,
            questionId: queId,
        }
        try {
            const data = await handleQuestionCorrect(req);
            setIsCorrect(data?.correctAnswer);
            return data?.correct;
        } catch (e) {
            console.log("Error Handle Question", e);
        }
    }
    // Handle Select
    const handleSelect = async (optId, queId) => {
        if (answered) return;

        setSelected(optId);
        setAnswered(true);
        const isCorrect = await handleQuestion(optId, queId);
        if (isCorrect) setScore((s) => s + 1);
    }

    // Get User Quiz
    const {executePost: loadUserQuiz} = usePost(`${API_URL}/quiz/get-quiz`);
    const handleUserQuiz = async () => {
        const req = {
            userId: user.userId,
            quizId: quizId
        }

        try {
            const data = await loadUserQuiz(req);
            if (data?.quizAttempt) {
                setUserIsDone(true);
                setScore(data?.score);
                setDataComplete(data?.date);
            }
        } catch (e) {
            console.log("Error User Quiz", e);
        }
    }

    const [index, setIndex] = useState(0);
    const isDone = index >= questions.length;
    const current = !isDone ? questions[index] : null;

    const handleNext = () => {
        setSelected(null);
        setIsCorrect(0);
        setAnswered(false);

        const nextIndex = index + 1;
        setIndex(nextIndex);
        if (nextIndex >= questions.length) {
            // score đã được cộng dồn đúng ở handleSelect ngay khi chọn đáp án,
            // nên ở đây chỉ cần báo ra ngoài giá trị hiện tại.
            handleSaveQuiz();
            onFinish?.(score, questions.length);
        }
    }

    const handleRestart = () => {
        setIndex(0); // set ve 0 thi question cung ve 0
        setSelected(null);
        setIsCorrect(0);
        setAnswered(false);
        setUserIsDone(false);
        setScore(0);
    }

    // Handle Save Quiz
    const {executePost: saveQuiz} = usePost(`${API_URL}/quiz/save-quiz`);
    const handleSaveQuiz = async () => {
        const req = {
            userId: user.userId,
            quizId: quizId,
            score: score,
            totalQuestions: questions.length
        }

        try {
            await saveQuiz(req);
        } catch (e) {
            console.log("Error Save Quiz", e);
        }
    }

    if (isDone || userIsDone) {
        const pct = Math.round((score / questions.length) * 100);
        return (
            <div className="quiz-result">
                <div className="score-big">{score}/{questions.length}</div>

                <p>Bạn đã trả lời đúng {pct}% câu hỏi trong bài luyện tập này.</p>
                {userIsDone && (<p>Hoàn thành bài luyện tập này vào: {dataComplete}</p>)}

                <div className="btn-row">
                    <button className="btn btn-ghost" onClick={handleRestart}>Làm lại</button>
                    <button className="btn btn-primary" onClick={onPracticeClick}>Luyện viết ngay</button>
                </div>
            </div>
        );
    }

    // custom char
    const isCharOptions = current.options.every((o) => o?.optionText.length <= 5);

    if (loadingQuiz) return <div className="quiz-empty">Chương này chưa có bài luyện tập.</div>;

    return (
        <div className="quiz-wrap">
            <div className="quiz-progress">
                <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${(index / questions.length) * 100}%` }} />
                </div>
                <div className="quiz-progress-label">Câu {index + 1}/{questions.length}</div>
            </div>

            <div className="quiz-question">{current.title}</div>

            <div className={`quiz-options ${isCharOptions ? 'char-mode' : 'text-mode'}`}>
                {current.options.map((opt) => {
                    let stateClass = '';
                    if (answered) {
                        if (opt.optionId === isCorrect) stateClass = 'correct';
                        else if (opt.optionId === selected) stateClass = 'wrong';
                    }
                    return (
                        <button
                            key={opt.optionId}
                            className={`quiz-option ${stateClass} ${answered ? 'disabled' : ''}`}
                            onClick={() => handleSelect(opt.optionId, current.id)}
                        >
                            {opt?.optionText}
                        </button>
                    );
                })}
            </div>

            <div className={`quiz-feedback ${answered ? (selected === isCorrect ? 'correct' : 'wrong') : ''}`}>
                {answered && (selected === isCorrect ? 'Chính xác! 🎉' : 'Chưa đúng — đáp án đúng đã được tô xanh.')}
            </div>

            <button className="btn btn-primary" disabled={!answered} onClick={handleNext}>
                {index === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
            </button>
        </div>
    );
}
export default Quiz;