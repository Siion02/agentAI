from bson import ObjectId

def normalize_document(doc: dict) -> dict:
    #doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc
