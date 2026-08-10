import React, {useState} from 'react';
import './Combine.css';
import {CONSONANT, VOWELS, composeHangul} from "../../../components/hangul/hangulHelper.js";

const Combine = () => {
    const [selectedVowels, setSelectedVowels] = useState(-1);
    const [selectedConsonant, setSelectedConsonant] = useState(-1);
    const combinedChar = composeHangul(selectedConsonant, selectedVowels);

    return (
        <div className="card combine-card" id="combinePanel">
            <div className="combine-head">
                <h3>Ghép phụ âm và nguyên âm thành âm tiết</h3>
                <p>Chọn 1 phụ âm và 1 nguyên âm bên dưới để tạo thành một âm tiết Hangul hoàn chỉnh.</p>
            </div>

            <div className="chip-group">
                <div className="chip-group-label">Phụ âm (초성)</div>
                <div className="chip-row" id="initialChips">
                    {
                        CONSONANT.map((item, index) => (
                            <div
                                onClick={() => setSelectedConsonant(index)}
                                className={`chip ${selectedConsonant === index ? `selected initial` : ``}`}
                            >{item}</div>
                        ))
                    }
                </div>
            </div>

            <div className="chip-group">
                <div className="chip-group-label">Nguyên âm (중성)</div>
                <div className="chip-row" id="medialChips">
                    {
                        VOWELS.map((item, index) => (
                            <div
                                onClick={() => setSelectedVowels(index)}
                                className={`chip ${selectedVowels === index ? `selected medial` : ``}`}
                            >{item}</div>
                        ))
                    }
                </div>
            </div>

            <div className="combine-preview">
                <div className="preview-box">
                    <span className={`preview-glyph ${combinedChar.length <= 0 ? `placeholder` : ``}`} id="previewGlyph">{combinedChar.length <= 0 ? '?' : combinedChar}</span>
                </div>

                <div className="preview-info">
                    {
                        combinedChar.length <= 0 ? (
                            <p>Chọn 1 phụ âm và 1 nguyên âm ở trên để xem âm tiết được ghép.</p>
                        ) : (
                            <p className="preview-text">
                                <strong style={{color: 'var(--ink)'}}>{CONSONANT[selectedConsonant]}</strong> + <strong style={{color: 'var(--ink)'}}>{VOWELS[selectedVowels]}</strong> ghép thành <strong style={{color: 'var(--celadon-dark)'}}>{combinedChar}</strong>
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Combine;