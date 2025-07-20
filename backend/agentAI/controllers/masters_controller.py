from fastapi import APIRouter, HTTPException, Depends, Body
import services.masters_service as service_manager
from db.auth.dependencies import get_current_user

router = APIRouter(prefix="/masters", tags=["masters"])

@router.get("/models")
async def get_models():
    return await service_manager.get_models()

@router.get("/roles")
async def get_roles():
    return await service_manager.get_roles()