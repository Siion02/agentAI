from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4
from typing import List, Dict, Any

class Chat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    messages: List[Dict[str, Any]]
    model: str
    date: datetime = Field(default_factory=datetime.utcnow)