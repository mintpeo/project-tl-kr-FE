import React, {useEffect, useMemo, useState} from 'react';
import './AdminActivity.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {usePost} from "../../../components/use/usePost.js";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import {USER_DETAIL_MOCK} from "../../loggedPages/progress/userDetailMock.js";
import UserDetailModal from "../../loggedPages/progress/UserDetailModal.jsx";

const AdminActivity = () => {
    const {data: loadUserActivity} = useFetch(`${API_URL}/admin/get-user-activity`);
    const mapUserRes = (u) => ({
        name: u?.name,
        email: u?.email,
        practices: u?.totalPractices,
        avgScore: u?.avgScore,
        streak: u?.streak,
        lastActive: '5 phút trước',
        status: u?.active
    });
    const USERS = loadUserActivity.map(mapUserRes);

    // User Detail
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const handleViewUser = (email) => {
        setSelectedUser(email);
        setShowUserModal(true);
    };

    // Lessons Activity
    const {data: loadLessonActivity, loading: loadingLessons} = useFetch(`${API_URL}/admin/lessons-activity`);
    const LESSON_STATS = (Array.isArray(loadLessonActivity) ? loadLessonActivity : [])
        .slice()
        .sort((a, b) => a?.lessonId - b?.lessonId)
        .map((l) => ({
            ...l,
            completedPct: l?.totalUser > 0 ? Math.round((l?.totalUserCompleted / l?.totalUser) * 100) : 0,
            startedPct: l?.totalUser > 0 ? Math.round((l?.totalUserStarted / l?.totalUser) * 100) : 0,
        }));
    const totalCompleted = LESSON_STATS.reduce((sum, l) => sum + l.totalUserCompleted, 0);
    const totalNotCompleted = LESSON_STATS.reduce((sum, l) => sum + l.totalUserStarted, 0);
    const totalUsersLessons = LESSON_STATS.reduce((sum, l) => sum + l?.totalUser, 0);

    // User Level
    const {data: loadUserLevels} = useFetch(`${API_URL}/admin/user-levels-activity`);
    const LEVEL_STATS = loadUserLevels;
    const maxCount = Math.max(...LEVEL_STATS.map((l) => l?.totalUser), 1);
    const totalUsers = LEVEL_STATS.reduce((sum, l) => sum + l?.totalUser, 0);

    // Lowest Char
    const {data: loadLowestChar} = useFetch(`${API_URL}/admin/hard-char`);
    const {data: loadAllChar, loading: loadingAllChar} = useFetch(`${API_URL}/character/all`);
    const mapLowestCharRes = (c) => ({
        charId: c?.characterId,
        glyph: c?.predictedLabel,
        avgScore: c?.averageScore,
        attempts: c?.totalAttempts
    });
    const HARDEST_CHARS = loadLowestChar.map(mapLowestCharRes);
    const handleRoma = (charId) => {
        return loadAllChar.find((c) => c?.id === charId).transcription;
    };

    const scoreTone = (score) => {
        if (score >= 85) return 'strong';
        if (score >= 70) return 'good';
        if (score >= 50) return 'mid';
        return 'low';
    }

    // Handle data chart
    const {executePost: loadDataChart} = usePost(`${API_URL}/admin/daily-activity`);
    const [chartData, setChartData] = useState([]);
    const [range, setRange] = useState(7);
    // Map Chart, Handle Date
    const mapChart = (c) => {
        if (!c?.date) return ["--/--", 0, 0];

        const [year, month, day] = c.date.split("-");
        return [`${day}/${month}`, c.totalPractice];
    };
    // Data Chart
    useEffect(() => {
        const handleDataChart = async () => {
            const req = {
                days: range
            }
            try {
                const data = await loadDataChart(req);
                setChartData(data.map(mapChart));
            } catch (e) {
                console.log("Error Data Chart", e);
            }
        }

        handleDataChart();
    }, [range]);

    // Handle Filter
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [sortBy, setSortBy] = useState('practices'); // practices | avgScore | streak

    const filteredUsers = useMemo(() => {
        return USERS
            .filter((u) => {
                const matchesSearch =
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase());
                const matchesStatus = statusFilter === null ? u : u.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => b[sortBy] - a[sortBy]);
    }, [search, statusFilter, sortBy, loadUserActivity]);

    const statRows = [
        {name: "Người dùng đã kích hoạt", amount: USERS.filter((u) => u.status).length, icon: "chars", tone: "tone-a"},
        {name: "Tổng lượt luyện viết", amount: USERS.reduce((sum, u) => sum + u.practices, 0), icon: "vowels", tone: "tone-b"},
        {name: "Mức độ tương đồng TB toàn hệ thống", amount: `${Math.round(USERS.reduce((sum, u) => sum + u.avgScore, 0) / USERS.length)} %`, icon: "consonants", tone: "tone-c"},
        {name: "Streak trung bình", amount: (USERS.reduce((sum, u) => sum + u.streak, 0) / USERS.length).toFixed(1), icon: "notFound", tone: "tone-d"},
    ];
    const iconStatRows = {
        chars: (
            <svg viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
            </svg>
        ),
        vowels: (
            <svg viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
        ),
        consonants: (
            <svg viewBox="0 0 24 24">
                <path d="M4 20V10" />
                <path d="M12 20V4" />
                <path d="M20 20v-7" />
            </svg>
        ),
        notFound: (
            <svg viewBox="0 0 24 24">
                <path d="M12 2s6 5.5 6 10.5a6 6 0 01-12 0C6 7.5 12 2 12 2z" />
            </svg>
        )
    };

    return (
        <div className="admin-activity">
            <div className="page-head">
                <div>
                    <span className="eyebrow">Quản trị hệ thống</span>
                    <h1>Theo dõi hoạt động học tập</h1>
                    <p>Tổng quan mức độ hoạt động và hiệu quả học tập của toàn bộ người dùng.</p>
                </div>
            </div>

            {/* ---------------- STATS ---------------- */}
            <div className="stat-row">
                {
                    statRows.map((s, index) => (
                        <div key={index} className="card stat-card">
                            <div className={`stat-icon ${s.tone}`}>
                                {iconStatRows[s.icon]}
                            </div>

                            <div>
                                <div className="stat-num">{s.amount}</div>
                                <div className="stat-label">{s.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* ---------------- CHART + HARDEST CHARS ---------------- */}
            <div className="row-2col">
                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Lượt luyện viết toàn hệ thống</h3>
                            <p>Tổng số lượt luyện viết được ghi nhận mỗi ngày</p>
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
                                <div className="bar" style={{ height: `${val * 0.5}px` }} />
                                <div className="bar-day">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card panel">
                    <div className="panel-head no-margin">
                        <div>
                            <h3>Ký tự khó nhất hệ thống</h3>
                            <p>Mức độ tương đồng thấp nhất trên toàn bộ người học</p>
                        </div>
                    </div>

                    <div className="hardest-list">
                        {loadingAllChar && <Skeleton />}
                        {!loadingAllChar && HARDEST_CHARS.map((c) => (
                            <div className="hardest-row" key={c?.glyph}>
                                <div className="hardest-glyph">{c?.glyph}</div>

                                <div className="hardest-info">
                                    <p>
                                        {handleRoma(c?.charId)}
                                        <span className="mono">- {c?.attempts} lượt luyện -</span>
                                        <span className="mono">{c?.avgScore}%</span>
                                    </p>

                                    <div className="hardest-track">
                                        <div className={`hardest-fill tone-${scoreTone(c?.avgScore)}`} style={{ width: `${c.avgScore}%` }} />
                                    </div>
                                </div>

                                <div className={`hardest-score tone-${scoreTone(c?.avgScore)}`}>{c.avgScore}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row-2col">
                <div className="card panel">
                    <div className="panel-head">
                        <div>
                            <h3>Số người học theo level</h3>
                            <p>Tổng {totalUsers} người học trên tất cả các level</p>
                        </div>
                    </div>

                    <div className="bars">
                        {LEVEL_STATS.map((level, index) => (
                            <div className="bar-col" key={level?.levelName}>
                                <div className="bar-val">{level?.totalUser}</div>
                                <div
                                    className={`bar level-${index + 1}`}
                                    style={{ height: `${Math.round((level?.totalUser / maxCount) * 110)}px` }}
                                />
                                <div className="bar-day">{level?.levelName}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card panel">
                    <div className="panel-head no-margin">
                        <div>
                            <h3>Tiến độ theo bài học</h3>
                            <p>Số người đang học và đã hoàn thành ở từng bài</p>
                        </div>
                    </div>

                    <div className="hardest-list">
                        {loadingLessons && <Skeleton />}
                        {!loadingLessons && LESSON_STATS.map((l, index) => (
                            <div className="hardest-row" key={l?.lessonId}>
                                <div className="hardest-glyph">{index + 1}</div>

                                <div className="hardest-info">
                                    <p className="lesson-name" title={l?.lessonName}>{l?.lessonName}</p>

                                    <div className="hardest-track stacked">
                                        <div className="seg completed" style={{ width: `${l?.completedPct}%` }} />
                                        <div className="seg started" style={{ width: `${l?.startedPct}%` }} />
                                    </div>

                                    <div className="lesson-meta mono">
                                        <span><i className="dot completed" /> {l?.totalUserCompleted} hoàn thành</span>
                                        <span><i className="dot started" /> {l?.totalUserStarted} đang học</span>
                                        <span>/ {l?.totalUser} người</span>
                                    </div>
                                </div>

                                <div className="hardest-score tone-celadon">{l?.completedPct}%</div>
                            </div>
                        ))}
                        {!loadingLessons && LESSON_STATS.length === 0 && (
                            <div className="empty-state">Chưa có dữ liệu bài học.</div>
                        )}
                    </div>

                    {!loadingLessons && LESSON_STATS.length > 0 && (
                        <div className="lesson-summary">
                            Tổng cộng: <strong>{totalUsersLessons}</strong> người học
                            <span className="sep">·</span>
                            <strong className="done">{totalCompleted}</strong> lượt hoàn thành
                            <span className="sep">·</span>
                            <strong className="pending">{totalNotCompleted}</strong> lượt chưa hoàn thành
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- TOOLBAR ---------------- */}
            <div className="toolbar">
                <div className="search-wrap">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(JSON.parse(e.target.value))}>
                    <option value="null">Tất cả trạng thái</option>
                    <option value="true">Đã kích hoạt</option>
                    <option value="false">Chưa kích hoạt</option>
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="practices">Sắp xếp: Lượt luyện viết</option>
                    <option value="avgScore">Sắp xếp: Độ chính xác</option>
                    <option value="streak">Sắp xếp: Streak</option>
                </select>
            </div>

            {/* ---------------- TABLE NGƯỜI DÙNG ---------------- */}
            <div className="card table-card">
                <table>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Người dùng</th>
                        <th>Lượt luyện viết</th>
                        <th>Độ chính xác TB</th>
                        <th>Streak</th>
                        {/*<th>Hoạt động gần nhất</th>*/}
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((u, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="user-cell">
                                    <div className="user-avatar">{u?.name.charAt(0)}</div>

                                    <div>
                                        <div className="user-name">{u?.name}</div>
                                        <div className="user-email">{u?.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="mono">{u?.practices}</td>
                            <td>
                                <span className={`score-chip tone-${scoreTone(u?.avgScore)}`}>{u?.avgScore}%</span>
                            </td>
                            <td className="mono" style={{whiteSpace: "nowrap"}}>{u?.streak > 0 ? `${u?.streak} ngày` : '—'}</td>
                            {/*<td className="muted">{u.lastActive}</td>*/}
                            <td>
                                <span className={`status-badge ${u?.status}`}>
                                    {u?.status ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                </span>
                            </td>
                            <td>
                                <button className="btn btn-primary" style={{whiteSpace: "nowrap", fontSize: '10px'}} onClick={() => handleViewUser(u?.email)}>
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr><td colSpan={6} className="empty-row">Không tìm thấy người dùng phù hợp.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showUserModal && (
                <UserDetailModal
                    email={selectedUser}
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}
export default AdminActivity;