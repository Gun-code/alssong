from pydantic import BaseModel
class wordModel(BaseModel):
    name: str
    path: str
    username: str