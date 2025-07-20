from models.user import User
from db import crud
from datetime import datetime
from uuid import uuid4
from passlib.context import CryptContext
from db.auth.utils import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def register_user(data: dict):
    existing = await crud.get_user_by_email(data["email"])
    if existing:
        return {"error": "Email already registered"}

    user = User(
        id=str(uuid4()),
        name=data["first_name"],
        surname=data["last_name"],
        role=data["role"],
        email=data["email"],
        password=pwd_context.hash(data["password"]),
        created_on=datetime.utcnow()
    )
    await crud.insert_user(user)
    return {"message": "User registered successfully"}

async def login_user(data: dict):
    user = await crud.get_user_by_email(data["email"])
    if not user or not pwd_context.verify(data["password"], user["password"]):
        return {"error": "Invalid email or password"}

    token = create_access_token({"sub": str(user["id"])})
    return {"access_token": token, "token_type": "bearer"}
