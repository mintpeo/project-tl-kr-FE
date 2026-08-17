import React, {useEffect, useState} from 'react';
import {CHAR_VOWELS, CHAR_CONSONANT, CHAR_VOWELS_PAIR, CHAR_VOWELS_SINGLE, CHAR_CONSONANT_SINGLE, CHAR_CONSONANT_PAIR} from "./hangulHelper.js";

const CharHangul = ({selectedChar, isVowels}) => {
    const char = isVowels ? CHAR_VOWELS : CHAR_CONSONANT;
    const char_single = isVowels ? CHAR_VOWELS_SINGLE : CHAR_CONSONANT_SINGLE;
    const char_pair = isVowels ? CHAR_VOWELS_PAIR : CHAR_CONSONANT_PAIR

    const [selectedSingleIndex, setSelectedSingleIndex] = useState(0);
    const selectedSingle = char_single[selectedSingleIndex] || char_single[0];

    const [selectedPairIndex, setSelectedPairIndex] = useState(0);
    const selectedPair = char_pair[selectedPairIndex] || char_pair[0];

    useEffect(() => {
        setSelectedSingleIndex(0);
        setSelectedPairIndex(0);
    }, [isVowels]);

    return (
        <>
            <p>{isVowels ? 'Nguyên âm' : 'Phụ âm'} có tổng cộng <strong>{char.length} kí tự</strong> được chia thành:</p>
            <p><strong>{isVowels ? CHAR_VOWELS_SINGLE.length : CHAR_CONSONANT_SINGLE.length}</strong> {isVowels ? 'Nguyên âm đơn' : 'Phụ âm đơn'}:</p>
            <div className="char-switch" id="charSwitch">
                {
                    char_single.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedSingleIndex(index)}
                            className={index === selectedSingleIndex ? 'active' : ''}
                        >
                            {item.name}
                            <p>{item.transcription}</p>
                        </button>
                    ))
                }
            </div>

            <div
                className="svg-stage"
                dangerouslySetInnerHTML={{ __html: selectedSingle.content }}
            />

            <p><strong>{isVowels ? CHAR_VOWELS_PAIR.length : CHAR_CONSONANT_PAIR.length}</strong> {isVowels ? 'Nguyên âm đôi' : 'Phụ âm kép'}:</p>
            <div className="char-switch" id="charSwitch">
                {
                    char_pair.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedPairIndex(index)}
                            className={index === selectedPairIndex ? 'active' : ''}
                        >
                            {item.name}
                            <p>{item.transcription}</p>
                        </button>
                    ))
                }
            </div>

            <div
                className="svg-stage"
                dangerouslySetInnerHTML={{ __html: selectedPair.content }}
            />
        </>
    );
};

export default CharHangul;