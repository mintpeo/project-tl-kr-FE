import React, {useEffect, useState} from 'react';
import './Lesson.css';
import useFetch from "../../../components/use/useFetch.js";
import {API_URL} from "../../../components/API_URL.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Skeleton from "../../../components/loading/Skeleton.jsx";
import { MdOutlineGridView } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import { TbAlphabetCyrillic } from "react-icons/tb";
import { TbAlphabetGreek } from "react-icons/tb";
import { LuBook } from "react-icons/lu";

const Lesson = () => {
    const navigate = useNavigate();
    const {categoryId} = useParams();

    // useEffect(() => {
    //     const navEntries = performance.getEntriesByType('navigation');
    //     if (navEntries.length > 0 && navEntries[0].type === 'reload') {
    //         navigate('/lessons/1', { replace: true });
    //     }
    // }, [navigate]);

    // Get List Category
    const {data: cate, loading: isLoadingCate} = useFetch(`${API_URL}/lesson-cate/all`);
    const [chooseCate, setChooseCate] = useState(parseInt(categoryId));
    const [categorySelected, setCategorySelected] = useState([]);
    const [lessonsWithCate, setLessonsWithCate] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const categories = cate.map((item) => ({
        id: item.id,
        orderIndex: item.orderIndex,
        name: item.categoryName,
        lessonsSize: item.id === 1 ? lessonsWithCate.length : (item.lessonsLength || 0)
    }))

    // SVG
    const getCateIcon = (orderId) => {
        switch (orderId) {
            case 1: return <MdOutlineGridView />;
            case 2: return <BsAlphabetUppercase />;
            case 3: return <TbAlphabetCyrillic />;
            case 4: return <TbAlphabetGreek />;
            default: return <LuBook />;
        }
    }

    // Video
    const handleCardClick = (lessonId) => {
        navigate(`/video/${lessonId}`);
    }

    // Lesson With Category
    useEffect(() => {
        setIsLoading(true);

        const getLessonsWithCate = async () => {
            try {
                if (parseInt(categoryId) !== 1) {
                    const res = await fetch(`${API_URL}/lesson-cate/${categoryId}`, {
                        credentials: "include"
                    });
                    const data = await res.json();
                    // Category
                    const categoryRes = {
                        id: data.id,
                        des: data.categoryDescription,
                        name: data.categoryName
                    }
                    setCategorySelected(categoryRes);
                    // Lessons
                    setLessonsWithCate(data.lessons);
                } else {
                    const res = await fetch(`${API_URL}/lesson/lessons-custom`, {
                        credentials: "include"
                    });
                    const data = await res.json();
                    setLessonsWithCate(data);
                }
                setIsLoading(false);
            } catch (e) {
                console.log("Error Lessons With Category", e);
            }
        }

        getLessonsWithCate();
    }, [categoryId])

    // console.log(lessonsWithCate)

    const handleSelectCategory = (id) => {
        setChooseCate(id);
        navigate(`/lessons/${id}`);
    }

    if (isLoadingCate) return <Skeleton />

    return (
        <>
            <div className="page-head">
                <div>
                    <span className="eyebrow">Thư viện bài giảng</span>
                    <h1>Bài học</h1>
                    <p>Video bài giảng được sắp xếp theo từng danh mục — chọn danh mục để xem các video tương ứng.</p>
                </div>
            </div>

            <div className="lesson-shell">
                <div className="category-list">
                    {
                        categories
                            .slice().sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className={`category-item ${chooseCate === item.id ? `active` : ``}`}
                                    onClick={() => handleSelectCategory(item.id)}
                                >
                                    <i className="icon">{getCateIcon(item.orderIndex)}</i>
                                    {item.name}
                                    <span className="category-count">{item.lessonsSize}</span>
                                </div>
                            ))
                    }
                </div>

                <div>
                    <div className="category-section active" id="cat-alphabet">
                        <div className="category-section-head">
                            <h2>{categorySelected.name}</h2>
                            <p>{categorySelected.des}</p>
                        </div>

                        {
                            isLoading ? (<Skeleton />) : (
                                <div className="video-grid">
                                    {
                                        lessonsWithCate.map((item) => (
                                            <div key={item.id} className="video-card" onClick={() => handleCardClick(item.id)}>
                                                <div className="video-thumb">
                                                    {/*<img src="https://picsum.photos/800/450" alt="Video thumbnail" className="thumb-img" />*/}
                                                    <span className="ghost-char">가</span>

                                                    <div className="play-btn">
                                                        <svg viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                    </div>

                                                    <div className="duration-badge">4:10</div>
                                                    {/*<VideoPlayer url={item.youtubeId} onEnded={handleVideoEnded}/>*/}
                                                </div>

                                                <div className="video-info">
                                                    <h4>{item.title}</h4>
                                                    <p>{item.des}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Lesson;