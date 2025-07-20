import json
import os

from model_usage.model_router import ModelRouter
from models.chat import Chat
from db import crud
from uuid import uuid4
from datetime import datetime

async def create_chat(data: dict):
    chat = Chat(
        id=str(uuid4()),
        user_id=data["user_id"],
        title=data["title"],
        messages=data.get("messages", []),
        model=data["model"],
        date=datetime.utcnow()
    )
    await crud.insert_chat(chat)
    return chat

async def get_chats():
    return await crud.get_chats()

async def get_chats_by_user_id(user_id: str):
    return await crud.get_chats_by_user_id(user_id)

async def get_chat_by_id(chat_id: str, user_id: str):
    return await crud.get_chat_by_id(chat_id, user_id)

async def delete_chat(chat_id: str):
    deleted = await crud.delete_chat(chat_id)
    return {"message": "Chat deleted" if deleted else "Chat not found"}

async def update_chat(chat_id: str, data: dict):
    updated = await crud.update_chat(chat_id, data)
    return {"message": "Chat updated" if updated else "Chat not found or data unchanged"}

async def continue_chat(chat_id: str, message: str, user_id: str):
    chat = await crud.get_chat_by_id(chat_id, user_id)
    if not chat:
        return {"error": "Chat not found"}

    router = ModelRouter()
    preferred_model = chat["model"].lower()

    recent_messages = chat["messages"][-5:]
    recent_messages.append({"role": "user", "content": message})

    file_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            '..',
            'tools', 'tool_definitions.json'
        )
    )
    with open(file_path, 'r', encoding='utf-8') as f:
        tools = json.load(f)["tools"]

    injection_context = {
        "chat_id": chat_id,
        "user_id": user_id
    }

    #print("Calling LLM ...")
    response = await router.route(preferred_model=preferred_model, tools=tools, messages=recent_messages, injection_context=injection_context)

    agent_message = response.choices[0].message.content

    full_messages = chat["messages"]
    full_messages.append({"role": "user", "content": message})
    full_messages.append({"role": "assistant", "content": agent_message})

    await crud.update_chat(chat_id, {"messages": full_messages})

    return {"response": response.choices[0].message.content}