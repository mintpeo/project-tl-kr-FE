import React, {useEffect, useState} from 'react';
import './LessonRoute.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import ReactPlayer from "react-player";

const LessonRoute = () => {
    const {data: cate, loading: loadingCate} = useFetch(`${API_URL}/lesson-cate-route/all`);
    const [selectedCateId, setSelectedCateId] = useState(-1);
    const [categoryDetail, setCategoryDetail] = useState([]);
    const [lessonByCateId, setLessonByCateId] = useState([]);
    const [isLoadingLesson, setIsLoadingLesson] = useState(false);

    const categories = cate.map((item) => ({
        id: item.id,
        name: item.name,
        des: item.des,
        orderIndex: item.orderIndex
    }));

    const lessons = (lessonByCateId || []).map((item) => ({
        id: item.id,
        name: item.name,
        youtubeId: item.youtubeId,
        cateRouteId: item.cateRouteId
    }))

    useEffect(() => {
        setIsLoadingLesson(true);
        const getLessonByCateId = async () => {
            const req = {
                "cateRouteId": selectedCateId
            }

            try {
                const res = await fetch(`${API_URL}/lesson-cate-route/lessons`, {
                    method: "POST",
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                });
                const data = await res.json();
                setLessonByCateId(data);
                setIsLoadingLesson(false);
            } catch (e) {
                console.log("Error Get Lesson By Category Id", e);
            }
        }
        getLessonByCateId();
    }, [selectedCateId]);

    const selectedClickAgain = (id) => {
        if (id === selectedCateId) setSelectedCateId(-1);
        else setSelectedCateId(id)
    }

    if (loadingCate) return <Skeleton />
    return (
        <div id="lesson">
            <div className="page-head">
                <span className="eyebrow">Bảng chữ cái Hangul</span>
                <h1>Bài học</h1>
                <p>Xem video hướng dẫn, học nội dung ký tự và làm bài luyện tập để ghi nhớ kiến thức.</p>
            </div>

            <div className="lesson-shell">
                <div className="card curriculum">
                    <div className="curriculum-head">
                        <h3>Lộ trình học</h3>
                        <div className="ov-track"><div className="ov-fill"></div></div>
                        <p>1/4 chương đã hoàn thành</p>
                    </div>

                    {
                        categories.map((item) => (
                            <div
                                key={item.id}
                                className={`module ${selectedCateId === item.id ? `expanded` : ``}`}
                            >
                                <div className="module-head" onClick={() => selectedClickAgain(item.id)}>
                                    <div className="module-status current"></div>
                                    <div className="module-title"><p>{item.name}</p><span>{item.lessonSize} video · 3:20</span></div>
                                </div>

                                <div className="submodule-list">
                                    {
                                        lessons && lessons.length > 0 ?
                                            lessons.map((lesson) => (
                                                <div className="sub-item active">
                                                    <div className="done-tick">
                                                        <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                                    </div>
                                                    {lesson.name}
                                                </div>
                                            )) : (
                                                <Skeleton />
                                            )
                                    }
                                </div>
                            </div>
                        ))
                    }

                    <div className="module">
                        <div className="module-head">
                            <div className="module-status done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
                            <div className="module-title"><p>Nguyên âm cơ bản</p><span>Video · Nội dung · 5 câu luyện tập</span></div>
                        </div>
                    </div>

                    <div className="module expanded" data-module="1">
                        <div className="module-head">
                            <div className="module-status current"></div>
                            <div className="module-title"><p>Nguyên âm cơ bản</p><span>Video · Nội dung · 5 câu luyện tập</span></div>
                        </div>

                        <div className="submodule-list">
                            <div className="sub-item active">
                                <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                Video bài giảng
                            </div>

                            <div className="sub-item">
                                <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/><path d="M17 3v16"/></svg>
                                Nội dung &amp; thứ tự nét
                            </div>

                            <div className="sub-item">
                                <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                Bài luyện tập (5 câu)
                            </div>
                        </div>
                    </div>

                    <div className="module" data-module="2">
                        <div className="module-head">
                            <div className="module-status locked"><svg viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/><path d="M8 11V7a4 4 0 118 0v4"/></svg></div>
                            <div className="module-title"><p>Phụ âm cơ bản</p><span>Video · Nội dung · 7 câu luyện tập</span></div>
                        </div>
                    </div>

                    <div className="module" data-module="3">
                        <div className="module-head">
                            <div className="module-status locked"><svg viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/><path d="M8 11V7a4 4 0 118 0v4"/></svg></div>
                            <div className="module-title"><p>Âm tiết ghép</p><span>Video · Bộ ghép tương tác</span></div>
                        </div>
                    </div>
                </div>

                {
                    lessons && lessons.length > 0 ?
                        lessons.map((lesson) => (
                            <div className="card content-card">
                                <div className="video-player">
                                    {
                                        lesson.youtubeId !== null ? (
                                            <ReactPlayer
                                                src={`https://www.youtube.com/watch?v=${lesson.youtubeId}`}
                                                width="100%"
                                                height="100%"
                                                controls={true}
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
                                    <h2>{lesson.name}</h2>
                                    {/*<p>{categoryDetail.des}</p>*/}
                                </div>

                                <div className="content-tabs">
                                    <div className="content-tab active" id="tabBtnContent">
                                        <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/><path d="M17 3v16"/></svg>
                                        Nội dung bài học
                                    </div>

                                    <div className="content-tab" id="tabBtnQuiz">
                                        <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                        Bài luyện tập
                                        <span className="count-badge">5 câu</span>
                                    </div>
                                </div>

                                <div className="tab-panel active" id="panelContent">
                                    <div className="char-grid" id="charGrid"></div>
                                    <div className="stroke-detail" id="strokeDetail"></div>
                                    <div style={{marginTop: '20px'}}>
                                        <button className="btn btn-primary">
                                            <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
                                            Luyện viết các nguyên âm này
                                        </button>
                                    </div>
                                </div>

                                <div className="tab-panel" id="panelQuiz">
                                    <div id="quizArea"></div>
                                </div>
                            </div>
                        ))
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
        </div>
    );
};

export default LessonRoute;