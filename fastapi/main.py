from fastapi import FastAPI
from app.routers import textToVoice, similarity
import uvicorn

app = FastAPI()

app.include_router(textToVoice.router)
app.include_router(similarity.router)

# 포트 설정
# if __name__ == "__main__":
#     uvicorn.run(app, post="8000" )

# uvicorn main:app --reload --port=8000