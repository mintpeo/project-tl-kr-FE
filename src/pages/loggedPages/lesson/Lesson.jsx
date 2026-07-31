import React from 'react';
import './Lesson.css';

const Lesson = () => {
    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Bảng chữ cái Hangul</span>
                    <h1>Bài học</h1>
                    <p>Chạm vào một chữ để xem thứ tự nét và bắt đầu luyện viết.</p>
                </div>
            </div>
            <div className="char-toolbar">
                <div className="pill active">Nguyên âm</div>
                <div className="pill">Phụ âm</div>
                <div className="pill">Âm tiết ghép</div>
            </div>
            <div className="char-grid" id="charGrid"></div>
        </>
    );
};

export default Lesson;