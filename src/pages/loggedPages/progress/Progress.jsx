import React, {useEffect, useMemo, useState} from 'react';
import './Progress.css';
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";
import Skeleton from "../../../components/loading/Skeleton.jsx";

const ACHIEVEMENTS = [
    { title: 'Chuỗi 7 ngày', desc: 'Luyện viết 7 ngày liên tiếp', tone: 'gold', locked: false, icon: 'flame' },
    { title: 'Điểm số hoàn hảo', desc: 'Đạt 100% độ tương đồng', tone: 'celadon', locked: false, icon: 'check' },
    { title: 'Hoàn thành nguyên âm', desc: 'Học đủ 10 nguyên âm cơ bản', tone: 'plum', locked: false, icon: 'book' },
    { title: 'Bậc thầy Hangul', desc: 'Thành thạo cả 24 ký tự cơ bản', tone: 'locked', locked: true, icon: 'lock' },
];
const ICONS = {
    check: <path d="M20 6L9 17l-5-5" />,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>,
    book: <><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></>,
    flame: <path d="M12 2s6 5.5 6 10.5a6 6 0 01-12 0C6 7.5 12 2 12 2z" />,
    lock: <><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /><path d="M8 11V7a4 4 0 118 0v4" /></>,
};
function Icon({ name }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            {ICONS[name]}
        </svg>
    );
}

const Progress = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    useEffect(() => {
        handleUserLevel();
        loadDataUserLevel();
    }, []);

    // Handle User Level
    // Set User Level
    const {executePost: updateUserLevel} = usePost(`${API_URL}/progress/user-level`);
    const handleUserLevel = async () => {
        const req = {
            userId: user.userId
        }
        try {
            await updateUserLevel(req);
        } catch (e) {
            console.log("Error Handle User Level", e);
        }
    }
    // Get User Level
    const {executePost: loadUserLevel, loading: loadingUserLevel} = usePost(`${API_URL}/progress/get-user-level`);
    const [userLevel, setUserLevel] = useState([]);
    const mapUserLevel = (level) => ({
        accuracyRate: level?.accuracyRate,
        levelNumber: level?.levelNumber,
        nextLevelTitle: level?.nextLevelTitle,
        progressPercent: level?.progressPercent,
        remainingAccuracy: level?.remainingAccuracy,
        remainingQuestions: level?.remainingQuestions,
        totalQuestions: level?.totalQuestions,
        totalScore: level?.totalScore,
        userLevel: level?.userLevel
    })
    const loadDataUserLevel = async () => {
        const req = {
            userId: user.userId
        }
        try {
            const data = await loadUserLevel(req);
            setUserLevel(data);
        } catch (e) {
            console.log("Error User Level", e);
        }
    }
    const userLevelRes = mapUserLevel(userLevel);

    // Handle Cate
    const {executePost: loadLessonProgress} = usePost(`${API_URL}/progress/lesson-progress`);
    const [categories, setCategories] = useState([]);
    const mapCateRes = (cate) => ({
        title: cate?.nameCate,
        sub: cate?.desCate,
        done: cate?.learnLesson,
        total: cate?.sizeCate,
        unit: 'đã học'
    });
    useEffect(() => {
        const handleLessonProgress = async () => {
            const req = {
                userId: user.userId
            }
            try {
                const data = await loadLessonProgress(req);
                setCategories(data.map(mapCateRes));
            } catch (e) {
                console.log("Error Lesson Progress", e);
            }
        }
        handleLessonProgress();
    }, []);
    const glyphCate = (num) => {
        switch (num) {
            case 0: return 'ㅏ';
            case 1: return 'ㄱ';
            case 2: return '가';
            default: return 'ㅜ';
        }
    }
    const toneCate = (num) => {
        switch (num) {
            case 0: return 'celadon';
            case 1: return 'gold';
            case 2: return 'plum';
            default: return 'celadon';
        }
    }
    const CATEGORIES = categories;

    // Handle Mastery
    const [mastery, setMastery] = useState([]);
    const {executePost: loadMasters, loading: loadingMaster} = usePost(`${API_URL}/progress/master`);
    useEffect(() => {
        const handleMasterRes = async () => {
            const req = {
                userId: user.userId
            }
            try {
                const data = await loadMasters(req);
                setMastery(data);
            } catch (e) {
                console.log("Error Get Masters", e);
            }
        };
        handleMasterRes();
    }, []);
    const masteryTone = (score) => {
        if (score === 0) return 'none';
        if (score >= 85) return 'strong';   // thành thạo
        if (score >= 70) return 'good';     // tốt
        if (score >= 50) return 'mid';      // đang luyện
        return 'low';                       // cần cải thiện
    }

    // Load, Get Progress
    const {executePost: loadProgress} = usePost(`${API_URL}/progress/get`);
    const [progress, setProgress] = useState(null);
    const progressRes = (p) => ({
        averageScore: p?.averageScore,
        countIsPass: p?.countIsPass,
        countPractices: p?.countPractices
    });
    useEffect(() => {
        const getProgressRes = async () => {
            const req = {
                userId: user.userId
            }
            try {
                const data = await loadProgress(req);
                setProgress(progressRes(data));
            } catch (e) {
                console.log("Error Get Progress", e);
            }
        }
        getProgressRes();
    }, [user.userId]);

    // Handle Streak
    const {executePost: loadUserStreak} = usePost(`${API_URL}/user-streak/get`);
    const [streak, setStreak] = useState(0);
    useEffect(() => {
        const handleUserStreak = async () => {
            const req = {
                userId: user.userId
            }
            try {
                const data = await loadUserStreak(req);
                setStreak(data?.currentStreak);
            } catch (e) {
                console.log("Error Load User Streak");
            }
        }
        handleUserStreak();
    }, []);

    // Handle Stat
    const STATS = [
        { icon: 'check', tone: 'a', num: `${progress?.averageScore}%`, label: 'Độ chính xác trung bình' },
        { icon: 'pen', tone: 'b', num: `${progress?.countPractices}`, label: 'Lượt luyện viết' },
        { icon: 'book', tone: 'c', num: `${progress?.countIsPass}/24`, label: 'Ký tự đã thành thạo' },
        { icon: 'flame', tone: 'd', num: `${streak} ngày`, label: 'Chuỗi học liên tiếp' },
    ];

    // Handle data chart
    const {executePost: loadDataChart} = usePost(`${API_URL}/progress/get-score-date`);
    const [chartData, setChartData] = useState([]);
    const [range, setRange] = useState(7);
    // Map Chart, Handle Date
    const mapChart = (c) => {
        if (!c?.date) return ["--/--", 0, 0];

        const [year, month, day] = c.date.split("-");
        return [`${day}/${month}`, c.averageScore, c.totalPractice];
    };
    // Data Chart
    useEffect(() => {
        const handleDataChart = async () => {
            const req = {
                userId: user.userId,
                days: range
            }
            try {
                const data = await loadDataChart(req);
                setChartData(data.map(mapChart));
            } catch (e) {
                console.log("Error Data Chart", e);
            }
        }

        handleDataChart();
    }, [range]);

    // Handle Total Practice
    const [totalPractice, setTotalPractice] = useState([]);
    const {executePost: loadTotalPractice} = usePost(`${API_URL}/progress/get-total-practice`);
    useEffect(() => {
        const handleTotalPractice = async () => {
            const req = {
                userId: user.userId,
                days: 45
            }
            try {
                const data = await loadTotalPractice(req);
                setTotalPractice(data);
            } catch (e) {
                console.log("Error Total Practice", e);
            }
        }

        handleTotalPractice();
    }, []);

    const seedHeatmap = (days, rList=[]) => {
        return Array.from({ length: days }, (_,i) => {
            const num = rList[i] ?? 0;
            const r = num > 0 ? num / 10 : 0;

            if (r > 0.85) return 4;
            if (r > 0.65) return 3;
            if (r > 0.45) return 2;
            if (r > 0.25) return 1;
            return 0;
        });
    }
    const heatmap = useMemo(() => seedHeatmap(45, totalPractice), [totalPractice]);

    const completedTotal = mastery.filter((m) => m?.score > 0).length;

    return (
        <div id="progress-page">
            <div className="page-head">
                <span className="eyebrow">Thống kê học tập</span>
                <h1>Tiến độ của bạn</h1>
                <p>Theo dõi độ chính xác, chuỗi ngày học và mức độ thành thạo từng ký tự.</p>
            </div>

            {/* ---------------- STAT ROW ---------------- */}
            <div className="stat-row">
                {STATS.map((s) => (
                    <div className="card stat-card" key={s.label}>
                        <div className={`stat-icon tone-${s.tone}`}><Icon name={s.icon}/></div>
                        <div>
                            <div className="stat-num">{s.num}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="level-card">
                {loadingUserLevel && (<Skeleton />)}
                {!loadingUserLevel && (
                    <>
                        <div className="level-header">
                            <div className="level-badge">
                                <span className="badge-icon">🌿</span>
                                <span className="badge-title">{userLevelRes?.userLevel}</span>
                            </div>
                            <span className="level-tag">Level {userLevel?.levelNumber}</span>
                        </div>

                        <div className="level-stats">
                            <div className="stat-item">
                                <span className="stat-label">Độ chính xác</span>
                                <span className="stat-val">{`${userLevelRes?.accuracyRate}%`}</span>
                            </div>

                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <span className="stat-label">Số câu đúng</span>
                                <span className="stat-val">{userLevelRes?.totalScore}<small>/{userLevelRes?.totalQuestions}</small></span>
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="progress-label">
                                <span>{userLevelRes?.nextLevelTitle}</span>
                                {userLevelRes?.remainingQuestions === 0 ? (
                                    <span>Cần cải thiện độ chính xác</span>
                                ) : (
                                    <span>{userLevelRes?.remainingQuestions} câu nữa</span>
                                )}
                            </div>

                            <div className="progress-bar">
                                <div className="progress-fill" style={{width: `${userLevelRes?.progressPercent}%`}}></div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ---------------- CHART + HEATMAP ---------------- */}
            <div className="row-2col">
                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Độ chính xác theo thời gian</h3>
                            <p>Điểm trung bình do AI đánh giá mỗi ngày</p>
                        </div>

                        <div className="range-toggle">
                            <button className={range === 7 ? 'active' : ''} onClick={() => setRange(7)}>7 ngày</button>
                            <button className={range === 14 ? 'active' : ''} onClick={() => setRange(14)}>14 ngày
                            </button>
                        </div>
                    </div>

                    <div className="bars">
                        {chartData.map(([label, val, total], index) => (
                            <div className="bar-col" key={index}>
                                <div className="bar-val">{val}</div>
                                <div className="bar" style={{height: `${val * 1.35}px`}}/>
                                <div className="bar-day">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Lịch luyện tập</h3>
                            <p>45 ngày gần nhất</p>
                        </div>
                    </div>

                    <div className="heatmap-grid">
                        {heatmap.map((level, i) => (
                            <div key={i} className="heat-cell" data-level={level || undefined}/>
                        ))}
                    </div>

                    <div className="heatmap-foot">
                        <span>Ít hơn</span>
                        <div className="heat-scale">
                            {[0, 1, 2, 3, 4].map((lvl) => (
                                <div key={lvl} className="heat-cell" data-level={lvl || undefined}/>
                            ))}
                        </div>
                        <span>Nhiều hơn</span>
                    </div>
                </div>
            </div>

            {/* ---------------- CATEGORY PROGRESS ---------------- */}
            <div className="category-row">
                {CATEGORIES.map((c, index) => (
                    <div className="card cat-card" key={index}>
                        <div className={`cat-glyph tone-${toneCate(index)}`}>{glyphCate(index)}</div>
                        <h4>{c.title}</h4>
                        <p className="cat-sub">{c.sub}</p>
                        <div className="cat-progress-num">{c.done}/{c.total} {c.unit}</div>
                        <div className="cat-track">
                            <div className={`cat-fill tone-${toneCate(index)}`}
                                 style={{width: `${(c.done / c.total) * 100}%`}}/>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------------- MASTERY GRID ---------------- */}
            <div className="card mastery-card">
                <div className="panel-head no-margin">
                    <div>
                        <h3>Mức độ thành thạo theo ký tự</h3>
                        <p>{completedTotal}/{mastery.length} ký tự đã luyện · dựa trên điểm số trung bình gần nhất</p>
                    </div>
                </div>

                {loadingMaster && (<Skeleton/>)}
                {!loadingMaster && (
                    <div className="mastery-grid">
                        {mastery.map((m, index) => (
                            <div className={`mastery-tile tone-${masteryTone(m?.score)}`} key={index}>
                                <div className="g">{m?.nameChar}</div>
                                <div className="p">{m?.score > 0 ? `${m?.score}%` : '—'}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mastery-legend">
                    <span><i className="dot tone-strong"/> Thành thạo (≥85%)</span>
                    <span><i className="dot tone-good"/> Tốt (70–84%)</span>
                    <span><i className="dot tone-mid"/> Đang luyện (50–69%)</span>
                    <span><i className="dot tone-low"/> Cần cải thiện (&lt;50%)</span>
                    <span><i className="dot tone-none"/> Chưa luyện</span>
                </div>
            </div>

            {/* ---------------- ACHIEVEMENTS ---------------- */}
            <div className="card achieve-card">
                <div className="panel-head no-margin">
                    <div>
                        <h3>Thành tích</h3>
                        <p>Những cột mốc bạn đã đạt được trên hành trình học tiếng Hàn</p>
                    </div>
                </div>

                <div className="achieve-grid">
                    {ACHIEVEMENTS.map((a) => (
                        <div className={`achieve-item${a.locked ? ' locked' : ''}`} key={a.title}>
                            <div className={`achieve-icon tone-${a.tone}`}><Icon name={a.icon}/></div>
                            <h5>{a.title}</h5>
                            <p>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Progress;