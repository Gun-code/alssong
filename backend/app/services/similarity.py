import librosa
import numpy as np


def load_audio(file_path):
    """ 음성 파일 로드 """
    y,sr = librosa.load(file_path, sr=None)
    return y,sr


def compute_mel_spectrogram(y, sr):
    """ 멜 스펙트로그램 생성"""
    mel_spectrogram = librosa.feature.melspectrogram(y= y, sr= sr)
    return mel_spectrogram

def euclidean_distance(spectrogram1, spectrogram2):
    """ 유클리드 거리 계산 """
    dist = np.linalg.norm(spectrogram1 - spectrogram2)
    return dist

def compare_audio_files(file1_path, file2_path):
    """
    두 음성 파일의 유클리드 거리 계산
    - file1_path: 첫 번째 파일 경로
    - file2_path: 두 번째 파일 경로
    """
    try:
        y1, sr1 = load_audio(file1_path)
        y2, sr2 = load_audio(file2_path)
        
        mel_spectrogram1 = compute_mel_spectrogram(y1, sr1)
        mel_spectrogram2 = compute_mel_spectrogram(y2, sr2)
        
        distance = euclidean_distance(mel_spectrogram1, mel_spectrogram2)
        return distance
    except Exception as e : 
        raise ValueError(f"오류 발생 : {e}")