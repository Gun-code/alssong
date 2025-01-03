# # app/routers/similarity.py
# from fastapi import APIRouter, UploadFile, File, HTTPException
# from app.services.similarity import compare_audio_files
# import os
# import shutil
# from pydub import AudioSegment  # 필요 시 추가
# import librosa
# import numpy as np

# router = APIRouter()

# # 업로드 파일 저장 디렉토리
# UPLOAD_DIR = "app/static/"

# @router.post("/similarity/")
# async def similarity(file1: UploadFile = File(...), file2: UploadFile = File(...)):
#     """
#     두 음성 파일을 비교하여 유사도를 계산합니다.
#     """
#     try:
#         file1_path = os.path.join(UPLOAD_DIR, file1.filename)
#         file2_path = os.path.join(UPLOAD_DIR, file2.filename)

#         # 파일 저장
#         with open(file1_path, "wb") as f1, open(file2_path, "wb") as f2:
#             shutil.copyfileobj(file1.file, f1)
#             shutil.copyfileobj(file2.file, f2)

#         # 유사도 계산
#         similarity = compare_audio_files(file1_path, file2_path)

#         # 저장된 파일 삭제
#         os.remove(file1_path)
#         os.remove(file2_path)

#         # 반환값은 Python의 기본 타입
#         return {"similarity": similarity}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"오류 발생: {str(e)}")

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.similarity import compare_audio_files
from app.repository.db_repository import DBRepository
from app.models.word_model import wordModel
import os
import shutil
from datetime import datetime

router = APIRouter()

# 임시 오디오 파일 저장 디렉토리
TEMP_AUDIO_DIR = "app/static/temp_audio/"
# 이미지 저장 디렉토리
IMAGE_DIR = "app/static/images/"

# MongoDB 연결 설정
repository = DBRepository(db)  # db 객체는 main.py에서 가져와야 함

@router.post("/similarity/")
async def similarity(
    file1: UploadFile = File(...), 
    file2: UploadFile = File(...),
    word_name: str = None,  # 영어 단어
    image_path: str = None  # 이미지 경로
):
    """
    두 음성 파일을 비교하여 유사도를 계산하고, 
    통과시 단어와 이미지 정보를 DB에 저장합니다.
    """
    try:
        # 임시 디렉토리 생성
        os.makedirs(TEMP_AUDIO_DIR, exist_ok=True)

        # 임시 파일 경로 설정
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file1_path = os.path.join(TEMP_AUDIO_DIR, f"temp1_{timestamp}.webm")
        file2_path = os.path.join(TEMP_AUDIO_DIR, f"temp2_{timestamp}.webm")

        # 파일 임시 저장
        with open(file1_path, "wb") as f1, open(file2_path, "wb") as f2:
            shutil.copyfileobj(file1.file, f1)
            shutil.copyfileobj(file2.file, f2)

        # 유사도 계산
        similarity_result = compare_audio_files(file1_path, file2_path)
        
        # 유사도가 일정 수준 이상이면 DB에 저장
        if "통과" in similarity_result:
            # wordModel을 사용하여 DB에 저장
            word_data = {
                "name": word_name,
                "path": image_path,
                "created_at": datetime.now().isoformat()
            }
            word_id = await repository.create_item("words", word_data)
            
            response_data = {
                "similarity": similarity_result,
                "word_id": word_id,
                "message": "단어가 성공적으로 저장되었습니다."
            }
        else:
            response_data = {
                "similarity": similarity_result,
                "message": "유사도가 낮아 단어가 저장되지 않았습니다."
            }

        # 임시 파일 삭제
        os.remove(file1_path)
        os.remove(file2_path)

        return response_data

    except Exception as e:
        # 오류 발생시 임시 파일 삭제 시도
        try:
            if os.path.exists(file1_path):
                os.remove(file1_path)
            if os.path.exists(file2_path):
                os.remove(file2_path)
        except:
            pass
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")