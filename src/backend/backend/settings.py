from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    log_level: str = "INFO"

    mongo_uri: str = "mongodb://mongo:27017"
    mongo_db: str = "omni-v2v"

    worker_token: str = "worker-token"

    aliyun_access_key: str

    aliyun_access_secret: str

    aliyun_role_arn: str

    aliyun_region_id: str = "cn-beijing"


settings = Settings(
    _env_file=".env",
    _env_file_encoding="utf-8",
)
