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
        const url = URL.createObjectURL(audioBlob);
        onStop(audioBlob); // 부모에게 오디오 데이터 전달
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('녹음 시작 실패:', error);
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
