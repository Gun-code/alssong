from fastapi import FastAPI
from routers import translate
import uvicorn

app = FastAPI()

app.inclued_router(translate.router)