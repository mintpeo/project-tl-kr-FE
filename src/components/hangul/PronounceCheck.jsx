import React, { useEffect, useRef, useState } from 'react';
import { blobToWav16k } from './audioToWav.js';
import './PronounceCheck.css';

const MAX_RECORD_MS = 4000;   // tự dừng sau 4 giây
const CANON = { 'ㅐ': 'ㅔ', 'ㅒ': 'ㅖ' };           // 2 cặp phát âm giống nhau
const canon = (c) => CANON[c] || c;
const sameJamo = (a, b) => !!a && !!b && canon(a) === canon(b);

/**
 * Khung nhận âm thanh: bấm mic -> đọc -> bấm lần nữa (hoặc tự dừng) -> gửi BE chấm.
 * Đúng: khung xanh + ✓. Sai: khung đỏ + ✗.
 *
 * Props:
 *  - expected   : chữ cần đọc, ví dụ "아"  (khuyên dùng âm tiết, không dùng jamo đơn)
 *  - hints      : (tuỳ chọn) danh sách gợi ý cho Google, ví dụ ["아","어","오","우"]
 *  - endpoint   : URL BE, ví dụ `${API_URL}/speech/check`
 *  - headers    : (tuỳ chọn) ví dụ { Authorization: `Bearer ${token}` }
 *  - onResult   : (tuỳ chọn) ({ correct, recognized, confidence }) => void
 */
export default function PronounceCheck({ expected, kind = 'consonant', endpoint, headers = {}, onResult }) {    const [status, setStatus] = useState('idle');   // idle | recording | processing | correct | wrong | error
    const [recognized, setRecognized] = useState('');
    const [message, setMessage] = useState('');

    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // Đổi chữ cần đọc thì quay về trạng thái ban đầu
    useEffect(() => {
        setStatus('idle');
        setRecognized('');
        setMessage('');
    }, [expected]);

    // Dọn dẹp khi rời trang
    useEffect(() => () => {
        clearTimeout(timerRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
    }, []);

    const startRecording = async () => {
        setRecognized('');
        setMessage('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];

            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
            recorder.onstop = handleStop;
            recorder.start();

            setStatus('recording');
            timerRef.current = setTimeout(stopRecording, MAX_RECORD_MS);
        } catch (err) {
            console.error('Mic error:', err);
            setStatus('error');
            setMessage('Không mở được micro. Hãy cho phép quyền micro trên trình duyệt.');
        }
    };

    const stopRecording = () => {
        clearTimeout(timerRef.current);
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
    };

    // Chuẩn hóa chuỗi trước khi so sánh
    const normalizeText = (text) => {
        return (text || "").normalize("NFC").trim();
    };

    const handleStop = async () => {
        setStatus('processing');
        try {
            const raw = new Blob(chunksRef.current, {
                type: recorderRef.current?.mimeType || 'audio/webm'
            });
            const wav = await blobToWav16k(raw);

            const form = new FormData();
            form.append('audio', wav, 'speech.wav');
            form.append('kind', kind);                 // "vowel" | "consonant"

            const res = await fetch(endpoint, { method: 'POST', headers, body: form });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            console.log('speech result:', data);       // phải có char: "ㅏ"

            const heard = data?.char || '';            // BE đã ánh xạ về 1 ký tự
            const correct = sameJamo(heard, expected); // FE so sánh với ký tự đang chọn

            setRecognized(heard);
            setMessage(
                correct ? 'Chính xác!'
                    : heard ? 'Chưa đúng, thử lại nhé.'
                        : 'Không nghe rõ, hãy đọc lại.'
            );
            setStatus(correct ? 'correct' : 'wrong');

            onResult?.({ ...data, expected, correct });
        } catch (err) {
            console.error('Speech check error:', err);
            setStatus('error');
            setMessage('Có lỗi khi nhận diện phát âm, hãy thử lại.');
        }
    };


    const onMicClick = () => {
        if (status === 'recording') stopRecording();
        else if (status !== 'processing') startRecording();
    };

    const label = {
        idle: 'Bấm mic rồi đọc',
        recording: 'Đang nghe... bấm để dừng',
        processing: 'Đang chấm...',
        correct: 'Chính xác!',
        wrong: 'Chưa đúng, thử lại nhé',
        error: message || 'Có lỗi xảy ra',
    }[status];

    return (
        <div className={`pc pc-${status}`}>
            <p className="pc-target">Đọc: <span>{expected}</span></p>

            <button
                type="button"
                className="pc-mic"
                onClick={onMicClick}
                disabled={status === 'processing'}
                aria-label={status === 'recording' ? 'Dừng thu âm' : 'Bắt đầu thu âm'}
            >
                {status === 'correct' ? (
                    <svg viewBox="0 0 24 24" className="pc-icon"><path d="M20 6L9 17l-5-5" /></svg>
                ) : status === 'wrong' ? (
                    <svg viewBox="0 0 24 24" className="pc-icon"><path d="M18 6L6 18M6 6l12 12" /></svg>
                ) : status === 'processing' ? (
                    <span className="pc-spinner" />
                ) : status === 'recording' ? (
                    <span className="pc-stop" />
                ) : (
                    <svg viewBox="0 0 24 24" className="pc-icon mic">
                        <rect x="9" y="3" width="6" height="11" rx="3" />
                        <path d="M5 11a7 7 0 0014 0M12 18v3" />
                    </svg>
                )}
            </button>

            <p className="pc-label">{label}</p>

            {(status === 'correct' || status === 'wrong') && (
                <p className="pc-heard">
                    Hệ thống nghe được: <strong>{recognized || '(không nghe rõ)'}</strong>
                </p>
            )}

            {(status === 'correct' || status === 'wrong' || status === 'error') && (
                <button type="button" className="pc-retry" onClick={startRecording}>Đọc lại</button>
            )}
        </div>
    );
}