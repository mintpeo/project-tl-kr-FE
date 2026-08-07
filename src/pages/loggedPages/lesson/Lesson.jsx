import React, {useCallback, useState} from 'react';
import './Lesson.css';
import VideoPlayer from "../../../components/VideoPlayer.jsx";
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";

const Lesson = () => {
    // Get List Category
    const {data: cate} = useFetch(`${API_URL}/lesson-cate/get-categories`);

    const videoUrl= 'https://www.youtube.com/watch?v=EP-LQ3Vtmk4';
    const [isEnded, setIsEnded] = useState(false);
    const [chooseCate, setChooseCate] = useState(1);

    const categories = cate.map((item) => ({
        id: item.id,
        orderIndex: item.orderIndex,
        name: item.categoryName
    }))
    console.log(categories);

    // Hàm xử lý khi người dùng xem xong video
    const handleVideoEnded = useCallback(() => {
        setIsEnded(true);
        console.log('Đã hoàn thành bài học!');
    }, []);

    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Bảng chữ cái Hangul</span>
                    <h1>Bài học</h1>
                    <p>Chọn phần học để bắt đầu học.</p>
                </div>
            </div>

            <div className="char-toolbar">
                {
                    categories
                        .slice().sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((item) => (
                        <div
                            key={item.id}
                            className={`pill ${chooseCate === item.id ? `active` : ``}`}
                            onClick={() => setChooseCate(item.id)}
                        >{item.name}</div>
                    ))
                }
            </div>

            {/*<div className="char-grid" id="charGrid"></div>*/}

            <div>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                    <h2>Bài học: Hướng dẫn học tiếng Hàn cơ bản</h2>

                    {/* Wrapper giữ tỉ lệ khung hình 16:9 responsive */}
                    <VideoPlayer url={videoUrl} onEnded={handleVideoEnded} />

                    {/* Thông báo trạng thái */}
                    {isEnded && (
                        <div style={{ marginTop: '15px', color: 'green', fontWeight: 'bold' }}>
                            ✅ Bạn đã xem xong bài học này!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Lesson;