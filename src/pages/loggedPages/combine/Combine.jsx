import React, {useEffect, useState} from 'react';
import './Combine.css';
import {
    CONSONANT,
    VOWELS,
    FINAL_CONSONANTS,
    SINGLE_FINAL_CONSONANTS,
    composeHangul,
    DOUBLE_FINAL_CONSONANTS
} from "../../../components/hangul/hangulHelper.js";

const Combine = ({singleConsonant}) => {
    const [selectedVowels, setSelectedVowels] = useState(-1);
    const [selectedConsonant, setSelectedConsonant] = useState(-1);
    const [selectedFinalConsonant, setSelectedFinalConsonant] = useState(0);
    const charList = singleConsonant ? SINGLE_FINAL_CONSONANTS : DOUBLE_FINAL_CONSONANTS;
    const combinedChar = composeHangul(selectedConsonant, selectedVowels, selectedFinalConsonant, singleConsonant);

    return (
        <div className="combine-card" id="combinePanel">
            <div className="combine-head">
                <h3>Ghép phụ âm và nguyên âm thành âm tiết</h3>
                <p>Chọn 1 phụ âm và 1 nguyên âm bên dưới để tạo thành một âm tiết Hangul hoàn chỉnh.</p>
            </div>

            <div className="chip-group">
                <div className="chip-group-label">Phụ âm</div>
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
                <div className="chip-group-label">Nguyên âm</div>
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

            <div className="chip-group">
                <div className="chip-group-label">Patchim {singleConsonant ? `đơn` : `đôi`}</div>
                <div className="chip-row" id="medialChips">
                    {
                        charList.map((item, index) => (
                            <div
                                onClick={() => setSelectedFinalConsonant(index)}
                                className={`chip ${selectedFinalConsonant === index ? `selected initial` : ``}`}
                            >{item.char}</div>
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
                            <p>Chọn 1 phụ âm, 1 nguyên âm và 1 patchim ở trên để xem âm tiết được ghép.</p>
                        ) : (
                            <p className="preview-text">
                                <strong style={{color: 'var(--ink)'}}>{CONSONANT[selectedConsonant]}</strong>
                                + <strong style={{color: 'var(--ink)'}}>{VOWELS[selectedVowels]}</strong>
                                {selectedFinalConsonant !== 0 && (
                                    <>
                                       + <strong style={{color: 'var(--ink)'}}>{FINAL_CONSONANTS[selectedFinalConsonant]}</strong>
                                    </>
                                )}
                                ghép thành <strong style={{color: 'var(--celadon-dark)'}}>{combinedChar}</strong>
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Combine;