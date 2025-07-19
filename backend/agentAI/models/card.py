from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4
from typing import Dict, Any

class Card(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    chat_id: str
    user_id: str
    data: Dict[str, Any]
    completeness: float
    generated_on: datetime = Field(default_factory=datetime.utcnow)
