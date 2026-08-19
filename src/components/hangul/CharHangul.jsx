import React, {useEffect, useState} from 'react';
import useFetch from "../use/useFetch.js";
import {API_URL} from "../API_URL.jsx";

const CharHangul = ({isVowels}) => {
    const {data: characters} = useFetch(`${API_URL}/character/all`);
    const vowels = characters.filter(char => char.type === "VOWEL");
    const consonants = characters.filter(char => char.type === "CONSONANT");

    const vowelsSingle = vowels.filter(vowel => vowel.double === false);
    const vowelsPair = vowels.filter(vowel => vowel.double === true);
    const consonantsSingle = consonants.filter(consonant => consonant.double === false);
    const consonantsPair = consonants.filter(consonant => consonant.double === true);

    const char = isVowels ? vowels : consonants;
    const char_single = isVowels ? vowelsSingle : consonantsSingle;
    const char_pair = isVowels ? vowelsPair : consonantsPair

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
            <p><strong>{isVowels ? vowelsSingle.length : consonantsSingle.length}</strong> {isVowels ? 'Nguyên âm đơn' : 'Phụ âm đơn'}:</p>
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

            <div className="svg-stage">
                <img src={`http://localhost:8080${selectedSingle?.strokeSvgUrl}`} alt={selectedSingle?.name}/>
            </div>

            <p><strong>{isVowels ? vowelsPair.length : consonantsPair.length}</strong> {isVowels ? 'Nguyên âm đôi' : 'Phụ âm kép'}:</p>
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

            <div className="svg-stage">
                <img src={`http://localhost:8080${selectedPair?.strokeSvgUrl}`} alt={selectedPair?.name}/>
            </div>
        </>
    );
};

export default CharHangul;