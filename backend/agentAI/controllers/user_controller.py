from fastapi import APIRouter, HTTPException
import services.user_service as service_manager

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/")
async def create_user(data: dict):
    return await service_manager.create_user(data)

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
async def get_users():
    return await service_manager.get_users()
