import React, {useEffect, useState} from 'react';
import './Home.css';
import {usePost} from "../../../components/use/usePost.js";
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import {useNavigate} from "react-router-dom";
import Skeleton from "../../../components/loading/Skeleton.jsx";

const Home = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);
    const navigate = useNavigate();

    // Handle Cate
    const {executePost: loadLessonProgress, loading:loadingLesson} = usePost(`${API_URL}/progress/lesson-progress`);
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

    // Handle Check In
    const {executePost: handleCheckIn} = usePost(`${API_URL}/user-streak/check-in`);
    const [btnCheckIn, setBtnCheckIn] = useState(false);
    const handleBtnCheckIn = async () => {
        const req = {
            userId: user.userId
        }
        try {
            const data = await handleCheckIn(req);
            if (data) {
                alert("Điểm danh thành công.");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error User Streak", e);
        }
    }

    // Get User Streak
    const {executePost: loadUserStreak} = usePost(`${API_URL}/user-streak/get`);
    const [userStreak, setUserStreak] = useState([]);
    useEffect(() => {
        const handleUserStreak = async () => {
            const req = {
                userId: user.userId
            }
            try {
                const data = await loadUserStreak(req);
                if (data === null) return;
                setUserStreak(data);
                setBtnCheckIn(data?.checked);
            } catch (e) {
                console.log("Error User Streak", e);
            }
        }

        handleUserStreak();
    }, []);

    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Chào mừng trở lại</span>
                    <h1>안녕하세요, Minh 👋</h1>
                    <p>Hôm nay là ngày tốt để luyện thêm vài nét chữ.</p>
                </div>
            </div>

            <div className="home-grid">
                <div className="hero-card">
                    <span className="hero-char">한</span>
                    <h2>Luyện viết chữ hôm nay</h2>
                    <p>Viết theo chữ mẫu và để AI chấm điểm độ chính xác từng nét trong vài giây.</p>
                    <button onClick={() => navigate("/practice")} className="btn btn-light">Bắt đầu luyện viết →</button>
                </div>

                <div className="card streak-card">
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <div className="streak-row">
                            <div className="ring" style={{background: 'var(--gold)'}}></div>

                            <div>
                                <div className="streak-num">{userStreak?.currentStreak} <span style={{fontSize: '15px'}}>ngày</span></div>
                                <div className="streak-label">Chuỗi ngày học liên tiếp</div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => handleBtnCheckIn()}
                            disabled={btnCheckIn}
                            style={{height: '50px'}}
                        >{btnCheckIn ? `Đã điểm danh`: `Điểm danh`}</button>
                    </div>

                    <div>
                        <div
                            className="streak-target">
                            <span>Mục tiêu hôm nay</span><span className="mono">7/10 chữ</span>
                        </div>

                        <div className="goal-track">
                            <div className="goal-fill" style={{width: '70%'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-title">
                <h3>Tiếp tục bài học</h3>
                <span onClick={() => navigate("/road")} className="link-mini">Xem tất cả</span>
            </div>

            <div className="lesson-row">
                {loadingLesson && <Skeleton />}
                {!loadingLesson && (
                    categories.map((lesson, index) => (
                        <div onClick={() => navigate("/road")} className="card lesson-card">
                            <div className="lesson-glyph">{glyphCate(index)}</div>
                            <h4>{lesson.title}</h4>
                            <p>{lesson.sub}</p>
                            <p>{lesson.done}/{lesson.total} {lesson.unit}</p>
                            <div className="goal-track">
                                <div className="goal-fill" style={{ width: `${(lesson.done / lesson.total) * 100}%` }}></div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Home;