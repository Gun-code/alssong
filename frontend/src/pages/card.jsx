// Card.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// CSS 파일 임포트
import '../../src/css/card.css';

// 이미지 임포트
import logo from '../images/logo.svg';
import resetBtn from '../images/ResetBtn.jpg';
import recordIcon from '../images/record.svg';

// SimpleAudioRecorder 임포트
import SimpleAudioRecorder from './simpleAudioRecorder';

const Card = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // 이미지 선택 핸들러
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
      const response = await axios.post('http://192.168.1.100:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('이미지 업로드 성공:', response.data);
      // 필요한 경우 추가 로직 (예: 업로드된 이미지 ID 저장)
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  // 이미지 재촬영(재업로드) 핸들러
  const handleRetake = () => {
    setSelectedImage(null);
    setPreviewURL(null);
  };

  // 오디오 업로드 핸들러
  const handleUploadAudio = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.webm');

    try {
      const response = await axios.post('http://192.168.1.100:8000/upload-audio/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('오디오 업로드 성공:', response.data);
      // 필요한 경우 추가 로직 (예: 업로드된 오디오 ID 저장)
    } catch (error) {
      console.error('오디오 업로드 실패:', error);
    }
  };

  // SimpleAudioRecorder로부터 오디오 Blob을 받는 콜백
  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    console.log('녹음 완료:', blob);
  };

  return (
    <div>
      {/* 홈 아이콘 */}
      <div className="home-icon">
        <Link to="/">
          <img src={logo} alt="home" />
        </Link>
      </div>

      {/* 이미지 업로드 섹션 */}
      <div className="image-container">
        {previewURL ? (
          <>
            <img className="main-img" src={previewURL} alt="Uploaded" />
            <div className="retake-btn-container">
              <button className="retake-btn" onClick={handleRetake}>
                <img src={resetBtn} alt="다시찍기" />
                다시찍기
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="upload-input"
            />
            <label htmlFor="upload-input" className="upload-label">
              <span>이미지 업로드</span>
            </label>
          </>
        )}
      </div>

      {/* 이미지 업로드 버튼 */}
      {selectedImage && (
        <button className="upload-btn" onClick={handleUploadImage}>
          업로드
        </button>
      )}

      {/* 오디오 녹음 섹션 */}
      <div className="audio-container">
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

      {/* 결과 컨테이너 */}
      <div className="result-container">
        <span>알쏭달쏭</span> {/* response text data(Kor) */}
        <button className="record-btn">
          <img src={recordIcon} alt="마이크" />
          녹음
        </button>
        <span>RSSONG</span> {/* response text data(eng/jp/ch) */}
      </div>
    </div>
  );
};

export default Card;
