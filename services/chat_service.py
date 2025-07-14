from models.chat import Chat
from db import crud
from uuid import uuid4
from datetime import datetime

async def create_chat(data: dict):
    chat = Chat(
        id=str(uuid4()),
        user_id=data["user_id"],
        messages=data["messages"],
        model=data["model"],
        date=datetime.utcnow()
    )
    await crud.insert_chat(chat)
    return chat

async def get_chats():
    return await crud.get_chats()

async def get_chat_by_id(chat_id: str):
    return await crud.get_chat_by_id(chat_id)

async def delete_chat(chat_id: str):
    deleted = await crud.delete_chat(chat_id)
    return {"message": "Chat deleted" if deleted else "Chat not found"}

async def update_chat(chat_id: str, data: dict):
    updated = await crud.update_chat(chat_id, data)
    return {"message": "Chat updated" if updated else "Chat not found or data unchanged"}

async def continue_chat(chat_id: str, message: str, user_id: str):
    chat = await crud.get_chat_by_id(chat_id)
    if not chat:
        return {"error": "Chat not found"}

    messages = chat["messages"]
    messages.append({"role": "user", "content": message})

    #response = await model_router.chat_with_model(messages)
    response = 0 # while no calls at LLM model

    messages.append({"role": "assistant", "content": response})
    await crud.update_chat(chat_id, {"messages": messages})

    return {"response": response}