import { Link } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import '../css/main.css';
import CommonNavigation from './main_navi';

// 이미지 임포트
import Logo from '../images/LOGO.png';
import LogoCh from '../images/알쏭달쏭 중국어.png';  // 중국어 로고
import LogoJp from '../images/알쏭달쏭 일본어.png';  // 일본어 로고


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
    <CommonNavigation>
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
        </div>
      </div>
    </CommonNavigation>
  );
}

export default MainPage;
