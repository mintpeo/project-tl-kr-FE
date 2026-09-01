import React, { useEffect, useState, useRef } from 'react';
import './Practice.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import Skeleton from "../../../components/loading/Skeleton.jsx";

const Practice = () => {
    const {data: characters, loading: isLoading} = useFetch(`${API_URL}/character/all`);
    const vowels = characters.filter(char => char.type === "VOWEL");
    const consonants = characters.filter(char => char.type === "CONSONANT");

    const [selectedCate, setSelectedCate] = useState(0);
    const [charList, setCharList] = useState([]);
    const [selectedChar, setSelectedChar] = useState(-1);
    const [checked, setChecked] = useState(true);
    const [predict, setPredict] = useState();
    const [feedBack, setFeedBack] = useState([]);

    useEffect(() => {
        setCharList(vowels);
    }, [characters]);

    const cateList = [
        { name: 'Nguyên âm' },
        { name: 'Phụ âm' },
        // { name: 'Âm ghép' }
    ];

    const changeChar = (label) => {
        return charList.filter(item => item.transcription === label);
    }

    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const savePNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.fillStyle = "#FFFFFF";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        // Lấy dữ liệu ảnh Base64 (Nền trắng, nét đen)
        const image = tempCanvas.toDataURL("image/png");

        // Tải ảnh về máy để test với Python model
        const link = document.createElement("a");
        link.href = image;
        link.download = "jamo-test.png";
        link.click();
    }

    const submitCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Tao canvas tam de to nen trang (giong logic cu)
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.fillStyle = "white";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL("image/png");

        try {
            const res = await fetch("http://localhost:8080/api/predict/data-url", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataUrl }),
            });

            const data = await res.json();
            console.log("Ket qua du doan:", data);
            setPredict(data.prediction);
            setFeedBack(data.assessment.feedback);
        } catch (e) {
            console.error("Loi khi goi API predict data url:", e);
        }
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        isDrawing.current = true;

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const draw = (e) => {
        if (!isDrawing.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Cấu hình nét vẽ chuẩn
        ctx.strokeStyle = "black";
        ctx.lineWidth = 14; // Tăng độ dày nét chữ để CNN nhận diện dễ hơn
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

    useEffect(() => {
        if (selectedCate === 0) setCharList(vowels);
        if (selectedCate === 1) setCharList(consonants);
        setSelectedChar(-1);
    }, [selectedCate]);

    const toggle = () => {
        setChecked(!checked);
    };

    if (isLoading) return <Skeleton />
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
                                <div
                                    key={index}
                                    onClick={() => setSelectedCate(index)}
                                    className={`cat-pill ${selectedCate === index ? 'active' : ''}`}
                                >
                                    {item.name}
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="selector-top">
                    <div className="cat-pills">
                        {
                            charList.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedChar(index);
                                        clearCanvas();
                                    }}
                                    className={`cat-pill ${selectedChar === index ? 'active' : ''}`}
                                >
                                    {item.name}
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="char-chip-row" id="charChipRow"></div>
            </div>

            <div className="practice-layout">
                <div className="card canvas-card">
                    <div className="canvas-top-row">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)' }}>Chữ đang luyện:</p>
                            <p className={`${selectedChar >= 0 ? `selected-char` : ``}`}>
                                {selectedChar >= 0 ? charList[selectedChar]?.name + `-` + charList[selectedChar]?.transcription : 'Chưa chọn'}
                            </p>
                        </div>

                        <div className="char-switch">
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)' }}>Hiện thứ tự nét</p>

                            <button
                                type="button"
                                className={`toggle-btn ${checked ? 'active' : ''}`}
                                onClick={toggle}
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                    </div>

                    <div className="canvas-wrap">
                        {
                            selectedChar >= 0 && (
                                <div className={`char-guide ${checked ? '' : 'hide-stroke-order'}`}>
                                    <img className="hide-stroke-order" src={`http://localhost:8080${charList[selectedChar]?.strokeSvgUrl}`} alt={charList[selectedChar]?.name}/>
                                </div>
                            )
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
                        <button className="btn btn-ghost" onClick={clearCanvas}>Xóa</button>
                        <button className="btn btn-ghost" onClick={savePNG}>Save PNG</button>
                        <button className="btn btn-primary" onClick={submitCanvas}>Gửi để AI chấm điểm</button>
                    </div>
                </div>

                <div className="feedback-panel">
                    <div className="card score-wrap" id="scoreCard">
                        <div className="fb-empty" id="fbEmpty">
                            Viết chữ mẫu rồi bấm<br /><strong>"Gửi để AI chấm điểm"</strong> để xem kết quả.

                            <p>Chu nhan dien: {predict?.label}, voi do chinh xac: {predict?.confidence}</p>
                            {
                                feedBack.map((fb) => (
                                    <p>{fb.text}</p>
                                ))
                            }
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