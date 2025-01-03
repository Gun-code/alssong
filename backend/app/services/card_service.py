from app.repository.db_repository import DBRepository
from app.models.card_model import CardModel
from datetime import datetime

class CardService:
    def __init__(self, repository: DBRepository):
        self.repository = repository
        self.collection = "cards"

    async def save_card(self, card: CardModel) -> str:
        """
        카드 정보를 MongoDB에 저장합니다.
        """
        card_data = {
            "name": card.name,  # 영어 단어
            "path": card.path,  # 이미지 경로
            "korean_text": card.korean_text,  # 한글 번역
            "created_at": datetime.now().isoformat()
        }
        return await self.repository.create_item(self.collection, card_data)

    async def get_card(self, card_id: str) -> dict:
        """
        저장된 카드를 조회합니다.
        """
        return await self.repository.get_item_by_id(self.collection, card_id)

    async def get_all_cards(self) -> list:
        """
        모든 카드를 조회합니다.
        """
        cursor = self.repository.db[self.collection].find()
        cards = []
        async for card in cursor:
            card["_id"] = str(card["_id"])
            cards.append(card)
        return cards