
from app.repository.db_repository import DBRepository


class WordService:
    def __init__(self, repository: DBRepository):
        self.repository = repository

    async def create_item(self, data: dict) -> str:
        """
        새 항목을 생성하고 ID를 반환합니다.
        """
        return await self.repository.create_item("items", data)

    async def get_item_by_id(self, item_id: str) -> dict:
        """
        ID를 기준으로 항목을 조회합니다.
        """
        return await self.repository.get_item_by_id("items", item_id)

    async def update_item(self, item_id: str, data: dict) -> bool:
        """
        항목 데이터를 업데이트합니다.
        """
        return await self.repository.update_item("items", item_id, data)

        항목을 삭제합니다.
        """
        return await self.repository.delete_item("items", item_id)
