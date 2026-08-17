import React, {useEffect, useState} from 'react';
import './LessonRoute.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import ReactPlayer from "react-player";
import CharHangul from "../../../components/hangul/CharHangul.jsx";
import Combine from "../combine/Combine.jsx";

const LessonRoute = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    const {data: cate, loading: loadingCate} = useFetch(`${API_URL}/lesson-cate-route/all`);
    const [selectedCateId, setSelectedCateId] = useState(-1);
    const [categoryDetail, setCategoryDetail] = useState([]);
    const [lessonByCateId, setLessonByCateId] = useState([]);
    const [isLoadingLesson, setIsLoadingLesson] = useState(false);
    const [selectedLessonRoute, setSelectedLessonRoute] = useState(1);
    const [lessonRoute, setLessonRoute] = useState();
    const selectedIndex= 0;

    const categories = cate.map((item) => ({
        id: item.id,
        name: item.name,
        des: item.des,
        orderIndex: item.orderIndex,
        lessonsSize: item.lessonsSize,
        learned: item.learned
    }));

    const lessons = (lessonByCateId || []).map((item) => ({
        id: item?.id,
        name: item?.name,
        youtubeId: item?.youtubeId || "",
        cateRouteId: item?.cateRouteId,
        learned: item?.learned,
        orderIndex: item?.orderIndex,
        des: item?.des
    }));

    useEffect(() => {
        if (lessons.length > 0) {
            const currentLesson = lessons.find((item) => item.orderIndex === selectedLessonRoute) || lessons[0];
            setLessonRoute(currentLesson);
        } else {
            setLessonRoute(null);
        }
    }, [selectedLessonRoute, lessonByCateId]);

    useEffect(() => {
        setSelectedLessonRoute(1)
    }, [selectedCateId]);

    // console.log(selectedCateId)

    // Get lessons by category id
    useEffect(() => {
        if (selectedCateId === -1) return;

        setIsLoadingLesson(true);
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
                setIsLoadingLesson(false);
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

    console.log(lessonRoute)

    if (loadingCate) return <Skeleton />
    return (
        <div id="lesson">
            <div className="page-head">
                <span className="eyebrow">Xây dựng lộ trình học tập hiệu quả</span>
                <h1>Lộ trình học</h1>
                <p>Học chữ Hàn cùng AI đưa cho bạn một kế hoạch chi tiết giúp bạn xác định mục tiêu, các bước cần làm, thời gian và tài nguyên cần thiết để nắm vững kiến thức hoặc kỹ năng mới một cách khoa học và hiệu quả.</p>
            </div>

            <div className="lesson-shell">
                <div className="card curriculum">
                    <div className="curriculum-head">
                        <h3>Lộ trình học</h3>
                        <div className="ov-track"><div className="ov-fill" style={{width: '25%'}} /></div>
                        <p>1/4 chương đã hoàn thành</p>
                    </div>

                    {
                        categories.map((item) => (
                            <div
                                key={item.id}
                                className={`module ${selectedCateId === item.id ? `expanded active` : ``}`}
                            >
                                <div className="module-head" onClick={() => selectedClickAgain(item.id)}>
                                    {
                                        item.learned ? (
                                            <div className="module-status done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
                                        ) : (
                                            <div className="module-status current"></div>
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
                                            )) : (
                                                <Skeleton />
                                            )
                                    }
                                </div>
                            </div>
                        ))
                    }

                    {/*<div className="module">*/}
                    {/*    <div className="module-head">*/}
                    {/*        <div className="module-status done"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>*/}
                    {/*        <div className="module-title"><p>Nguyên âm cơ bản</p><span>Video · Nội dung · 5 câu luyện tập</span></div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="module expanded" data-module="1">*/}
                    {/*    <div className="module-head">*/}
                    {/*        <div className="module-status current"></div>*/}
                    {/*        <div className="module-title"><p>Nguyên âm cơ bản</p><span>Video · Nội dung · 5 câu luyện tập</span></div>*/}
                    {/*    </div>*/}

                    {/*    <div className="submodule-list">*/}
                    {/*        <div className="sub-item active">*/}
                    {/*            <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>*/}
                    {/*            Video bài giảng*/}
                    {/*        </div>*/}

                    {/*        <div className="sub-item">*/}
                    {/*            <svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z"/><path d="M17 3v16"/></svg>*/}
                    {/*            Nội dung &amp; thứ tự nét*/}
                    {/*        </div>*/}

                    {/*        <div className="sub-item">*/}
                    {/*            <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>*/}
                    {/*            Bài luyện tập (5 câu)*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="module" data-module="2">*/}
                    {/*    <div className="module-head">*/}
                    {/*        <div className="module-status locked"><svg viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/><path d="M8 11V7a4 4 0 118 0v4"/></svg></div>*/}
                    {/*        <div className="module-title"><p>Phụ âm cơ bản</p><span>Video · Nội dung · 7 câu luyện tập</span></div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="module" data-module="3">*/}
                    {/*    <div className="module-head">*/}
                    {/*        <div className="module-status locked"><svg viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/><path d="M8 11V7a4 4 0 118 0v4"/></svg></div>*/}
                    {/*        <div className="module-title"><p>Âm tiết ghép</p><span>Video · Bộ ghép tương tác</span></div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {
                    selectedCateId > 0 ?
                        (
                            <div className="card content-card">
                                <div className="video-player">
                                    {
                                        lessonRoute?.youtubeId ? (
                                            <ReactPlayer
                                                src={`https://www.youtube.com/watch?v=${lessonRoute?.youtubeId}`}
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
                                    <h2>{lessonRoute?.name}</h2>
                                    <p>{lessonRoute?.des}</p>
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
                                    {
                                        selectedCateId === 2 ? (
                                            <div className="demo-card" style={{marginBottom: '24px'}}>
                                                <CharHangul isVowels={true}/>
                                                <div className="status-line" id="statusLine"></div>
                                            </div>
                                        ) : selectedCateId === 3 ? (
                                            <div className="demo-card" style={{marginBottom: '24px'}}>
                                                <CharHangul isVowels={false}/>
                                                <div className="status-line" id="statusLine"></div>
                                            </div>
                                        ) : selectedCateId === 4 ? (
                                            <Combine />
                                        ) : (
                                            <div className="stroke-detail" id="strokeDetail"></div>
                                        )
                                    }
                                </div>

                                <div className="tab-panel" id="panelQuiz">
                                    <div id="quizArea"></div>
                                </div>
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
        </div>
    );
};

export default LessonRoute;