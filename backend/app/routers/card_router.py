from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from app.repository.db_repository import DBRepository
from app.services.card_service import CardService
from app.models.card_model import CardModel

router = APIRouter()

# MongoDB 연결 설정
MONGO_URI = "mongodb://221.148.97.237:27170"
client = AsyncIOMotorClient(MONGO_URI)
db = client["miniproject"]

# Repository 및 Service 초기화
repository = DBRepository(db)
card_service = CardService(repository)

@router.post("/cards/")
async def create_card(card: CardModel):
    """
    새로운 카드를 생성합니다.
    """
    try:
        card_id = await card_service.save_card(card)
        return {
            "message": "Card created successfully",
            "card_id": card_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cards/{card_id}")
async def get_card(card_id: str):
    """
    특정 카드를 조회합니다.
    """
    card = await card_service.get_card(card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@router.get("/cards/")
async def get_all_cards():
    """
    모든 카드를 조회합니다.
    """
    return await card_service.get_all_cards()