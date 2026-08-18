export const CONSONANT = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
export const FINAL_CONSONANTS = ['',   'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
export const SINGLE_FINAL_CONSONANTS = [
    {char: ' ', index: 0},
    { char: 'ㄱ', index: 1 },
    { char: 'ㄲ', index: 2 },
    { char: 'ㄴ', index: 4 },
    { char: 'ㄷ', index: 7 },
    { char: 'ㄹ', index: 8 },
    { char: 'ㅁ', index: 16 },
    { char: 'ㅂ', index: 17 },
    { char: 'ㅅ', index: 19 },
    { char: 'ㅆ', index: 20 },
    { char: 'ㅇ', index: 21 },
    { char: 'ㅈ', index: 22 },
    { char: 'ㅊ', index: 23 },
    { char: 'ㅋ', index: 24 },
    { char: 'ㅌ', index: 25 },
    { char: 'ㅍ', index: 26 },
    { char: 'ㅎ', index: 27 },
];
export const DOUBLE_FINAL_CONSONANTS = [
    {char: ' ', index: 0},
    { char: 'ㄳ', index: 3 },
    { char: 'ㄵ', index: 5 },
    { char: 'ㄶ', index: 6 },
    { char: 'ㄺ', index: 9 },
    { char: 'ㄻ', index: 10 },
    { char: 'ㄼ', index: 11 },
    { char: 'ㄽ', index: 12 },
    { char: 'ㄾ', index: 13 },
    { char: 'ㄿ', index: 14 },
    { char: 'ㅀ', index: 15 },
    { char: 'ㅄ', index: 18 },
];

export function composeHangul(consonantIndex, vowelsIndex, finalConsonant, singleConsonant) {
    if (vowelsIndex < 0 || consonantIndex < 0) return '';

    const list = singleConsonant ? SINGLE_FINAL_CONSONANTS : DOUBLE_FINAL_CONSONANTS;
    const patchimIndex = list[finalConsonant]?.index ?? 0;

    const unicodeVal = 44032 + (consonantIndex * 588) + (vowelsIndex * 28) + patchimIndex;
    return String.fromCharCode(unicodeVal);
}