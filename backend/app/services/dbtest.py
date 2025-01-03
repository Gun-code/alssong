
from app.repository.db_repository import DBRepository


class WordService:
    def __init__(self, repository: DBRepository):
        self.repository = repository

    async def create_item(self, data: dict) -> str:
        """
        새 항목을 생성하고 ID를 반환합니다.
        """
        return await self.repository.create_item("items", data)

    async def get_item_by_name(self, item_id: str) -> dict:
        """
        단어 이름을 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_item_by_name("items", item_id)
    
    async def get_item_by_username(self, username: str) -> list:
        """
        내 단어 유무를 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_item_by_username("items", username)

    async def update_item(self, item_id: str, data: dict) -> bool:
        """
        항목 데이터를 업데이트합니다.
        """
        return await self.repository.update_item("items", item_id, data)

