// src/pages/card.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { isMobile } from 'react-device-detect';

// CSS 파일 임포트
import '../../src/css/card.css';
import '../css/modal.css';

// 이미지 임포트
import logo from '../images/logo.svg';
import resetBtn from '../images/ResetBtn.jpg';
import recordIcon from '../images/record.svg';
import Listen from '../images/listen.png';
import Record from '../images/record.png';
import check from '../images/check.png';
import stop from '../images/stop.png';


const Card = () => {
  // 모달
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setRecording(true);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('오디오 녹음을 시작할 수 없습니다. 마이크 접근을 허용해주세요.');
    }
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  // ========================================================================
  const location = useLocation();
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  // 로딩중..
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);  // 업로드 완료 상태 추가

  // 객체 감지 결과 (영어) & 번역 결과 (한국어)
  const [detectedObjectEn, setDetectedObjectEn] = useState('');
  const [detectedObjectKo, setDetectedObjectKo] = useState('');

  // TTS 재생용 URL (영어, 한국어)
  const [englishTtsUrl, setEnglishTtsUrl] = useState(null);
  const [koreanTtsUrl, setKoreanTtsUrl] = useState(null);

  // 유사도 체크 결과
  const [similarityScore, setSimilarityScore] = useState(null);
  const [similarityModalOpen, setSimilarityModalOpen] = useState(false);
  const [similarityMessage, setSimilarityMessage] = useState('');

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
      if (location.state && location.state.openCamera) {
        setIsRetaking(true);
      }
    }
  }, [location.state]); // isMobile 제거
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // ------------------------------------------
  // (1) 이미지 업로드 & 객체 감지 & 번역 & TTS
  // ------------------------------------------
  const handleUploadImage = async () => {
    if (!selectedImage) return;
    setIsLoading(true); // 로딩 시작

    try {
      // 1) 객체 감지
      const formData = new FormData();
      formData.append('file', selectedImage);

      const detectResponse = await axios.post(
        'http://localhost:8000/detect/', // 본인 서버 주소/포트 확인
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const detectedEn = detectResponse.data.detected_object || 'unknown';
      console.log('객체 감지 결과(영어):', detectedEn);
      setDetectedObjectEn(detectedEn);

      // 2) 영어 → 한국어 번역 (백엔드 번역 API 호출)
      const translateResponse = await axios.get(
        `http://localhost:8000/translate/?text=${encodeURIComponent(detectedEn)}&lang=ko`
      );
      const koWord = translateResponse.data.translated_text;
      console.log('번역 결과(한국어):', koWord);
      setDetectedObjectKo(koWord);

      // 3) 영어, 한국어 각각 TTS 파일 받기
      //   (응답은 blob 형태 - gTTS가 생성한 mp3)
      //   * 영어
      const enTtsRes = await axios.get(
        `http://localhost:8000/tts?text=${encodeURIComponent(
          detectedEn
        )}&lang=en&file_name=en.mp3`,
        { responseType: 'blob' }
      );
      const enTtsBlobUrl = URL.createObjectURL(enTtsRes.data);
      setEnglishTtsUrl(enTtsBlobUrl);

      //   * 한국어
      const koTtsRes = await axios.get(
        `http://localhost:8000/tts?text=${encodeURIComponent(
          koWord
        )}&lang=ko&file_name=ko.mp3`,
        { responseType: 'blob' }
      );
      const koTtsBlobUrl = URL.createObjectURL(koTtsRes.data);
      setKoreanTtsUrl(koTtsBlobUrl);
      setIsLoading(false); // 로딩 종료
      setIsUploaded(true); // 사진 업로드 완료
      alert('사진이 확인되었습니다!');
    } catch (error) {
      console.error('이미지 업로드/객체 감지/TTS 실패:', error);
      alert('업로드/감지/TTS 중 오류가 발생했습니다.');
    }
  };

  // ------------------------------------------
  // (2) "다시찍기" (웹캠)
  // ------------------------------------------
  const handleRetake = () => {
    if (!isMobile) {
      setIsRetaking(true);
      setSelectedImage(null);
      setIsUploaded(false);  // 업로드 상태 초기화
    }
  };

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

  // ------------------------------------------
  // (3) 음성 녹음 & 업로드 + 유사도 체크
  // ------------------------------------------
  const handleAudioStop = (blob) => {
    setAudioBlob(blob);
    console.log('녹음 완료:', blob);
  };

  // 새로운 "확인 하기" 버튼 핸들러 추가
  const handleConfirmAudio = async () => {
    if (!audioBlob) {
      alert('녹음된 오디오가 없습니다.');
      return;
    }

    try {
      // 오디오 업로드
      const formData = new FormData();
      formData.append('file', audioBlob, 'recorded_audio.webm');

      const res = await axios.post('http://localhost:8000/upload-audio/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('오디오 업로드 성공:', res.data);
      alert('오디오 업로드 완료! 유사도 체크 중입니다.');

      // 유사도 체크 자동 수행
      await handleCheckSimilarity(audioBlob);
    } catch (error) {
      console.error('오디오 업로드 실패:', error);
      alert('오디오 업로드 실패');
    }
  };

  const openAudioModal = () => setIsAudioModalOpen(true);
  const closeAudioModal = () => setIsAudioModalOpen(false);

  // ------------------------------------------
  // (4) 영어 TTS 음성과 사용자 음성 similarity 체크
  // ------------------------------------------
  // const handleCheckSimilarity = async (uploadedBlob = null) => {
  //   if (!englishTtsUrl || (!audioBlob && !uploadedBlob)) {
  //     alert('영어 TTS 음성 또는 사용자 음성이 준비되지 않았습니다.');
  //     return;
  //   }

  //   try {
  //     // 영어 TTS 음성을 Blob으로 가져오기
  //     const ttsBlob = await fetch(englishTtsUrl).then((r) => r.blob());
  //     const userBlob = uploadedBlob || audioBlob;

  //     // FormData 생성
  //     const formData = new FormData();
  //     formData.append('file1', ttsBlob, 'tts_en.mp3'); // 필드 이름: file1
  //     formData.append('file2', userBlob, 'recorded_audio.webm'); // 필드 이름: file2

  //     // Axios 요청
  //     console.log("Sending FormData:", {
  //       file1: 'tts_en.mp3',
  //       file2: 'recorded_audio.webm'
  //     });
  //     const response = await axios.post('http://localhost:8000/similarity/', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     console.log("Similarity response:", response.data);

  //     const similarity = response.data.similarity;
  //     setSimilarityScore(similarity);

  //     if (similarity > 0.5) { // 임계값 설정 (예: 0.5)
  //       setSimilarityMessage('참 잘했어요~');
  //     } else {
  //       setSimilarityMessage('다시 해보세요~');
  //     }

  //     setSimilarityModalOpen(true);
  //   } catch (error) {
  //     console.error('유사도 체크 실패:', error);
  //     alert('유사도 체크 실패');
  //   }
  // };

  // const handleCloseSimilarityModal = () => {
  //   setSimilarityModalOpen(false);
  // };

  const handleCheckSimilarity = async (recordedAudio) => {
    try {
        const formData = new FormData();
        formData.append('file1', recordedAudio);
        formData.append('file2', targetAudio);  // 비교할 원본 오디오
        
        // 단어와 이미지 정보도 함께 전송
        formData.append('word_name', englishWord);  // 영어 단어
        formData.append('image_path', imagePath);   // 이미지 경로

        const response = await axios.post(
            'http://localhost:8000/similarity/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // 결과 처리
        setSimilarityResult(response.data.similarity);
        if (response.data.word_id) {
            console.log('단어가 DB에 저장됨:', response.data.word_id);
        }
        setSimilarityModalOpen(true);

    } catch (error) {
        console.error('유사도 체크 실패:', error);
        alert('유사도 체크 실패');
    }
};

  // ------------------------------------------
  // (5) TTS 재생 (영어 / 한국어)
  // ------------------------------------------
  const playAudio = (audioUrl) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.error('오디오 재생 오류', err));
  };
  // ====================================================================================================
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
          // Card에서 직접 파일 선택
          if (!isRetaking && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {previewURL ? (
          <>
            <img className="main-img" src={previewURL} alt="Uploaded" />
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
      {selectedImage && !isLoading && !isUploaded && (
        <button className="upload-btn" onClick={handleUploadImage}>
          이 사진으로 할래요!
        </button>
      )}

      {isLoading && (
        <div className="loading-message">
          사진 확인중...
        </div>
      )}

      {/* 감지된 결과 & TTS 플레이 영역 */}
      {/* 예: apple / 사과  */}
      {detectedObjectEn && (
        <div className="result-container">
          {/* 영어 단어 & 재생 버튼 */}
          <button onClick={() => playAudio(englishTtsUrl)} className="tts-btn"> {detectedObjectEn}
          </button>
          {/* 녹음 버튼 */}
          <img src={recordIcon} alt="마이크" onClick={openAudioModal} className="record-btn" />
          {/* 한국어 단어 & 재생 버튼 */}
          <button onClick={() => playAudio(koreanTtsUrl)} className="tts-btn">{detectedObjectKo}
          </button>
        </div>
      )}

      {/* (A) 오디오 녹음 모달 */}
      {isAudioModalOpen && (
        <div className="modal" onClick={closeAudioModal}>
          <div className="simple-audio-recorder">
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={closeAudioModal}>×</button>

              {audioBlob && (
                <div className="audio-controls">
                  <audio src={URL.createObjectURL(audioBlob)} controls />

                  <button className='listen-btn'>
                    <img src={Listen} alt="listen" className='modal-btn' onClick={handleConfirmAudio} />
                  </button>
                </div>
              )}
              <div className='modal-btn-container'>
                <button
                  onClick={recording ? stopRecording : startRecording}
                  className='record-modal-btn'>
                  <img src={recording ? stop : Record}
                    alt={recording ? '녹음 중지' : '녹음 시작'} />
                </button>
                <button className='check-btn' disabled>
                  <img src={check} alt="check" className='modal-btn' />
                </button>
              </div>
            </div>
          </div>
        </div >
      )}
      {/* ===================================================================================== */}

      {/* (B) 유사도 결과 모달 */}
      {similarityModalOpen && (
        <div className="modal" onClick={handleCloseSimilarityModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={handleCloseSimilarityModal}>
              &times;
            </span>
            <h2>유사도 결과</h2>
            <p>유사도: {similarityScore !== null ? similarityScore.toFixed(2) : '계산 중...'}</p>
            <p>{similarityMessage}</p>
          </div>
        </div>
      )}

      {/* 웹캠 모달 (데스크탑) */}
      {isRetaking && !isMobile && (
        <div className="modal" onClick={() => setIsRetaking(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsRetaking(false)}>
              &times;
            </span>
            <h2>사진 촬영</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: 'user' }}
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


