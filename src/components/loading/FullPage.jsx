import React from 'react';
import './FullPage.css';

const FullPage = () => {
    return (
        <div className="gs-loading-overlay gs-show" id="gsLoadingOverlay">
            <div className="gs-loading-box">
                <div className="gs-brush-wrap">
                    <svg className="gs-brush" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24"/>
                    </svg>

                    <span className="gs-mark">글</span>
                </div>

                <span className="gs-loading-text" id="gsLoadingText">Đang tải…</span>
            </div>
        </div>
    );
};

export default FullPage;