from fastapi import APIRouter, HTTPException, Depends, Body
import services.chat_service as service_manager
from db.auth.dependencies import get_current_user, require_admin
from pydantic import BaseModel

class MessageInput(BaseModel):
    message: str

router = APIRouter(prefix="/chats", tags=["chats"], dependencies=[Depends(get_current_user)])

@router.post("/")
async def create_chat(data: dict):
    try:
        return await service_manager.create_chat(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_chats(current_user=Depends(require_admin)):
    return await service_manager.get_chats()

@router.get("/u/{user_id}")
async def get_chats_by_user_id(user_id: str):
    return await service_manager.get_chats_by_user_id(user_id)

@router.get("/{chat_id}")
async def get_chat_by_id(chat_id: str, current_user=Depends(get_current_user)):
    chat = await service_manager.get_chat_by_id(chat_id, current_user["id"])
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found or access denied")
    return chat

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

@router.post("/{chat_id}")
async def continue_chat(chat_id: str, data: MessageInput, current_user=Depends(get_current_user)):
    result = await service_manager.continue_chat(chat_id, data.message, current_user["id"])
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result
