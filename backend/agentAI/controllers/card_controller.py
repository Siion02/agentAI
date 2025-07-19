from fastapi import APIRouter, HTTPException
import services.card_service as service_manager

router = APIRouter(prefix="/cards", tags=["cards"])

@router.post("/")
async def create_card(data: dict):
    return await service_manager.create_card(data)

@router.get("/")
async def get_cards():
    return await service_manager.get_cards()

@router.get("/{user_id}")
async def get_cards_by_user_id(user_id: str):
    return await service_manager.get_cards_by_user_id(user_id)

@router.delete("/{card_id}")
async def delete_card(card_id: str):
    response = await service_manager.delete_card(card_id)
    if response["message"] == "Card not found":
        raise HTTPException(status_code=404, detail=response["message"])
    return response

@router.put("/{card_id}")
async def update_card(card_id: str, data: dict):
    response = await service_manager.update_card(card_id, data)
    if response["message"].startswith("Card not found"):
        raise HTTPException(status_code=404, detail=response["message"])
    return response
