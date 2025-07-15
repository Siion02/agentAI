from fastapi import APIRouter, HTTPException
from services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(data: dict):
    result = await register_user(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
async def login(data: dict):
    result = await login_user(data)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result
