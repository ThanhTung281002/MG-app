LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/relation")


# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from datetime import datetime 
from bson import ObjectId
from bson.errors import InvalidId
from app.core.database import db


def db_get_relation_by_user_id_and_to_object(user_id: str, type: str, id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy mối quan hệ to {id} ({type}) của user: {user_id}")

    try: 
        object_user_id = ObjectId(user_id)
        object_id = ObjectId(id)
    except InvalidId: 
        return None
    
    result = db.relations.find_one({
        "user_id": object_user_id, 
        "to_type": type, 
        "to_id": object_id
    })

    if not result: 
        return None

    result["id"] = str(result["_id"])
    del result["_id"]
    result["user_id"] = str(result["user_id"])
    result["from_id"] = str(result["from_id"])
    result["to_id"] = str(result["to_id"])

    return result 





def db_get_relations_by_user_id_and_from_object(user_id: str, type: str, id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy các liên kết mà sinh ra từ {id} ({type}) của user: {user_id}")

    try: 
        object_user_id = ObjectId(user_id)
        object_id = ObjectId(id)
    except InvalidId: 
        return []
    
    relations = db.relations.find({
        "user_id": object_user_id, 
        "from_type": type, 
        "from_id": object_id
    })

    result = []

    for r in relations: 
        r["id"] = str(r["_id"])
        del r["_id"]

        r["user_id"] = str(r["user_id"])
        r["from_id"] = str(r["from_id"])
        r["to_id"] = str(r["to_id"])
        
        result.append(r)

    return result 










# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException


class DomainError(Exception): 
    pass


def handle_get_origin_object(user_id: str, type: str, id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy thực thể bối cảnh {id} ({type}) của user: {user_id}")

    """
    DOMAIN RULES: 
    1. liên kết phải tồn tại 
    """ 

    ### 1. check rules
    relation = db_get_relation_by_user_id_and_to_object(user_id, type, id)

    if not relation: 
        raise DomainError("Relation not found")

    ### 2. trả theo format của api contract 
    return {
        "type": relation["from_type"],
        "to": relation["from_id"]
    }




def handle_get_born_objects(user_id: str, type: str, id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy các thực thể sinh ra từ {id} ({type}) của user: {user_id}")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy relations 
    relations = db_get_relations_by_user_id_and_from_object(user_id, type, id)

    ### 2. đổi sang format phù hợp với api contract rồi return 
    result = []
    for r in relations: 
        result.append({
            "type": r["to_type"],
            "id": r["to_id"]
        })

    return {
        "born": result
    }




















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel 
from app.dependencies.auth import require_login


router = APIRouter()

class APIError(Exception): 
    pass



@router.get("/relations/origin")
def get_origin_object(type: str, id: str, current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /relations/origin?type={type}&id={id}")

    try: 
        VALID_TYPES = {"TEACHING_WORD", "LIFE_LESSON", "PURPOSE", "NOTE"}
        if type not in VALID_TYPES: 
            raise APIError("Invalid type type")
        else: 
            return handle_get_origin_object(current_user["id"], type, id)

        
    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")





@router.get("/relations/born")
def get_born_objects(type: str, id: str, current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /relations/born?type={type}&id={id}")

    try: 
        VALID_TYPES = {"TEACHING_WORD", "LIFE_LESSON", "PURPOSE", "NOTE"}
        if type not in VALID_TYPES: 
            raise APIError("Invalid type type")
        else: 
            return handle_get_born_objects(current_user["id"], type, id)


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
