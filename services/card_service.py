from models.card import Card
from db import crud
from uuid import uuid4
from datetime import datetime

async def create_card(data: dict):
    card = Card(
        id=str(uuid4()),
        chat_id=data["chat_id"],
        user_id=data["user_id"],
        data=data["data"],
        completeness=data.get("completeness", 1.0),
        generated_on=datetime.utcnow()
    )
    await crud.insert_card(card)
    return card

async def get_cards():
    return await crud.get_cards()

async def delete_card(card_id: str):
    deleted = await crud.delete_card(card_id)
    return {"message": "Card deleted" if deleted else "Card not found"}

async def update_card(card_id: str, data: dict):
    updated = await crud.update_card(card_id, data)
    return {"message": "Card updated" if updated else "Card not found or data unchanged"}
