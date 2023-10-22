from datetime import datetime
from typing import Optional

from beanie import Document, Indexed, UpdateResponse, PydanticObjectId
from pydantic import Field

from backend.schemas.task import Task, TaskCreation, TaskCompletion


class TaskModel(Document):
    video_oss_bucket: str
    video_oss_key: str
    positive_prompt: str
    negative_prompt: str
    seed: int

    src_video_oss_bucket: str | None = None
    src_video_oss_key: str | None = None

    tgt_video_oss_bucket: str | None = None
    tgt_video_oss_key: str | None = None

    status: Indexed(str) = "pending"
    message: str | None = None
    created_at: Indexed(datetime) = Field(default_factory=datetime.utcnow)
    completed_at: datetime | None = None
    views: int = 0
    private: bool = False

    @classmethod
    def from_task_creation_schema(cls, task: TaskCreation) -> "TaskModel":
        return cls(
            video_oss_bucket=task.video_oss_bucket,
            video_oss_key=task.video_oss_key,
            positive_prompt=task.positive_prompt,
            negative_prompt=task.negative_prompt,
            seed=task.seed,
        )

    def to_task_schema(self) -> Task:
        return Task(
            id=str(self.id),
            video_oss_bucket=self.video_oss_bucket,
            video_oss_key=self.video_oss_key,
            positive_prompt=self.positive_prompt,
            negative_prompt=self.negative_prompt,
            seed=self.seed,
            src_video_oss_bucket=self.src_video_oss_bucket,
            src_video_oss_key=self.src_video_oss_key,
            tgt_video_oss_bucket=self.tgt_video_oss_bucket,
            tgt_video_oss_key=self.tgt_video_oss_key,
            status=self.status,
            message=self.message,
            created_at=self.created_at,
            completed_at=self.completed_at,
            views=self.views,
            private=self.private,
        )

    @classmethod
    async def get_by_id(cls, task_id: str | PydanticObjectId) -> Optional["TaskModel"]:
        if isinstance(task_id, str):
            task_id = PydanticObjectId(task_id)

        return await cls.find_one(cls.id == task_id)

    @classmethod
    async def get_pending_task(cls) -> Optional["TaskModel"]:
        return (
            await cls.find(cls.status == "pending")
                .sort(cls.created_at)
                .limit(1)
                .set({cls.status: "processing"}, response_type=UpdateResponse.NEW_DOCUMENT)
        )

    @classmethod
    async def complete(
        cls,
        task_id: str | PydanticObjectId,
        task: TaskCompletion,
    ) -> None:
        if isinstance(task_id, str):
            task_id = PydanticObjectId(task_id)

        (
            await cls.find_one(cls.id == task_id, cls.status == "processing")
                .set({cls.status: "completed"})
                .set({cls.src_video_oss_bucket: task.src_video_oss_bucket})
                .set({cls.src_video_oss_key: task.src_video_oss_key})
                .set({cls.tgt_video_oss_bucket: task.tgt_video_oss_bucket})
                .set({cls.tgt_video_oss_key: task.tgt_video_oss_key})
                .set({cls.completed_at: datetime.utcnow()})
        )

    @classmethod
    async def fail(cls, task_id: str | PydanticObjectId, message: str) -> None:
        if isinstance(task_id, str):
            task_id = PydanticObjectId(task_id)

        (
            await cls.find_one(cls.id == task_id, cls.status == "processing")
                .set({cls.status: "failed"})
                .set({cls.message: message})
                .set({cls.completed_at: datetime.utcnow()})
        )

    @classmethod
    async def visit(cls, task_id: str | PydanticObjectId) -> Optional["TaskModel"]:
        if isinstance(task_id, str):
            task_id = PydanticObjectId(task_id)

        return (
            await cls.find_one(cls.id == task_id)
                .inc({cls.views: 1}, response_type=UpdateResponse.NEW_DOCUMENT)
        )