// MainPage.jsx
import React, { useState, useRef } from 'react';
import '../css/main.css';
import Logo from '../images/LOGO.png';
import MainBack from '../images/MAIN-BACK.png';
import GuideIcon from '../images/guide.png';
import CameraIcon from '../images/Cam.png';
import AlbumIcon from '../images/elbum.png';
import MainBar from '../images/MAIN-BAR.png';
import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

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
                    <Link to="/guide"><img src={GuideIcon} alt="guide" className="under-item" /></Link>
                    <Link to="/camera"><img src={CameraIcon} alt="Camera" className="under-item" /></Link>
                    <Link to="/card"><img src={AlbumIcon} alt="album" className="under-item" /></Link>
                </div>
                <img src={MainBar} alt="MainBar" className="underbar" />
            </div>
=======
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // 모바일에서 카메라 아이콘을 클릭했을 때 호출
  const handleMobileCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 내장 카메라 앱 실행
    }
  };

  // 사진(파일) 선택 시
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      // 선택된 파일을 Card 페이지로 전달하고 이동
      navigate('/card', {
        state: { photo: file },
      });
    }
  };

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
          <Link to="/guide">
            <img src={GuideIcon} alt="guide" className="under-item" />
          </Link>

          {/** 
           * 모바일: 버튼 클릭 시 먼저 사진을 찍은 후, card로 이동 
           * 데스크탑: 기존 방식대로 card로 이동하며 openCamera: true 전달 
           */}
          {isMobile ? (
            // 모바일
            <>
              <img
                src={CameraIcon}
                alt="Camera"
                className="under-item"
                onClick={handleMobileCameraClick}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </>
          ) : (
            // 데스크탑
            <Link to="/card" state={{ openCamera: true }}>
              <img src={CameraIcon} alt="Camera" className="under-item" />
            </Link>
          )}

          <Link to="/card">
            <img src={AlbumIcon} alt="album" className="under-item" />
          </Link>
        </div>
        <img src={MainBar} alt="MainBar" className="underbar" />
      </div>
    </div>
  );
}

export default MainPage;
