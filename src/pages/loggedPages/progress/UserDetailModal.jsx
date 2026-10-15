import React, {useEffect, useState} from "react";
import "./UserDetailModal.css";
import {usePost} from "../../../components/use/usePost.js";
import {API_URL} from "../../../components/API_URL.jsx";

const UserDetailModal = ({ email, onClose }) => {
    if (!email) return null;
    const [user, setUser] = useState([]);
    const {executePost: loadUserDetail, loading: loadingUserDetail} = usePost(`${API_URL}/admin/get-user-detail-activity`);
    useEffect(() => {
        const handleUserDetail = async () => {
            const req = {
                email: email
            }
            try {
                const data = await loadUserDetail(req);
                setUser(data);
            } catch (e) {
                console.log("Error Handle User Detail", e);
            }
        }
        handleUserDetail();
    }, []);

    const learning = user.learningProgress?.[0] || {
        completedLessons: 0,
        learningLessons: 0,
        lessons: [],
        totalProgress: 0
    };

    const level = user.level || {
        accuracyRate: 0,
        levelNumber: 1,
        totalQuestions: 0,
        totalScore: 0,
        userLevel: "Mới bắt đầu"
    };

    const handwriting = user.handwriting || [];
    const attendance = user.attendance || [];

    const totalProgress = Number(learning.totalProgress || 0);
    const avgScore = Number(user.avgScore || 0);

    // Số ký tự đã luyện
    const practicedCharacters = handwriting.filter(
        item => item.totalAttempts !== null &&
                item.totalAttempts > 0
    );

    // Ký tự thành thạo >= 80
    const masteredCharacters = handwriting.filter(
        item => item.totalAttempts !== null &&
                item.totalAttempts > 0 &&
                item.score >= 80
    );

    // Ký tự yếu < 60 nhưng đã luyện
    const weakCharacters = handwriting.filter(
        item => item.totalAttempts !== null &&
                item.totalAttempts > 0 &&
                item.score < 60
    );

    return (
        <div className="user-detail-overlay" onClick={onClose}>
            <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="user-detail-header">
                    <div className="user-info">
                        <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                            <h2>{user.name}</h2>
                            <span>{user.email}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                {/* SUMMARY */}
                <div className="user-summary">
                    <div className="summary-card">
                        <span>Tiến độ học</span>
                        <strong>{formatPercent(totalProgress)}%</strong>
                    </div>
                    <div className="summary-card">
                        <span>Điểm luyện viết</span>
                        <strong>{avgScore.toFixed(1)}%</strong>
                    </div>
                    <div className="summary-card">
                        <span>Streak</span>
                        <strong className="streak-value">🔥 {user.streak || 0} ngày</strong>
                    </div>
                    <div className="summary-card">
                        <span>Tổng lượt luyện</span>
                        <strong>{user.totalPractices || 0}</strong>
                    </div>
                </div>
                {/* CONTENT */}
                <div className="user-detail-content">
                    <section className="detail-section">
                        <div className="section-title">
                            <div>
                                <h3>Tiến độ bài học</h3>
                                <span className="section-description">
                                    {learning.completedLessons} bài đã hoàn thành
                                    {" · "}
                                    {learning.learningLessons} bài đang học
                                </span>
                            </div>
                            <strong className="section-percentage">
                                {formatPercent(totalProgress)}%
                            </strong>
                        </div>
                        {/* Overall progress */}
                        <div className="progress-bar">
                            <div style={{width: `${Math.min(totalProgress, 100)}%`}}/>
                        </div>
                        {/* Lesson list */}
                        <div className="lesson-list">
                            {learning.lessons.map((lesson) => (
                                <div className="lesson-item" key={lesson.lessonId}>
                                    <div className="lesson-main">
                                        <div className="lesson-name">
                                            <strong>{lesson.name}</strong>
                                            <LessonStatus lesson={lesson}/>
                                        </div>
                                        <strong>{lesson.progress}%</strong>
                                    </div>
                                    {/* Progress */}
                                    <div className="lesson-progress">
                                        <div style={{width: `${lesson.progress}%`}}/>
                                    </div>
                                    {/* Video + Quiz */}
                                    <div className="lesson-detail">
                                        <span>
                                            🎬 Video:{" "}
                                            {lesson.progress >= 100
                                                ? "Đã xem hết"
                                                : lesson.progress > 0
                                                    ? `Đã xem ${lesson.progress}%`
                                                    : "Chưa xem"
                                            }
                                        </span>
                                        <span>
                                            📝 Quiz:{" "}
                                            {lesson.quiz
                                                ? `${lesson.quiz.score}/${lesson.quiz.totalQuestions}`
                                                : "Chưa làm"
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Level */}
                    <section className="detail-section level-section">
                        <div className="section-title">
                            <div>
                                <h3>Đánh giá</h3>
                                <span className="section-description">Trình độ học tập</span>
                            </div>
                        </div>

                        <div className="level-card">
                            <div className="level-main">
                                <div className="level-number">
                                    <span>Level</span>
                                    <strong>{level.levelNumber}</strong>
                                </div>

                                <div className="level-info">
                                    <div className="level-name">{level.userLevel}</div>
                                    <div className="level-description">
                                        Đánh giá dựa trên kết quả các câu hỏi/quiz đã thực hiện.
                                    </div>
                                </div>

                                <div className="level-accuracy">
                                    <strong>{Number(level.accuracyRate || 0).toFixed(2)}%</strong>
                                    <span>Độ chính xác</span>
                                </div>
                            </div>

                            <div className="level-stats">
                                <div className="level-stat">
                                    <span className="stat-label">Tổng câu hỏi</span>
                                    <strong>{level.totalQuestions}</strong>
                                </div>

                                <div className="level-stat">
                                    <span className="stat-label">Số câu đúng</span>
                                    <strong>{level.totalScore}</strong>
                                </div>

                                <div className="level-stat">
                                    <span className="stat-label">Số câu sai</span>
                                    <strong>
                                        {Math.max(
                                            0,
                                            Number(level.totalQuestions || 0) -
                                            Number(level.totalScore || 0)
                                        )}
                                    </strong>
                                </div>
                            </div>

                            {/*<div className="level-progress">*/}
                            {/*    <div className="level-progress-header">*/}
                            {/*        <span>Độ chính xác</span>*/}
                            {/*        <strong>{Number(level.accuracyRate || 0).toFixed(2)}%</strong>*/}
                            {/*    </div>*/}

                            {/*    <div className="level-progress-track">*/}
                            {/*        <div className="level-progress-fill"*/}
                            {/*             style={{*/}
                            {/*                 width: `${Math.min(*/}
                            {/*                     100,*/}
                            {/*                     Math.max(0, Number(level.accuracyRate || 0))*/}
                            {/*                 )}%`*/}
                            {/*             }}*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </section>

                    <section className="detail-section">
                        <div className="section-title">
                            <div>
                                <h3>Kết quả luyện viết</h3>
                                <span className="section-description">Đánh giá dựa trên các lần gửi AI</span>
                            </div>
                            <TrendBadge attendance={attendance}/>
                        </div>
                        {/* Writing statistics */}
                        <div className="writing-summary">
                            <div>
                                <span>Điểm trung bình</span>
                                <strong>{avgScore.toFixed(1)}%</strong>
                            </div>
                            <div>
                                <span>Ký tự đã luyện</span>
                                <strong>
                                    {practicedCharacters.length}
                                    <small>
                                        / {handwriting.length}
                                    </small>
                                </strong>
                            </div>
                            <div>
                                <span>Đã thành thạo</span>
                                <strong className="success-text">
                                    {masteredCharacters.length}
                                </strong>
                            </div>
                            <div>
                                <span>Cần luyện thêm</span>
                                <strong className="warning-text">
                                    {weakCharacters.length}
                                </strong>
                            </div>
                        </div>
                        {/* Character scores */}
                        <h4>Điểm trung bình theo từng ký tự</h4>
                        <div className="character-grid">
                            {handwriting.map((item) => {
                                const practiced =
                                    item.totalAttempts !== null &&
                                    item.totalAttempts > 0;
                                return (
                                    <div
                                        className={`character-card ${
                                            practiced
                                                ? getCharacterLevel(item.score)
                                                : "not-practiced"
                                        }`}
                                        key={item.nameChar}
                                    >
                                        <div className="character">{item.nameChar}</div>
                                        {practiced ? (
                                            <>
                                                <strong>{Number(item.score).toFixed(1)}%</strong>
                                                <span>{item.totalAttempts} lần</span>
                                                <small>{getCharacterStatus(item.score)}</small>
                                            </>
                                        ) : (
                                            <small>Chưa luyện</small>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="detail-section">
                        <div className="section-title">
                            <div>
                                <h3>Mức độ chuyên cần</h3>
                                <span className="section-description">Hoạt động luyện viết theo ngày</span>
                            </div>
                        </div>
                        <div className="attendance-summary">
                            <div>
                                <span>Streak hiện tại</span>
                                <strong className="streak-value">🔥 {user.streak || 0} ngày</strong>
                            </div>
                            <div>
                                <span>Tổng lượt luyện</span>
                                <strong>{user.totalPractices || 0}</strong>
                            </div>
                            <div>
                                <span>Hoạt động gần nhất</span>
                                <strong>{formatDate(user.lastActivityDate)}</strong>
                            </div>
                        </div>
                        <h4>Lượt luyện viết mỗi ngày</h4>
                        {attendance.length > 0 ? (
                            <div className="daily-practice">
                                {attendance.map((day) => (
                                    <div className="daily-item" key={day.date}>
                                        <span>{formatShortDate(day.date)}</span>
                                        <strong>{day.totalPractice}</strong>
                                        <small>lượt</small>
                                        <div className="daily-score">{Number(day.averageScore).toFixed(1)} điểm</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-data">Chưa có dữ liệu luyện tập.</div>
                        )}
                    </section>

                    <section className="detail-section">
                        <div className="section-title">
                            <div>
                                <h3>Phân loại trình độ</h3>
                                <span className="section-description">Dựa trên tiến độ học và kết quả luyện viết</span>
                            </div>
                        </div>
                        <div className="level-current">
                            <div className="level-icon">⭐</div>
                            <div>
                                <span>Trình độ hiện tại</span>
                                <strong>{getLevel(totalProgress, avgScore)}</strong>
                            </div>
                        </div>
                        <div className="level-list">
                            <LevelItem
                                name="Mới bắt đầu"
                                value={getLevelProgress(
                                    "BEGINNER",
                                    totalProgress,
                                    avgScore
                                )}
                            />
                            <LevelItem
                                name="Cơ bản"
                                value={getLevelProgress(
                                    "BASIC",
                                    totalProgress,
                                    avgScore
                                )}
                            />
                            <LevelItem
                                name="Trung cấp"
                                value={getLevelProgress(
                                    "INTERMEDIATE",
                                    totalProgress,
                                    avgScore
                                )}
                            />
                            <LevelItem
                                name="Nâng cao"
                                value={getLevelProgress(
                                    "ADVANCED",
                                    totalProgress,
                                    avgScore
                                )}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const LessonStatus = ({ lesson }) => {
    if (lesson.status === true) return (<span className="completed">✓ Đã hoàn thành</span>);
    if (lesson.progress > 0) return (<span className="learning">⟳ Đang học</span>);
    return (<span className="not-started">○ Chưa học</span>);
};

const TrendBadge = ({ attendance }) => {
    if (attendance.length < 2) return (<span className="trend-neutral">Chưa đủ dữ liệu</span>);
    const first = Number(attendance[0].averageScore || 0);
    const last = Number(attendance[attendance.length - 1].averageScore || 0);
    const increase = last - first;
    if (increase > 0) return (<span className="trend-up">↗ +{increase.toFixed(1)}%</span>);
    if (increase < 0) return (<span className="trend-down">↘ {increase.toFixed(1)}%</span>);
    return (<span className="trend-neutral">→ Không đổi</span>);
};

const LevelItem = ({ name, value }) => {
    return (
        <div className="level-item">
            <div className="level-label">
                <span>{name}</span>
                <strong>{value}%</strong>
            </div>
            <div className="level-progress">
                <div style={{width: `${value}%`}}/>
            </div>
        </div>
    );
};

const getCharacterStatus = (score) => {
    if (score >= 80) return "✓ Thành thạo";
    if (score >= 50) return "◐ Tốt";
    return "⚠ Cần luyện thêm";
};

const getCharacterLevel = (score) => {
    if (score >= 80) return "mastered";
    if (score >= 60) return "good";
    return "weak";
};

const getLevel = (progress, score) => {
    if (progress >= 80 && score >= 80) return "Nâng cao";
    if (progress >= 60 && score >= 60) return "Trung cấp";
    if (progress >= 20 || score >= 40) return "Cơ bản";
    return "Mới bắt đầu";
};

const getLevelProgress = (level, progress, score) => {
    switch (level) {
        case "BEGINNER":return progress < 20 ? 100 : 20;
        case "BASIC":
            return progress >= 20 && progress < 60
                ? Math.round(progress)
                : progress >= 60
                    ? 100
                    : 0;
        case "INTERMEDIATE":
            return progress >= 60 && progress < 80
                ? Math.round(progress)
                : progress >= 80
                    ? 100
                    : 0;
        case "ADVANCED":
            return progress >= 80 && score >= 80
                ? 100
                : 0;
        default:return 0;
    }
};

const formatPercent = (value) => {
    return Number(value || 0).toFixed(1);
};

const formatDate = (date) => {
    if (!date) return "Chưa có dữ liệu";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
};

const formatShortDate = (date) => {
    if (!date) return "";
    const [, month, day] = date.split("-");
    return `${day}/${month}`;
};

export default UserDetailModal;