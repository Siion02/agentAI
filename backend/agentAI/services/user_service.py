from db import crud

async def update_user(user_id: str, data: dict):
    updated = await crud.update_user(user_id, data)
    if updated == 0:
        return {"message": "User not found or data unchanged"}
    return {"message": "User updated"}


async def delete_user(user_id: str):
    deleted_count = await crud.delete_user(user_id)
    if deleted_count == 0:
        return {"message": "User not found"}
    return {"message": "User deleted"}

async def get_users():
    return await crud.get_users()

async def get_current_user(user_id: str):
    return await crud.get_user_by_id(user_id)