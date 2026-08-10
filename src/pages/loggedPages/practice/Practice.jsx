import React, {useEffect, useState, useRef} from 'react';
import './Practice.css';
import {CHAR_CONSONANT, CHAR_VOWELS} from "../../../components/hangul/hangulHelper.js";

const Practice = () => {
    const [selectedCate, setSelectedCate] = useState(0);
    const [charList, setCharList] = useState([]);
    const [selectedChar, setSelectedChar] = useState(0);

    const cateList = [
        {name: 'Nguyên âm'},
        {name: 'Phụ âm'},
        {name: 'Âm ghép'}
    ];

    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        isDrawing.current = true;

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!isDrawing.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo(
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY
        );

        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    };

    console.log(selectedChar)

    useEffect(() => {
        if (selectedCate === 0) setCharList(CHAR_VOWELS);
        if (selectedCate === 1) setCharList(CHAR_CONSONANT);
    }, [selectedCate]);

    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Luyện viết cùng AI</span>
                    <h1>Luyện viết chữ tiếng Hàn</h1>
                    <p>Viết đè lên chữ mẫu, sau đó gửi để AI phân tích và chấm điểm.</p>
                </div>
            </div>

            <div className="card selector-card">
                <div className="selector-top">
                    <span className="selector-label">Chọn ký tự để luyện</span>

                    <div className="cat-pills">
                        {
                            cateList.map((item, index) => (
                                <div key={index}
                                    onClick={() => setSelectedCate(index)}
                                    className={`cat-pill ${selectedCate === index ? `active` : ``}`}
                                >{item.name}</div>
                            ))
                        }
                    </div>
                </div>

                <div className="selector-top">
                    <div className="cat-pills">
                        {
                            charList.map((item, index) => (
                                <div key={index}
                                    onClick={() => {
                                        setSelectedChar(index);
                                        clearCanvas();
                                    }}
                                    className={`cat-pill ${selectedChar === index ? `active` : ``}`}
                                >{item.name}</div>
                            ))
                        }
                    </div>
                </div>

                <div className="char-chip-row" id="charChipRow"></div>
            </div>

            <div className="practice-layout">
                <div className="card canvas-card">
                    <div className="canvas-top-row">
                        <div>
                            <p style={{margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)'}}>Chữ đang luyện</p>
                            <p style={{
                                margin: '2px 0 0',
                                fontSize: '13px',
                                fontWeight: 600,
                                fontFamily: 'JetBrains Mono, monospace'
                            }}>HAN · 한</p>
                        </div>

                        <div className="char-switch"></div>
                    </div>

                    <div className="canvas-wrap">
                        {
                            selectedChar <= 0 ? (
                                <div
                                    className="char-guide hide-stroke-order"
                                    dangerouslySetInnerHTML={{ __html: charList[selectedChar].content }}
                                />
                            ) : (<></>)
                        }

                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={500}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                        />
                    </div>

                    <div className="canvas-actions">
                        <button className="btn btn-ghost" onClick={() => clearCanvas()}>Xóa</button>
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