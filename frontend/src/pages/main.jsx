import React, { useState } from 'react';
import '../css/main.css';
import Logo from '../images/LOGO.png';
import LogoCh from '../images/알쏭달쏭 중국어.png';  // 중국어 로고
import LogoJp from '../images/알쏭달쏭 일본어.png';  // 일본어 로고
import MainBack from '../images/MAIN-BACK.png';
import GuideIcon from '../images/guide.png';
import CameraIcon from '../images/Cam.png';
import AlbumIcon from '../images/elbum.png';
import MainBar from '../images/MAIN-BAR.png';
import { Link } from 'react-router-dom';

function MainPage() {
    const [selectedLogo, setSelectedLogo] = useState(Logo);  // 기본 로고로 시작

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        if (lang === 'ch') {
            setSelectedLogo(LogoCh);      // 중국어 선택시
        } else if (lang === 'ja') {
            setSelectedLogo(LogoJp);      // 일본어 선택시
        } else {
            setSelectedLogo(Logo);        // 영어 선택시
        }
    };

    return (
        <div className="page">
            <div className="main">
                <div className="background-container">
                    <div className="language-selector">
                        <select id="language" onChange={handleLanguageChange}>
                            <option value="en">English</option>
                            <option value="ch">中文</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>
                    <img src={selectedLogo} alt="logo" className="Logo" /> {/* 선택된 로고를 렌더링 */}
                    <img src={MainBack} alt="background" className="background" />
                </div>
            </div>
            {/* ------------------------------------------------------------------------------------------------- */}
            <div className="underBar-container">
                <div className="underBar-item">
                    <Link to="./guide"><img src={GuideIcon} alt="guide" className="under-item" /></Link>
                    <Link to="./camera"><img src={CameraIcon} alt="Camera" className="under-item" /></Link>
                    <Link to="./myCard"><img src={AlbumIcon} alt="album" className="under-item" /></Link>
                </div>
                <img src={MainBar} alt="MainBar" className="underbar" />
            </div>
        </div>
    );
}

export default MainPage;
