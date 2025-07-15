from fastapi import APIRouter, HTTPException, Depends
import services.chat_service as service_manager
from db.auth.dependencies import get_current_user

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("/")
async def create_chat(data: dict):
    return await service_manager.create_chat(data)

@router.get("/")
async def get_chats():
    return await service_manager.get_chats()

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str):
    response = await service_manager.delete_chat(chat_id)
    if response["message"] == "Chat not found":
        raise HTTPException(status_code=404, detail=response["message"])
    return response

@router.put("/{chat_id}")
async def update_chat(chat_id: str, data: dict):
    response = await service_manager.update_chat(chat_id, data)
    if response["message"].startswith("Chat not found"):
        raise HTTPException(status_code=404, detail=response["message"])
    return response

@router.post("/chat/continue")
async def continue_chat(chat_id: str, message: str):
    return await service_manager.continue_chat(chat_id, message)