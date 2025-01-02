import React from 'react';
import './css/main.css';

function MainPage() {
    return (
        <div className="page">
            <div className="main">   
                <div className="background-container">
                    <img src="../resource/" alt="logo" className="Logo" />
                    <img src="../resource/MAIN-BACK.png" alt="background" className="background" />
                </div>
            </div>
            
            <div className="underBar">
                <img src="../resource/guide.png" alt="guide" className="under-item" />
                <img src="../resource/Cam.png" alt="Camera" className="under-item" />
                <img src="../resource/elbum.png" alt="elbum" className="under-item" />
            </div>
        </div>
    );
}
export default MainPage; 