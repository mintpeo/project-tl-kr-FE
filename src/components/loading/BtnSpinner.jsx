import React from 'react';
import './BtnSpinner.css';

const BtnSpinner = ({text, isLoading}) => {
    return (
        <button  type="submit" className={`btn btn-primary ${isLoading ? `gs-btn-loading` : ``}`}
                 style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <span className="gs-btn-spinner"></span>
            <span className="gs-btn-label" style={{marginLeft: '5px'}}>{text}</span>
        </button>
    );
};

export default BtnSpinner;