// Đổi bản ghi của trình duyệt (webm/opus, mp4/aac...) thành WAV 16 kHz, mono, 16-bit.
// Làm ở FE để BE không cần ffmpeg và chạy được cả Safari/iPhone.
export async function blobToWav16k(blob) {
    const arrayBuf = await blob.arrayBuffer();

    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const decoded = await new Promise((resolve, reject) =>
        ctx.decodeAudioData(arrayBuf, resolve, reject)
    );
    ctx.close();

    // Resample về 16 kHz mono
    const length = Math.max(1, Math.ceil(decoded.duration * 16000));
    const offline = new OfflineAudioContext(1, length, 16000);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start();
    const rendered = await offline.startRendering();

    return encodeWav(rendered.getChannelData(0), 16000);
}

export function encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeStr = (offset, str) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);              // kích thước khối fmt
    view.setUint16(20, 1, true);               // PCM
    view.setUint16(22, 1, true);               // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);  // byte rate
    view.setUint16(32, 2, true);               // block align
    view.setUint16(34, 16, true);              // 16 bit
    writeStr(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([view], { type: 'audio/wav' });
}