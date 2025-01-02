import React from 'react';
import './css/main.css';
import Logo from '../resource/LOGO.png';
import MainBack from '../resource/MAIN-BACK.png';
import GuideIcon from '../resource/guide.png';
import CameraIcon from '../resource/Cam.png';
import AlbumIcon from '../resource/elbum.png';
import Logoback from '../resource/Logoback';

function MainPage() {
    return (
        <div className="page">
            <div className="main">
                <div className="language-selector">
                    <select id="language">
                        <option value="en">English</option>
                        <option value="ch">中文</option>
                        <option value="ja">日本語</option>
                    </select>
                </div>
                <div className="background-container">
                    <img src={Logo} alt="logo" className="Logo" />
                    <img src={Logoback} alt="logoback" className="Logo" />
                    <img src={MainBack} alt="background" className="background" />
                </div>
            </div>

            <div className="underBar">
                <img src={GuideIcon} alt="guide" className="under-item" />
                <img src={CameraIcon} alt="Camera" className="under-item" />
                <img src={AlbumIcon} alt="album" className="under-item" />
            </div>
        </div>
    );
}
export default MainPage; 