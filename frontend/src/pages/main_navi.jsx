import '../css/main_navi.css';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';


// 이미지 임포트
import MainBack from '../images/MAIN-BACK.png';
import MainBar from '../images/MAIN-BAR.png';
import GuideIcon from '../images/guide.png';
import CameraIcon from '../images/Cam.png';
import AlbumIcon from '../images/elbum.png';
import logo from '../images/LOGO.png';

const CommonNavigation = ({ children }) => {
    const fileInputRef = useRef(null);

    const handleMobileCameraClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 파일 처리 로직
            navigate('/card', { state: { photo: file } });
        }
    };
    const navigate = useNavigate();
    return (
        <div className="page">
            <div className="main">
                <div className="background-container">
                    {/* 메인 콘텐츠 영역 */}
                    <div className="content-area">
                        {children}
                    </div>

                    {/* 배경 이미지 */}
                    <img src={MainBack} alt="background" className="background" />
                </div>
            </div>

            {/* 하단 네비게이션 바 */}
            <div className="underBar-container">
                <div className="underBar-item">
                    <Link to="/guide"><img src={GuideIcon} alt="guide" className="under-item" /></Link>
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
                    <Link to="/CardList"><img src={AlbumIcon} alt="album" className="under-item" /></Link>
                </div>
                <img src={MainBar} alt="MainBar" className="underbar" />
            </div>
        </div>
    );
};

export default CommonNavigation;