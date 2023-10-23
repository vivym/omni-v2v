from datetime import datetime

from pydantic import Field

from .base import BaseSchema


class Task(BaseSchema):
    id: str
    video_oss_bucket: str
    video_oss_key: str
    positive_prompt: str
    negative_prompt: str
    seed: int

    src_video_oss_bucket: str | None = None
    src_video_oss_key: str | None = None

    tgt_video_oss_bucket: str | None = None
    tgt_video_oss_key: str | None = None

    status: str = "pending"
    message: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    to_process_after: datetime = Field(default_factory=datetime.utcnow)
    processing_at: datetime | None = None
    completed_at: datetime | None = None
    views: int = 0
    private: bool = False


class TaskResponse(BaseSchema):
    task: Task | None


class TaskCreation(BaseSchema):
    video_oss_bucket: str
    video_oss_key: str
    positive_prompt: str
    negative_prompt: str
    seed: int


class TaskCompletion(BaseSchema):
    src_video_oss_bucket: str
    src_video_oss_key: str

    tgt_video_oss_bucket: str
    tgt_video_oss_key: str
