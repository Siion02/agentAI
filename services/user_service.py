from datetime import datetime
from uuid import uuid4

from models.user import User
from db import crud

async def create_user(data: dict):
    user = User(
        id=str(uuid4()),
        name=data["name"],
        surname=data["surname"],
        #password=data["password"],
        role=data["role"],
        email=data["email"],
        created_on=datetime.utcnow()
    )
    await crud.insert_user(user)
    return user

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
