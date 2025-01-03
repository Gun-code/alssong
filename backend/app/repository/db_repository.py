from motor.motor_asyncio import AsyncIOMotorDatabase
from bson.objectid import ObjectId


class DBRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def create_item(self, collection: str, data: dict) -> str:
        """
        MongoDB에 새 단어를 생성합니다.
        """
        result = await self.db[collection].insert_one(data)
        return str(result.inserted_id)

    async def get_item_by_id(self, collection: str, item_id: str) -> dict:
        """
        ID를 기준으로 MongoDB에서 단어를 조회합니다.
        """
        result = await self.db[collection].find_one({"_id": ObjectId(item_id)})
        if result:
            result["_id"] = str(result["_id"])  # ObjectId를 문자열로 변환
        return result

    async def update_item(self, collection: str, item_id: str, data: dict) -> bool:
        """
        ID를 기준으로 MongoDB 단어를 업데이트합니다.
        """
        result = await self.db[collection].update_one(
            {"_id": ObjectId(item_id)}, {"$set": data}
        )
        return result.modified_count > 0

    async def delete_item(self, collection: str, item_id: str) -> bool:
        """
        ID를 기준으로 MongoDB 단어를 삭제합니다.
        """
        result = await self.db[collection].delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count > 0