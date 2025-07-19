import db.crud as crud

async def get_models():
    return await crud.get_models()

async def get_roles():
    return await crud.get_roles()