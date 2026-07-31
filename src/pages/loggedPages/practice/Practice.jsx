import React from 'react';
import './Practice.css';

const Practice = () => {
    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Luyện viết cùng AI</span>
                    <h1>Luyện viết chữ tiếng Hàn</h1>
                    <p>Viết đè lên chữ mẫu, sau đó gửi để AI phân tích và chấm điểm.</p>
                </div>
            </div>

            <div className="practice-layout">
                <div className="card canvas-card">
                    <div className="canvas-top-row">
                        <div>
                            <p style={{margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)'}}>Chữ đang luyện</p>
                            <p style={{margin: '2px 0 0', fontSize: '13px', fontWeight: 600, fontFamily:'JetBrains Mono, monospace'}}>HAN · 한</p>
                        </div>

                        <div className="char-switch"></div>
                    </div>

                    <div className="canvas-wrap">
                        <div className="canvas" id="templateCanvas"></div>
                        <div className="canvas" id="drawCanvas"></div>
                    </div>

                    <div className="canvas-actions">
                        <button className="btn btn-ghost">Xóa</button>
                        <button className="btn btn-ghost">Viết lại</button>
                        <button className="btn btn-primary">Gửi để AI chấm điểm</button>
                    </div>
                </div>

                <div className="feedback-panel">
                    <div className="card score-wrap" id="scoreCard">
                        <div className="fb-empty" id="fbEmpty">Viết chữ mẫu rồi bấm<br/><strong>"Gửi để AI chấm
                            điểm"</strong> để xem kết quả.
                        </div>

                        <div className="scoreResult">
                            <div className="score-num" id="scoreNum">0%</div>
                            <div className="score-label">Độ tương đồng với chữ mẫu</div>
                            <div className="score-track">
                                <div className="score-fill" id="scoreFill"></div>
                            </div>

                            <ul className="fb-list" id="fbList"></ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Practice;