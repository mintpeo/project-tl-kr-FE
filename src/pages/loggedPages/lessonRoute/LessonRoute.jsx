import React, {useEffect, useRef, useState} from 'react';
import './LessonRoute.css';
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import ReactPlayer from "react-player";
import CharHangul from "../../../components/hangul/CharHangul.jsx";
import Combine from "../combine/Combine.jsx";
import {usePost} from "../../../components/use/usePost.js";
import lesson from "../lesson/Lesson.jsx";

const LessonRoute = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    const {executePost: loadCategories, loading: loadingCate} = usePost(`${API_URL}/lesson-cate-route/user`);
    const {executePost: completeLesson} = usePost(`${API_URL}/user-lesson-progress/complete`);

    const [categories, setCategories] = useState([]);
    const [selectedCateId, setSelectedCateId] = useState(-1);
    const [lessonByCateId, setLessonByCateId] = useState([]);
    const [selectedLessonRoute, setSelectedLessonRoute] = useState(1);
    const [lessonRoute, setLessonRoute] = useState();
    const [isLessonContent, setIsLessonContent] = useState(true);
    const [hasCompleted, setHasCompleted] = useState(false);
    const playerRef = useRef(null);
    const [track, setTrack] = useState(0);
    const [countLesson, setCountLesson] = useState(0);

    const fetchCategories = async () => {
        const req = {
            userId: user?.userId
        }

        try {
            const data = await loadCategories(req);
            const res = data.map((item) => ({
                id: item.id,
                name: item.name,
                des: item.des,
                orderIndex: item.orderIndex,
                lessonsSize: item.lessonsSize,
                learned: item.learned
            }));

            const count = res.filter(item => item.learned).length;
            const per = Math.round((count / res.length) * 100);
            setCountLesson(count);
            setTrack(per);

            setCategories(res);
        } catch (e) {
            console.log("Error Loading Categories User", e);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [user?.userId]);

    const lessons = (lessonByCateId || []).map((item) => ({
        id: item?.id,
        name: item?.name,
        youtubeId: item?.youtubeId || "",
        cateRouteId: item?.cateRouteId,
        learned: item?.learned,
        orderIndex: item?.orderIndex,
        des: item?.des,
        learnContent: item?.learnContent
    }));

    const handleProgress = async (event) => {
        const video = event.currentTarget;
        if (!video.duration) return;

        // console.log("currentTime:", video.currentTime);
        // console.log("duration:", video.duration);

        const progress = video.currentTime / video.duration;

        // console.log(
        //     "Tiến độ phát:",
        //     Math.round(progress * 100) + "%"
        // );

        if (!hasCompleted && progress >= 0.8) {
            const req = {
                userId: user?.userId,
                lessonId: lessonRoute?.id
            }

            try {
                const data = await completeLesson(req);
                if (data) setHasCompleted(true);
            } catch (e) {
                console.log("Error Complete Lesson", e);
            }
        }
    };

    useEffect(() => {
        if (lessons.length > 0) {
            const currentLesson = lessons.find((item) => item.orderIndex === selectedLessonRoute) || lessons[0];
            setLessonRoute(currentLesson);
        } else {
            setLessonRoute(null);
        }
    }, [selectedLessonRoute, lessonByCateId]);

    // Get lessons by category id
    useEffect(() => {
        setSelectedLessonRoute(1);

        if (selectedCateId === -1) return;
        const getLessonByCateId = async () => {
            const req = {
                userId: user.userId,
                cateRouteId: selectedCateId
            }

            try {
                const res = await fetch(`${API_URL}/lesson-route/lessons`, {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                });
                const data = await res.json();
                setLessonByCateId(data);
                const l = data.find((lesson) => lesson.orderIndex === selectedLessonRoute);
                setLessonRoute(l);
            } catch (e) {
                console.log("Error Get Lesson By Category Id", e);
            }
        }
        getLessonByCateId();
    }, [selectedCateId]);

    // Click sub category
    const selectedClickAgain = (id) => {
        if (id === selectedCateId) setSelectedCateId(-1);
        else setSelectedCateId(id)
    }

    // Go to element id
    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loadingCate) return <Skeleton />
    return (
        <>
            <div className="lesson-shell">
                <div className="card curriculum">
                    <div className="curriculum-head">
                        <h3>Lộ trình học</h3>
                        <div className="ov-track"><div className="ov-fill" style={{width: `${track}%`}} /></div>
                        <p>{countLesson}/4 chương đã hoàn thành</p>
                    </div>

                    {
                        categories.map((item, index) => {
                            const isPrevLearned = index === 0 || categories[index - 1]?.learned;
                            return (
                            <div
                                key={item.id}
                                className={`module ${selectedCateId === item.id ? `expanded active` : ``}`}
                            >
                                <div className="module-head" onClick={() => selectedClickAgain(item.id)}>
                                    {
                                        item.learned ? (
                                            <div className="module-status done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
                                        ) : isPrevLearned ? (
                                            <div className="module-status current"></div>
                                        ) : (
                                            <div className="module-status locked"><svg viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/><path d="M8 11V7a4 4 0 118 0v4"/></svg></div>
                                        )
                                    }
                                    <div className="module-title"><p>{item.name}</p><span>{item.lessonsSize} video · {item.des}</span></div>
                                </div>

                                <div className="submodule-list">
                                    {
                                        lessons && lessons.length > 0 ?
                                            lessons
                                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                                .map((lesson) => (
                                                    <>
                                                        <div className={`sub-item ${selectedLessonRoute === lesson.orderIndex ? `active` : ``}`} onClick={() => setSelectedLessonRoute(lesson.orderIndex)}>
                                                            {
                                                                lesson.learned ? (
                                                                    <div className="done-tick">
                                                                        <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                                                    </div>
                                                                ) : (
                                                                    <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                                                )
                                                            }
                                                            {lesson.name}
                                                        </div>

                                                        {
                                                            lesson.learnContent && (
                                                                <div className={`sub-item ${selectedLessonRoute === lesson.orderIndex ? `active` : ``}`}
                                                                     onClick={() => {
                                                                    scrollToElement("lesson-content");
                                                                    setSelectedLessonRoute(lesson.orderIndex)
                                                                }}>
                                                                    <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/><path d="M17 3v16"/></svg>
                                                                    Nội dung bài học
                                                                </div>
                                                            )
                                                        }
                                                    </>
                                            )) : (
                                                <Skeleton />
                                            )
                                    }
                                </div>
                            </div>
                            )})
                    }

                    {/*        <div className="sub-item">*/}
                    {/*            <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>*/}
                    {/*            Bài luyện tập (5 câu)*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                </div>

                {
                    selectedCateId > 0 ?
                        (
                            <div className="card content-card">
                                <div className="video-player">
                                    {
                                        lessonRoute?.youtubeId ? (
                                            <ReactPlayer
                                                ref={playerRef}
                                                src={`https://www.youtube.com/watch?v=${lessonRoute?.youtubeId}`}
                                                width="100%"
                                                height="100%"
                                                controls={true}
                                                onProgress={handleProgress}
                                                progressInterval={1000}
                                            />
                                        ) : (
                                            <>
                                                <span className="ghost-char">가</span>
                                                <div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                                                <div className="video-duration">8:45</div>
                                                <div className="video-progress-track"><div className="video-progress-fill"></div></div>
                                            </>
                                        )
                                    }
                                </div>

                                <div className="content-head">
                                    <h2>{lessonRoute?.name}</h2>
                                    <p>{lessonRoute?.des}</p>
                                    {
                                        hasCompleted && (
                                            <div style={{textAlign: "right", marginBottom: "10px"}}><button className="btn" style={{padding: '5px 10px'}} onClick={() => window.location.reload()}>Qua bài học tiếp theo</button></div>
                                        )
                                    }
                                </div>

                                {
                                    lessonRoute?.learnContent && (
                                        <>
                                            <div className="content-tabs">
                                                <div className={`content-tab ${isLessonContent ? `active` : ``}`} id="lesson-content"
                                                     onClick={() => setIsLessonContent(true)}
                                                >
                                                    <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/><path d="M17 3v16"/></svg>
                                                    Nội dung bài học
                                                </div>

                                                <div className={`content-tab ${isLessonContent ? `` : `active`}`} id="tabBtnQuiz"
                                                     onClick={() => setIsLessonContent(false)}
                                                >
                                                    <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                                    Bài luyện tập
                                                    <span className="count-badge">5 câu</span>
                                                </div>
                                            </div>

                                            <div className={`tab-panel ${isLessonContent ? `active` : ``}`} id="panelContent">
                                                {
                                                    lessonRoute?.id === 3 ? (
                                                        <div className="demo-card" style={{marginBottom: '24px'}}>
                                                            <CharHangul isVowels={true}/>
                                                            <div className="status-line" id="statusLine"></div>
                                                        </div>
                                                    ) : lessonRoute?.id === 4 ? (
                                                        <div className="demo-card" style={{marginBottom: '24px'}}>
                                                            <CharHangul isVowels={false}/>
                                                            <div className="status-line" id="statusLine"></div>
                                                        </div>
                                                    ) : lessonRoute?.id === 5 ? (
                                                        <Combine singleConsonant={true}/>
                                                    ) : (<Combine singleConsonant={false}/> )
                                                }
                                            </div>

                                            <div className="tab-panel" id="panelQuiz">
                                                <div className="stroke-detail" id="strokeDetail" />
                                                <div id="quizArea">
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        )
                        : (
                        <div className="card content-card">
                            <div className="content-head">
                                <h2>Lộ trình học Hangul</h2>
                                <p>
                                    Được xây dựng từ những kiến thức cơ bản đến nâng cao, giúp người học từng bước làm quen và sử dụng tiếng Hàn một cách hiệu quả. Trước tiên, bạn sẽ học các phụ âm và nguyên âm cơ bản, sau đó luyện ghép chúng thành các âm tiết và từ đơn giản. Tiếp theo, người học sẽ làm quen với quy tắc phát âm, phụ âm cuối và cách viết Hangul đúng thứ tự nét. Cuối cùng, bạn có thể luyện đọc, viết và áp dụng Hangul vào các từ vựng và câu tiếng Hàn trong thực tế.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default LessonRoute;