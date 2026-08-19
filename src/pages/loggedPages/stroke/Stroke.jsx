import React from 'react';
import './Stroke.css';
import CharHangul from "../../../components/hangul/CharHangul.jsx";

const Stroke = () => {
    const selectedVowelsIndex = 0;
    const selectedConsonantIndex = 0;

    return (
        <div className="stroke">
            <h1>Thứ tự các nét chữ</h1>
            <div className="sub">
                <p>Nguyên tắc chung khi viết chữ Hàn:</p>
                <ul style={{margin: 0}}>
                    <li><p>Viết các nét phía trên hoặc bên trái trước.</p></li>
                    <li><p>Viết các nét phía dưới hoặc bên phải sau.</p></li>
                    <li><p>Một âm tiết hoàn chỉnh được viết theo thứ tự từ trái qua phải, từ trên xuống dưới.</p></li>
                </ul>
            </div>

            <div className="demo-card" style={{marginBottom: '24px'}}>
                <CharHangul selectedChar={selectedVowelsIndex} isVowels={true}/>
                <div className="status-line" id="statusLine"></div>
            </div>

            <div className="demo-card">
                <CharHangul selectedChar={selectedConsonantIndex} isVowels={false}/>
                <div className="status-line" id="statusLine"></div>
            </div>
        </div>
    );
};

export default Stroke;