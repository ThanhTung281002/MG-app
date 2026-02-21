





LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/action")








# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from bson import ObjectId
from app.core.database import db
from datetime import datetime 




def db_get_purpose_by_id(id: str): 
    print(f"{LOG_DATABASE} vào lấy mục đích có id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy purpose từ db 
    p = db.purposes.find_one({"_id": object_id})

    if not p: 
        return None

    ### 2. đổi format rồi gửi trả lại 
    p["id"] = str(p["_id"])
    del p["_id"]
    p["user_id"] = str(p["user_id"])

    return p





def db_get_actions_of_purpose(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ action của purpose: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy toàn bộ actions 
    actions = db.actions.find({"purpose_id": object_id})

    ### 2. đổi format thành list và đổi mốt số cái trong đó 
    result = []
    for a in actions: 
        a["id"] = str(a["_id"])
        del a["_id"]
        a["purose_id"] = str(a["purpose_id"])
        result.append(a)

    return result




def db_create_action(id: str, context: str): 
    print(f"{LOG_DATABASE} vào hàm tạo action của purpose: {id} với context: {context}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. tạo trong db 
    created_time = datetime.now()
    result = db.actions.insert_one({
        "purpose_id": object_id, 
        "context": context, 
        "status": "INCOMPLETE", 
        "created_at": created_time, 
        "updated_at": created_time
    })

    return str(result.inserted_id), created_time 






def db_get_action_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy action theo id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    
    ### 1. lấy từ db 
    action = db.actions.find_one({"_id": object_id})

    if not action: 
        return None

    action["id"] = str(action["_id"])
    del action["_id"]
    action["purpose_id"] = str(action["purpose_id"])


    return action 




def db_update_action(id: str, context: str, status: str): 
    print(f"{LOG_DATABASE} vào hàm cập nhập hành động có id: {id} có context: {context} và status: {status}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. cập nhập vào db
    updated_time = datetime.now()

    result = db.actions.update_one(
        {"_id": object_id},
        {"$set": {
            "context": context, 
            "status": status,
            "updated_at": updated_time 
        }}
    )

    return updated_time 




def db_delete_action(id: str): 
    print(f"{LOG_DATABASE} vào hàm xóa hành động có id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None
    
    ### 1. xóa trong db
    db.actions.delete_one({"_id": object_id})

    return True


















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException

class DomainError(Exception): 
    pass


def handle_get_actions_of_purpose_all(id: str, user_id):
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy toàn bộ action của purpose: {id} của user: {user_id}")

    """
    DOMAIN RULES: 
    1. purpose phải tồn tại 
    2. purpose phải thuộc cùng user 
    """ 

    ### 1. check rule 
    purpose = db_get_purpose_by_id(id)

    if not purpose: 
        raise DomainError("Purpose not found")
    
    if user_id != purpose["user_id"]: 
        raise DomainError("User does not have the right to this purpose")

    
    ### 2. lấy toàn bộ actions của một purpose 
    actions = db_get_actions_of_purpose(id)

    ### 3. đổi format sang phù hợp với api contract 
    result = []
    for a in actions: 
        result.append({
            "id": a["id"],
            "context": a["context"],
            "status": a["status"]
        })
    

    return {
        "actions": result
    }



def validate_action_context(context: str): 
    print(f"{LOG_DOMAIN}    1. validate action context: {context}")

    if not context: 
        return False 

    context_strip = context.strip()

    if len(context_strip) == 0: 
        return False

    return True



def handle_post_action(id: str, user_id: str, context: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng action mới của purpose: {id}, của user: {user_id} với context: {context}")

    """
    DOMAIN RULES: 
    1. purpose phải tồn tại 
    2. purpose phải thuộc user 
    3. context phải hợp lệ (không được trống)
    """

    ### 1. check rule
    purpose = db_get_purpose_by_id(id)

    if not purpose: 
        raise DomainError("Purpose not found")

    if user_id != purpose["user_id"]: 
        raise DomainError("User does not have the right to this purpose")

    if not validate_action_context(context): 
        raise DomainError("Invalid input context")

    

    ### 2. tạo action 
    action_id, created_time = db_create_action(id, context)


    ### 3. return theo format api contract 
    return {
        "id": action_id, 
        "createdAt": created_time
    }




def validate_action_status(status: str): 
    print(f"{LOG_DATABASE} vào validate action status: {status}")

    if status != "INCOMPLETE" and status != "COMPLETE": 
        return False 

    return True




def handle_put_action(purposeId: str, user_id: str, actionId: str, context: str, status: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập action của purpose: {purposeId}, của user: {user_id}, của action: {actionId} có context: {context} có status: {status}")


    """
    DOMAIN RULES: 
    1. purpose phải tồn tại 
    2. purpose phải thuộc cùng user 
    3. action phải tồn tại 
    4. action phải thuộc purpose đó 
    5. context phải hợp lệ (không được trống)
    6. status phải thuộc 1 trong hai giá trị: COMPLETE và INCOMPLETE
    """

    ### 1. check rules
    purpose = db_get_purpose_by_id(purposeId)

    if not purpose: 
        raise DomainError("Purpose not found")

    if user_id != purpose["user_id"]: 
        raise DomainError("User does not have the right to this purpose")

    action = db_get_action_by_id(actionId)

    if not action: 
        raise DomainError("Action not found")

    if purposeId != action["purpose_id"]: 
        raise DomainError("Action does not belong to purpose, hence can not be modified")
    
    if not validate_action_context(context): 
        raise DomainError("Invalid input context")

    if not validate_action_status(status): 
        raise DomainError("Invalid input status")

    
    ### 2. cập nhập 
    updated_time = db_update_action(actionId, context, status)


    ### 3. return theo format api contract 
    return {
        "updatedAt": updated_time
    }





def handle_delete_action(purposeId: str, user_id: str, actionId: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí xóa action: {actionId} của purpose: {purposeId}, của user: {user_id}")

    """
    DOMAIN RULES: 
    1. purpose phải tồn tại 
    2. purpose phải thuộc cùng user 
    3. action phải tồn tại 
    4. action phải thuộc purpose đó 
    """

    ### 1. check rules
    purpose = db_get_purpose_by_id(purposeId)

    if not purpose: 
        raise DomainError("Purpose not found")
    
    if user_id != purpose["user_id"]: 
        raise DomainError("User does not have the right to this purpose")
    
    action = db_get_action_by_id(actionId)

    if not action: 
        raise DomainError("Action not found")

    if purposeId != action["purpose_id"]: 
        raise DomainError("Action does not belong to purpose, hence can not be deleted")

    ### 2. xóa action 
    db_delete_action(actionId)


    ### 3. return theo format api contract 
    return {
        "message": "Delete successfully"
    }


















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter, Depends, Query
from app.dependencies.auth import require_login
from pydantic import BaseModel 



router = APIRouter()
class APIError(Exception): 
    pass 




@router.get("/purposes/{id}/actions")
def get_actions_all(id: str, current_user = Depends(require_login)):
    print(f"{LOG_API} vào get /purposes/{id}/actions")

    try: 
        return handle_get_actions_of_purpose_all(id, current_user["id"])


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







class PostActionReqeust(BaseModel):
    context: str



@router.post("/purposes/{id}/actions")
def post_action(request: PostActionReqeust, id: str, current_user = Depends(require_login)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào post /purposes/{id}/actions với request: {request_dict}")

    try: 
        context = request_dict["context"]
        return handle_post_action(id, current_user["id"], context)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






class PutActionRequest(BaseModel):
    context: str
    status: str



@router.put("/purposes/{purposeId}/actions/{actionId}")
def put_action(request: PutActionRequest, purposeId: str, actionId: str, current_user = Depends(require_login)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào put /purposes/{purposeId}/actions/{actionId}")

    try: 
        context = request_dict["context"]
        status = request_dict["status"]
        return handle_put_action(purposeId, current_user["id"], actionId, context, status)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")








@router.delete("/purposes/{purposeId}/actions/{actionId}")
def delete_action(purposeId: str, actionId: str, current_user = Depends(require_login)): 
    print(f"{LOG_API} vào delete /purposes/{purposeId}/actions/{actionId}")

    try: 
        return handle_delete_action(purposeId, current_user["id"], actionId)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
