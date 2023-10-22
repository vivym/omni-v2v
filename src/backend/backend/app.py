import json
from contextlib import asynccontextmanager
from functools import lru_cache
from typing import TYPE_CHECKING

import structlog
import oss2
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
from fastapi import FastAPI

from .db import init_db
from .models.task import TaskModel
from .logging import setup_logging
from .schemas.task import TaskCreation, TaskCompletion, TaskResponse
from .schemas.token import StsTokenResponse, StsToken
from .settings import settings

if TYPE_CHECKING:
    from structlog.stdlib import BoundLogger

logger: "BoundLogger" = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    await init_db()
    logger.info("Database connected.")
    yield


app = FastAPI(lifespan=lifespan)


@app.post("/task", response_model=TaskResponse)
async def create_task(task: TaskCreation):
    task_doc = TaskModel.from_task_creation_schema(task)
    task_doc: TaskModel = await task_doc.insert()
    return {"task": task_doc.to_task_schema()}


@app.get("/task", response_model=TaskResponse)
async def get_pending_task(token: str):
    if token != settings.worker_token:
        return {"task": None}

    task = await TaskModel.get_pending_task()

    if task:
        return {"task": task.to_task_schema()}
    else:
        return {"task": None}


@app.post("/tasks/{task_id}", response_model=TaskResponse)
async def complete_task(task_id: str, task: TaskCompletion):
    await TaskModel.complete(task_id, task)

    return {"task": None}


@app.post("/tasks/{task_id}/fail", response_model=TaskResponse)
async def fail_task(task_id: str, message: str):
    await TaskModel.fail(task_id, message)

    return {"task": None}


@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task_by_id(task_id: str):
    task_doc = await TaskModel.visit(task_id)

    if task_doc:
        return {"task": task_doc.to_task_schema()}
    else:
        return {"task": None}


@app.get("/ping")
async def ping():
    return {"ping": "pong"}


@app.get("/sts", response_model=StsTokenResponse)
async def get_sts_token():
    policy_text = """{"Version": "1", "Statement": [{"Action": ["oss:PutObject","oss:GetObject"], "Effect": "Allow", "Resource": ["acs:oss:*:*:omni-v2v/*"]}]}"""

    client = get_acs_client()
    req = CommonRequest(product="Sts", version="2015-04-01", action_name="AssumeRole")
    req.set_method("POST")
    req.set_protocol_type("https")
    req.add_query_param("RoleArn", settings.aliyun_role_arn)
    req.add_query_param("RoleSessionName", "omni-v2v")
    req.add_query_param("DurationSeconds", 1800)
    req.add_query_param("Policy", policy_text)
    req.set_accept_format("JSON")

    body = client.do_action_with_exception(req)

    token = json.loads(oss2.to_unicode(body))

    return StsTokenResponse(
        token=StsToken(
            access_key_id=token["Credentials"]["AccessKeyId"],
            access_key_secret=token["Credentials"]["AccessKeySecret"],
            security_token=token["Credentials"]["SecurityToken"],
            expiration=token["Credentials"]["Expiration"],
        ),
    )


@lru_cache()
def get_acs_client() -> AcsClient:
    return AcsClient(
        ak=settings.aliyun_access_key,
        secret=settings.aliyun_access_secret,
        region_id=settings.aliyun_region_id,
    )
