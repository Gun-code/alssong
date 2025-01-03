# app/services/similarity.py
import librosa
import numpy as np

def load_audio(file_path):
    """ 음성 파일 로드 """
    try:
        y, sr = librosa.load(file_path, sr=None)
        return y, sr
    except Exception as e:
        raise ValueError(f"오디오 로드 중 오류: {e}")

def compute_mel_spectrogram(y, sr):
    """ 멜 스펙트로그램 생성 """
    mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr)
    return mel_spectrogram

def euclidean_distance(spectrogram1, spectrogram2):
    """ 유클리드 거리 계산 """
    # 두 스펙트로그램의 크기를 맞추기 위해 패딩 또는 자르기
    min_length = min(spectrogram1.shape[1], spectrogram2.shape[1])
    spectrogram1 = spectrogram1[:, :min_length]
    spectrogram2 = spectrogram2[:, :min_length]
    dist = np.linalg.norm(spectrogram1 - spectrogram2)
    return dist

def compare_audio_files(file1_path, file2_path):
    """
    두 음성 파일의 유사도 계산
    - file1_path: 첫 번째 파일 경로
    - file2_path: 두 번째 파일 경로
    """
    try:
        y1, sr1 = load_audio(file1_path)
        y2, sr2 = load_audio(file2_path)

        mel_spectrogram1 = compute_mel_spectrogram(y1, sr1)
        mel_spectrogram2 = compute_mel_spectrogram(y2, sr2)

        distance = euclidean_distance(mel_spectrogram1, mel_spectrogram2)

        # 유사도 계산: inverse transformation
        similarity = 1 / (1 + distance)
        
         # 퍼센트로 변환
        similarity_percentage = int(similarity * 100000)

        # 결과 메시지
        if similarity_percentage >= 0:
            return f"유사도: {similarity_percentage}% - 통과"
        else:
            return f"유사도: {similarity_percentage}% - 다시 시도"
    except Exception as e:
        raise ValueError(f"오류 발생: {e}")