from fastapi import APIRouter, HTTPException, Depends
import services.user_service as service_manager
from db.auth.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])

@router.put("/{user_id}")
async def update_usuario(user_id: str, data: dict):
    response = await service_manager.update_user(user_id, data)
    if response["message"] == "User not found or data unchanged":
        raise HTTPException(status_code=404, detail=response["message"])
    return response

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    response = await service_manager.delete_user(user_id)
    if response["message"] == "User not found":
        raise HTTPException(status_code=404, detail="User not found")
    return response

@router.get("/")
async def get_users(current_user=Depends(require_admin)):
    return await service_manager.get_users()

@router.get("/me")
async def get_current_user_data(current_user=Depends(get_current_user)):
    return await service_manager.get_current_user(current_user["id"])