# main.py
from fastapi import FastAPI
from app.routers import textToVoice, similarity, objectDetection, audio, translation
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 라우터 포함
app.include_router(textToVoice.router)
app.include_router(similarity.router)
app.include_router(objectDetection.router)
app.include_router(audio.router)
app.include_router(translation.router)  # translation 라우터 추가

# CORS 설정
origins = [
    "http://localhost:3000",  # React 개발 서버
    "http://127.0.0.1:3000",
    "http://localhost:8000/docs/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 필요에 따라 도메인 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
