import React, { useState, useRef } from 'react';
import '../css/main.css';
// import Logo from '../images/LOGO.png';
import MainBack from '../images/MAIN-BACK.png';
import Myelbum from '../images/my-elbum.png';
import RandomImg from '../images/random-img.png';
import QuestionMark from '../images/question mark.png';
import GuideIcon from '../images/guide.png';
import CameraIcon from '../images/Cam.png';
import AlbumIcon from '../images/elbum.png';
import MainBar from '../images/MAIN-BAR.png';
import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';



function MyCard() {
    const navigate = useNavigate();  // useNavigate 훅 사용
      const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        navigate('/card');  // card 페이지로 이동
    };

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
                    <div class="container">
                    <img 
                    src={Myelbum} 
                    alt="myelbum" 
                    className="MyCard_Image1" 
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}  // 마우스 오버시 포인터 커서 표시
                />

                    <div className="TextBox1">
                        <h2></h2>
                        내 카드
                    </div>

                    <div className='container_of_MyCard_Image1'>
                        <div className="container_of_MyCard_Image1-item">
                            <Link to="./card"><img src={Myelbum} alt="card" className="container_of_MyCard_Image1-item" /></Link>
                        </div> 

                    </div>

                        
                    <img 
                    src={RandomImg} 
                    alt="randomimg" 
                    className="MyCard_Image2" 
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}  // 마우스 오버시 포인터 커서 표시
                />

                    <div className="TextBox2">
                        <h2></h2>
                        랜덤 카드
                    </div>

                    <img 
                    src={QuestionMark} 
                    alt="questionmark" 
                    className="MyCard_Image2" 
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}  // 마우스 오버시 포인터 커서 표시
                />

                    
                    </div>

                    <img src={MainBack} alt="background" className="background" />
                </div>
            </div>
            {/* ------------------------------------------------------------------------------------------------- */}
            <div className="underBar-container">
                <div className="underBar-item">
                    <Link to="/guide"><img src={GuideIcon} alt="guide" className="under-item" /></Link>
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
                    <Link to="/myCard"><img src={AlbumIcon} alt="album" className="under-item" /></Link>
                    
                </div>
                <img src={MainBar} alt="MainBar" className="underbar" />
            </div>
        </div>
    );
}
export default MyCard; 