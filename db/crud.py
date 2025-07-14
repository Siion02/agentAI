from models.user import User
from models.chat import Chat
from models.card import Card
from bson import ObjectId
from db.mongo_client import db
from db.utils import normalize_document


# region User

async def insert_user(user: User):
    result = await db.users.insert_one(user.dict())
    user_dict = user.dict()
    user_dict["id"] = str(result.inserted_id)
    return user_dict

async def get_user_by_email(email: str):
    return await db.users.find_one({"email": email})

async def get_user_by_id(user_id: str):
    return await db.users.find_one({"_id": ObjectId(user_id)})

async def update_user(user_id: str, data: dict):
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": data}
    )
    return result.modified_count


async def delete_user(user_id: str):
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count

async def get_users():
    cursor = db.users.find()
    users = []
    async for doc in cursor:
        users.append(normalize_document(doc))
    return users

# endregion

# region Card

async def insert_card(card: Card):
    result = await db.cards.insert_one(card.dict())
    return result.inserted_id

async def get_cards():
    cursor = db.cards.find()
    cards = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        cards.append(doc)
    return cards

async def delete_card(card_id: str):
    result = await db.cards.delete_one({"_id": ObjectId(card_id)})
    return result.deleted_count

async def update_card(card_id: str, data: dict):
    result = await db.cards.update_one({"_id": ObjectId(card_id)}, {"$set": data})
    return result.modified_count

# endregion

# region Chat

async def insert_chat(chat: Chat):
    result = await db.chats.insert_one(chat.dict())
    return result.inserted_id

async def get_chat_by_id(chat_id: str):
    return await db.chats.find_one({"_id": ObjectId(chat_id)})

async def get_chats():
    cursor = db.chats.find()
    chats = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        chats.append(doc)
    return chats

async def delete_chat(chat_id: str):
    result = await db.chats.delete_one({"_id": ObjectId(chat_id)})
    return result.deleted_count

async def update_chat(chat_id: str, data: dict):
    result = await db.chats.update_one({"_id": ObjectId(chat_id)}, {"$set": data})
    return result.modified_count

# endregion