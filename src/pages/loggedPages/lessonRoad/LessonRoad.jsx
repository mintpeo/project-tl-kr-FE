import React, {useEffect, useRef, useState} from 'react';
import './LessonRoad.css';
import {API_URL, LOCAL_STORAGE_KEYS} from "../../../components/API_URL.jsx";
import LessonRoute from "../lessonRoute/LessonRoute.jsx";
import useFetch from "../../../components/use/useFetch.js";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import {usePost} from "../../../components/use/usePost.js";

const LessonRoad = () => {
    const user_info = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
    const user = JSON.parse(user_info);

    const {data: categories, loading: isLoading} = useFetch(`${API_URL}/lesson-cate-route/all`);
    const {executePost: createRoad} = usePost(`${API_URL}/user-lesson-progress/create-road`);

    // If have new Lesson Road => Add User
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (hasInitialized.current) return;
        if (!user?.lessonRoad) return;
        hasInitialized.current = true;

        const handleWhenHaveNewLesson = async () => {

            const req = {
                userId: user.userId,
            }

            try {
                 await createRoad(req);
            } catch (e) {
                console.log("Error When Have New Lesson", e);
            }
        }

        handleWhenHaveNewLesson();
    }, []);

    const handleCreateRoad = async () => {
        const req = {
            userId: user.userId,
        }

        try {
            const data = await createRoad(req);
            if (data) {
                alert("Tiến hành học thôi!");
                window.location.reload();
            }
        } catch (e) {
            console.log("Error Create Road", e);
        }
    }

    if (isLoading) return <Skeleton />
    return (
        <div id="lesson-road">
            <div className="page-head">
                <span className="eyebrow">Xây dựng lộ trình học tập hiệu quả</span>
                <h1>Lộ trình học</h1>
                <p>Học chữ Hàn cùng AI đưa cho bạn một kế hoạch chi tiết giúp bạn xác định mục tiêu, các bước cần làm, thời gian và tài nguyên cần thiết để nắm vững kiến thức hoặc kỹ năng mới một cách khoa học và hiệu quả.</p>
            </div>

            {
                user?.lessonRoad ? (
                    <LessonRoute />
                ) : (
                    <div className="card content-panel">
                        <p className="intro-text">
                            Được xây dựng từ những kiến thức cơ bản đến nâng cao, giúp người học từng bước làm quen
                            và sử dụng tiếng Hàn một cách hiệu quả. Trước tiên, bạn sẽ học các phụ âm và nguyên âm
                            cơ bản, sau đó luyện ghép chúng thành các âm tiết và từ đơn giản. Tiếp theo, người học sẽ
                            làm quen với quy tắc phát âm, phụ âm cuối và cách viết Hangul đúng thứ tự nét. Cuối cùng,
                            bạn có thể luyện đọc, viết và áp dụng Hangul vào các từ vựng và câu tiếng Hàn trong thực tế.
                        </p>

                        <div className="preview-list">
                            {categories.map((category, index) => (
                                <div key={category.id} className="preview-item">
                                    <span className="preview-num">{index + 1}</span>

                                    <div>
                                        <p>{category.name}</p>
                                        <span>{category.lessonsSize} video · {category.des}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-start-big" onClick={() => handleCreateRoad()}>
                            Bắt đầu học ngay →
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default LessonRoad;