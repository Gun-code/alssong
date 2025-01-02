// Card.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';

// CSS 파일 임포트
import '../../src/css/card.css';

// 이미지 임포트
import logo from '../images/logo.svg';
import resetBtn from '../images/ResetBtn.jpg';
import recordIcon from '../images/record.svg';

// SimpleAudioRecorder 임포트
import SimpleAudioRecorder from '../pages/simpleAudioRecorder';

// 모달 임포트
import Modal from './modal';

const Card = () => {
  const location = useLocation();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  // location.state.photo(파일) 있으면 이미지 세팅
  useEffect(() => {
    if (location.state && location.state.photo) {
      const photo = location.state.photo;
      setSelectedImage(photo);
      setPreviewURL(URL.createObjectURL(photo));
    }
  }, [location.state]);

  // 페이지 로드 시 데스크탑이면 웹캠 모달 열기
  useEffect(() => {
    if (!isMobile) {
      // 만약 openCamera: true 전달받았다면
      if (location.state && location.state.openCamera) {
        setIsRetaking(true);
      }
    }
  }, [location.state, isMobile]);


  // 모달 ==================================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  // 이미지 선택 핸들러 (Card에서 직접 업로드 시)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // 이미지 업로드 핸들러
  const handleUploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://192.168.1.236:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('이미지 업로드 성공:', response.data);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  // 이미지 재촬영(재업로드) 핸들러 (데스크탑)
  const handleRetake = () => {
    if (!isMobile) {
      setIsRetaking(true);
    }
  };

  // 웹캠에서 사진 캡처 (데스크탑)
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          setPreviewURL(URL.createObjectURL(file));
          setIsRetaking(false);
        });
    }
  };

  // 오디오 업로드 핸들러
  const handleUploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.webm');

    try {
      const response = await axios.post('http://192.168.1.236:8000/upload-audio/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('오디오 업로드 성공:', response.data);
    } catch (error) {
      console.error('오디오 업로드 실패:', error);
    }
  };

  // 오디오 녹음 완료 시
  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    console.log('녹음 완료:', blob);
  };

  // 오디오 모달 열기/닫기
  const openAudioModal = () => setIsAudioModalOpen(true);
  const closeAudioModal = () => setIsAudioModalOpen(false);

  return (
    <div>
      {/* 홈 아이콘 */}
      <div className="home-icon">
        <Link to="/">
          <img src={logo} alt="home" />
        </Link>
      </div>

      {/* 이미지 업로드 섹션 */}
      <div
        className="image-container"
        onClick={() => {
          // Card에서 직접 파일 선택도 가능
          if (!isRetaking && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {previewURL ? (
          <>
            <img className="main-img" src={previewURL} alt="Uploaded" />
            {/* 데스크탑에서만 다시 찍기 버튼 표시 */}
            {!isMobile && (
              <div className="retake-btn-container">
                <button
                  className="retake-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetake();
                  }}
                >
                  <img src={resetBtn} alt="다시찍기" />
                  다시찍기
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              capture={isMobile ? 'environment' : undefined}
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <div className="upload-label">
              <span>이미지 업로드</span>
            </div>
          </>
        )}
      </div>

      {/* 이미지 업로드 버튼 */}
      {selectedImage && (
        <button className="upload-btn" onClick={handleUploadImage}>
          업로드
        </button>
      )}

      {/* 녹음 버튼 */}
      <div className="result-container">
        

        <span>알쏭달쏭</span> {/* response text data(Kor) */}
        <img src={recordIcon} alt="마이크" onClick={openModal} className='record-icon'/>
        <span>RSSONG</span> {/* response text data(eng/jp/ch) */}
      </div>

      {/* Modal 컴포넌트 */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* 오디오 녹음 모달 */}
      {isAudioModalOpen && (
        <div className="modal" onClick={closeAudioModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeAudioModal}>&times;</span>
            <h2>오디오 녹음</h2>
            <SimpleAudioRecorder onStop={handleAudioStop} />
            {audioBlob && (
              <>
                <audio src={URL.createObjectURL(audioBlob)} controls />
                <button className="upload-audio-btn" onClick={handleUploadAudio}>
                  오디오 업로드
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 웹캠 모달 (데스크탑) */}
      {isRetaking && !isMobile && (
        <div className="modal" onClick={() => setIsRetaking(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsRetaking(false)}>&times;</span>
            <h2>이미지 재촬영</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'user',
              }}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <button onClick={capture} className="upload-btn" style={{ marginTop: '10px' }}>
              촬영
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
