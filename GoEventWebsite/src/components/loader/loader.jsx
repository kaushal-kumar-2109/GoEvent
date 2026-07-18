import React from 'react';
import './loader.css';

export default function Loader() {
    return (
        <div className="loader">
            <div className="loader-content">
                <div className="loader-spinner"></div>
            </div>
        </div>
    );
}