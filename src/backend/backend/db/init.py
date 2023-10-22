from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from backend.models import gather_documents
from backend.settings import settings


async def init_db() -> None:
    client = AsyncIOMotorClient(settings.mongo_uri)

    await init_beanie(
        database=getattr(client, settings.mongo_db),
        document_models=gather_documents(),
    )
