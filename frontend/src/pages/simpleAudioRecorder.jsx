// SimpleAudioRecorder.jsx
import React, { useState, useRef } from 'react';

const SimpleAudioRecorder = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onStop(audioBlob); // 부모에게 오디오 데이터 전달
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('오디오 녹음을 시작할 수 없습니다. 마이크 접근을 허용해주세요.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="simple-audio-recorder">
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? '녹음 중지' : '녹음 시작'}
      </button>
    </div>
  );
};

export default SimpleAudioRecorder;
