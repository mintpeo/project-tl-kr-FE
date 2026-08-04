import React from 'react';
import './Skeleton.css';

const Skeleton = () => {
    return (
        <div className="demo-section">
            <div className="demo-box" id="skeletonDemo">
                <div className="skeleton-card">
                    <div className="gs-skeleton sk-glyph"></div>
                    <div className="gs-skeleton sk-line" style={{width: '70%'}}></div>
                    <div className="gs-skeleton sk-line" style={{width: '45%'}}></div>
                </div>
                
                <div className="skeleton-card">
                    <div className="gs-skeleton sk-glyph"></div>
                    <div className="gs-skeleton sk-line" style={{width: '60%'}}></div>
                    <div className="gs-skeleton sk-line" style={{width: '50%'}}></div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;