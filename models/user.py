from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    surname: str
    password: str
    role: str
    email: str
    created_on: datetime = Field(default_factory=datetime.utcnow)
