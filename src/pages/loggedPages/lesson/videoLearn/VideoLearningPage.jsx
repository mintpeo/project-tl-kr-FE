import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import './VideoLearningPage.css';
import useFetch from "../../../../components/use/useFetch.js";
import {API_URL} from "../../../../components/API_URL.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Skeleton from "../../../../components/loading/Skeleton.jsx";

const VideoLearningPage = () => {
    const navigate = useNavigate();
    const {lessonId} = useParams();
    const {data: currentL, loading: loading} = useFetch(`${API_URL}/lesson/${lessonId}`);
    const {data: defaultP, loading: loadingPlaylist} = useFetch(`${API_URL}/lesson/lessons-custom`);

    const currentLesson = {
        id: currentL?.id,
        title: currentL?.title,
        youtubeId: currentL?.youtubeId
    }

    const defaultPlaylist = defaultP.map((item) => ({
        id: item?.id,
        title: item?.title,
    }))

    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState('notes');

    const nextVideo = (value) => {
        const number = parseInt(lessonId) + value;
        navigate(`/video/${number}`);
        window.location.reload();
    }

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds);
    };

    const handleEnded = () => {
        setCompleted(true);
    };

    // const defaultPlaylist = [
    //     { id: 1, title: '01. Giới thiệu tổng quan', duration: '05:20', active: true },
    //     { id: 2, title: '02. Cài đặt ReactPlayer', duration: '08:15', active: false },
    //     { id: 3, title: '03. Xử lý Event & Custom Control', duration: '12:30', active: false },
    //     { id: 4, title: '04. Tối ưu hóa Performance', duration: '15:45', active: false },
    // ];

    if (loading) return <Skeleton />

    return (
        <div>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Khóa học Hàn cùng AI</span>
                    <h1>{currentLesson?.title || 'Bài 1: Tổng quan về ReactPlayer'}</h1>
                    <p>Thời lượng: {currentLesson?.duration || '12:45'} • Cập nhật gần đây</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => nextVideo(-1)} className="btn btn-ghost">Bài trước</button>
                    <button onClick={() => nextVideo(1)} className="btn btn-primary">Bài tiếp theo</button>
                </div>
            </div>

            <div className="learning-layout">
                <div className="main-content">
                    <div className="card player-card">
                        <div className="player-wrapper">
                            {currentLesson?.youtubeId ? (
                                <ReactPlayer
                                    className="react-player"
                                    src={`https://www.youtube.com/watch?v=${currentLesson.youtubeId}`}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    onProgress={handleProgress}
                                    onDuration={handleDuration}
                                    onEnded={handleEnded}
                                />
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    Không tìm thấy video bài học.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="progress-header">
                            <span>Tiến độ hoàn thành video</span>
                            <span className="mono">
                                {formatTime(playedSeconds)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="goal-track">
                            <div className="goal-track">
                                <div
                                    className="goal-fill"
                                    style={{
                                        width: duration > 0
                                            ? `${(playedSeconds / duration) * 100}%`
                                            : '0%'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="tabs-header">
                            <button
                                className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('notes')}
                            >
                                Ghi chú bài học
                            </button>
                            <button
                                className={`btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveTab('resources')}
                            >
                                Tài liệu đính kèm
                            </button>
                        </div>

                        {activeTab === 'notes' ? (
                            <div className="notes-tab">
                                <textarea
                                    className="notes-input"
                                    placeholder="Nhập ghi chú cá nhân tại đây..."
                                    rows={4}
                                />
                                <button className="btn btn-primary save-btn">Save Note</button>
                            </div>
                        ) : (
                            <ul className="resources-list">
                                <li>
                                    <a href="#source-code" className="resource-link">
                                        Source code đính kèm (GitHub)
                                    </a>
                                </li>
                                <li>
                                    <a href="#slides" className="resource-link">
                                        Slide bài giảng (PDF)
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                <div className="sidebar-content">
                    <div className="card">
                        <h3 className="playlist-title">Nội dung khóa học</h3>

                        <div className="playlist-list">
                            {defaultPlaylist.map((item) => (
                                <div
                                    key={item.id}
                                    className={`playlist-item ${currentLesson.id === item.id ? 'active' : ''}`}
                                >
                                    <div>
                                        <div className={`lesson-title ${currentLesson.id === item.id ? 'active-text' : ''}`}>
                                            {item.title}
                                        </div>
                                        <span className="mono lesson-duration">{item.duration || "00:00"}</span>
                                    </div>
                                    {currentLesson.id === item.id && <span className="active-badge">Đang học</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoLearningPage;