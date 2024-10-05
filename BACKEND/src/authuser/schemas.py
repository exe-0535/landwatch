from ninja.schema import Schema
from typing import Optional

class UserRegisterSchema(Schema):
    email: str
    password: str

class UserLoginSchema(Schema):
    email: str
    password: str

class TokenRefreshSchema(Schema):
    refresh: str

class TokenSchema(Schema):
    access: str
    refresh: Optional[str] = None