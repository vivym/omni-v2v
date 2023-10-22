from .base import BaseSchema


class StsToken(BaseSchema):
    access_key_id: str
    access_key_secret: str
    security_token: str
    expiration: str


class StsTokenResponse(BaseSchema):
    token: StsToken | None
