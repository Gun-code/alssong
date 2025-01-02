import React from 'react';
import '../css/main.css';
import Logo from '../images/LOGO.png';
import MainBack from '../images/MAIN-BACK.png';
import GuideIcon from '../images/guide.png';
import CameraIcon from '../images/Cam.png';
import AlbumIcon from '../images/elbum.png';
import MainBar from '../images/MAIN-BAR.png';
import { Link } from 'react-router-dom';

function MainPage() {
    return (
        <div className="page">
            <div className="main">
                <div className="background-container">
                    <div className="language-selector">
                        <select id="language">
                            <option value="en">English</option>
                            <option value="ch">中文</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                    <img src={Logo} alt="logo" className="Logo" />
                    <img src={MainBack} alt="background" className="background" />
                </div>
            </div>
            {/* ------------------------------------------------------------------------------------------------- */}
            <div className="underBar-container">
                <div className="underBar-item">
                    <Link to="./guide.jsx"><img src={GuideIcon} alt="guide" className="under-item" /></Link>
                    <Link to="./camera.jsx"><img src={CameraIcon} alt="Camera" className="under-item" /></Link>
                    <Link to="./card.jsx"><img src={AlbumIcon} alt="album" className="under-item" /></Link>
                </div>
                <img src={MainBar} alt="MainBar" className="underbar" />
            </div>
        </div>
    );
}
export default MainPage; 