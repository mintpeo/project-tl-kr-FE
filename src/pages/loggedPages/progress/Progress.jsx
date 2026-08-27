import React, { useMemo, useState } from 'react';
import './Progress.css';

/* ============================================================
   DỮ LIỆU — thay bằng dữ liệu thật từ API khi tích hợp backend.
   ============================================================ */
const STATS = [
    { icon: 'check', tone: 'a', num: '86%', label: 'Độ chính xác trung bình' },
    { icon: 'pen', tone: 'b', num: '142', label: 'Lượt luyện viết' },
    { icon: 'book', tone: 'c', num: '11/24', label: 'Ký tự đã thành thạo' },
    { icon: 'flame', tone: 'd', num: '12 ngày', label: 'Chuỗi học liên tiếp' },
];

const CHART_7D = [
    ['T2', 62], ['T3', 71], ['T4', 68], ['T5', 80], ['T6', 77], ['T7', 89], ['CN', 86],
];
const CHART_14D = [
    ['25/7', 58], ['26/7', 63], ['27/7', 60], ['28/7', 66], ['29/7', 71], ['30/7', 69], ['31/7', 74],
    ['1/8', 72], ['2/8', 78], ['3/8', 75], ['4/8', 80], ['5/8', 83], ['6/8', 89], ['7/8', 86],
];

const CATEGORIES = [
    { glyph: 'ㅏ', tone: 'celadon', title: 'Nguyên âm cơ bản', sub: '10 nguyên âm đơn', done: 6, total: 10, unit: 'đã học' },
    { glyph: 'ㄱ', tone: 'gold', title: 'Phụ âm cơ bản', sub: '14 phụ âm đơn', done: 5, total: 14, unit: 'đã học' },
    { glyph: '가', tone: 'plum', title: 'Âm tiết ghép', sub: 'Ghép phụ âm + nguyên âm', done: 23, total: 82, unit: 'âm tiết đã thử' },
];

// score = 0 nghĩa là chưa luyện lần nào
const MASTERY = [
    ['ㅏ', 92], ['ㅑ', 88], ['ㅓ', 85], ['ㅕ', 79], ['ㅗ', 74], ['ㅛ', 68], ['ㅜ', 55], ['ㅠ', 40], ['ㅡ', 0], ['ㅣ', 0],
    ['ㄱ', 90], ['ㄴ', 86], ['ㄷ', 77], ['ㄹ', 71], ['ㅁ', 63], ['ㅂ', 0], ['ㅅ', 0], ['ㅇ', 0],
    ['ㅈ', 0], ['ㅊ', 0], ['ㅋ', 0], ['ㅌ', 0], ['ㅍ', 0], ['ㅎ', 0],
];

const ACHIEVEMENTS = [
    { title: 'Chuỗi 7 ngày', desc: 'Luyện viết 7 ngày liên tiếp', tone: 'gold', locked: false, icon: 'flame' },
    { title: 'Điểm số hoàn hảo', desc: 'Đạt 100% độ tương đồng', tone: 'celadon', locked: false, icon: 'check' },
    { title: 'Hoàn thành nguyên âm', desc: 'Học đủ 10 nguyên âm cơ bản', tone: 'plum', locked: false, icon: 'book' },
    { title: 'Bậc thầy Hangul', desc: 'Thành thạo cả 24 ký tự cơ bản', tone: 'locked', locked: true, icon: 'lock' },
];

/* ============================================================
   ICON — bộ icon inline tối giản, tránh phụ thuộc thư viện ngoài
   ============================================================ */
const ICONS = {
    check: <path d="M20 6L9 17l-5-5" />,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>,
    book: <><path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5z" /><path d="M17 3v16" /></>,
    flame: <path d="M12 2s6 5.5 6 10.5a6 6 0 01-12 0C6 7.5 12 2 12 2z" />,
    lock: <><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /><path d="M8 11V7a4 4 0 118 0v4" /></>,
};
function Icon({ name }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            {ICONS[name]}
        </svg>
    );
}

/* ============================================================
   HELPERS
   ============================================================ */
function masteryTone(score) {
    if (score === 0) return 'none';
    if (score >= 85) return 'strong';   // thành thạo
    if (score >= 70) return 'good';     // tốt
    if (score >= 50) return 'mid';      // đang luyện
    return 'low';                       // cần cải thiện
}

function seedHeatmap(days = 45) {
    return Array.from({ length: days }, () => {
        const r = Math.random();
        if (r > 0.85) return 4;
        if (r > 0.65) return 3;
        if (r > 0.45) return 2;
        if (r > 0.25) return 1;
        return 0;
    });
}

/* ============================================================
   COMPONENT
   ============================================================ */
const Progress = () => {
    const [range, setRange] = useState(7);
    const chartData = range === 7 ? CHART_7D : CHART_14D;
    const heatmap = useMemo(() => seedHeatmap(45), []);

    const completedTotal = MASTERY.filter(([, score]) => score > 0).length;

    return (
        <div className="progress-page">
            <div className="page-head">
                <span className="eyebrow">Thống kê học tập</span>
                <h1>Tiến độ của bạn</h1>
                <p>Theo dõi độ chính xác, chuỗi ngày học và mức độ thành thạo từng ký tự.</p>
            </div>

            {/* ---------------- STAT ROW ---------------- */}
            <div className="stat-row">
                {STATS.map((s) => (
                    <div className="card stat-card" key={s.label}>
                        <div className={`stat-icon tone-${s.tone}`}><Icon name={s.icon} /></div>
                        <div>
                            <div className="stat-num">{s.num}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------------- CHART + HEATMAP ---------------- */}
            <div className="row-2col">
                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Độ chính xác theo thời gian</h3>
                            <p>Điểm trung bình do AI đánh giá mỗi ngày</p>
                        </div>
                        <div className="range-toggle">
                            <button className={range === 7 ? 'active' : ''} onClick={() => setRange(7)}>7 ngày</button>
                            <button className={range === 14 ? 'active' : ''} onClick={() => setRange(14)}>14 ngày</button>
                        </div>
                    </div>
                    <div className="bars">
                        {chartData.map(([label, val]) => (
                            <div className="bar-col" key={label}>
                                <div className="bar-val">{val}</div>
                                <div className="bar" style={{ height: `${val * 1.35}px` }} />
                                <div className="bar-day">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Lịch luyện tập</h3>
                            <p>45 ngày gần nhất</p>
                        </div>
                    </div>
                    <div className="heatmap-grid">
                        {heatmap.map((level, i) => (
                            <div key={i} className="heat-cell" data-level={level || undefined} />
                        ))}
                    </div>
                    <div className="heatmap-foot">
                        <span>Ít hơn</span>
                        <div className="heat-scale">
                            {[0, 1, 2, 3, 4].map((lvl) => (
                                <div key={lvl} className="heat-cell" data-level={lvl || undefined} />
                            ))}
                        </div>
                        <span>Nhiều hơn</span>
                    </div>
                </div>
            </div>

            {/* ---------------- CATEGORY PROGRESS ---------------- */}
            <div className="category-row">
                {CATEGORIES.map((c) => (
                    <div className="card cat-card" key={c.title}>
                        <div className={`cat-glyph tone-${c.tone}`}>{c.glyph}</div>
                        <h4>{c.title}</h4>
                        <p className="cat-sub">{c.sub}</p>
                        <div className="cat-progress-num">{c.done}/{c.total} {c.unit}</div>
                        <div className="cat-track">
                            <div className={`cat-fill tone-${c.tone}`} style={{ width: `${(c.done / c.total) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------------- MASTERY GRID ---------------- */}
            <div className="card mastery-card">
                <div className="panel-head no-margin">
                    <div>
                        <h3>Mức độ thành thạo theo ký tự</h3>
                        <p>{completedTotal}/{MASTERY.length} ký tự đã luyện · dựa trên điểm số trung bình gần nhất</p>
                    </div>
                </div>
                <div className="mastery-grid">
                    {MASTERY.map(([glyph, score]) => (
                        <div className={`mastery-tile tone-${masteryTone(score)}`} key={glyph}>
                            <div className="g">{glyph}</div>
                            <div className="p">{score > 0 ? `${score}%` : '—'}</div>
                        </div>
                    ))}
                </div>
                <div className="mastery-legend">
                    <span><i className="dot tone-strong" /> Thành thạo (≥85%)</span>
                    <span><i className="dot tone-good" /> Tốt (70–84%)</span>
                    <span><i className="dot tone-mid" /> Đang luyện (50–69%)</span>
                    <span><i className="dot tone-low" /> Cần cải thiện (&lt;50%)</span>
                    <span><i className="dot tone-none" /> Chưa luyện</span>
                </div>
            </div>

            {/* ---------------- ACHIEVEMENTS ---------------- */}
            <div className="card achieve-card">
                <div className="panel-head no-margin">
                    <div>
                        <h3>Thành tích</h3>
                        <p>Những cột mốc bạn đã đạt được trên hành trình học tiếng Hàn</p>
                    </div>
                </div>
                <div className="achieve-grid">
                    {ACHIEVEMENTS.map((a) => (
                        <div className={`achieve-item${a.locked ? ' locked' : ''}`} key={a.title}>
                            <div className={`achieve-icon tone-${a.tone}`}><Icon name={a.icon} /></div>
                            <h5>{a.title}</h5>
                            <p>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Progress;