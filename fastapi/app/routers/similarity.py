from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from app.services.similarity import compare_audio_files
import os
import shutil

router = APIRouter()

# 업로드 파일 저장 디렉토리
UPLOAD_DIR = "app/static/"

@router.post("/similarity/")
async def similarity(file1: UploadFile = File(...),file2: UploadFile = File(...)):
    """
    두 음성 파일을 비교하여 유클리드 거리 반환
    """
    try:
        #파일 저장
        file1_path = os.path.join(UPLOAD_DIR, file1.filename)
        file2_path = os.path.join(UPLOAD_DIR, file2.filename)
        
        with open(file1_path,"wb") as f1, open(file2_path,"wb") as f2:
            shutil.copyfileobj(file1.file, f1)
            shutil.copyfileobj(file2.file, f2)
            
        # 비교 수행
        distance = compare_audio_files(file1_path,file2_path)
        
        # 저장된 파일 삭제
        os.remove(file1_path)
        os.remove(file2_path)
        
        return JSONResponse(content={"distance": distance})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="서버 오류 발생")
            
    
    
    