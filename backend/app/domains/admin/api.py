LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/admin")


# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from bson import ObjectId
from bson.errors import InvalidId
from app.core.database import db 
from datetime import datetime 



def db_get_users_by_status(status: str): 
    print(f"{LOG_DATABASE} vào hàm db lấy user theo status: {status}")

    users = db.users.find({"status": status})

    ### 1. đổi format và sang list 
    result = []
    for u in users: 
        u["id"] = str(u["_id"])
        del u["_id"]
        result.append(u)


    return result






def db_get_user_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy user có id: {id}")

    try: 
        object_id = ObjectId(id)
    except InvalidId: 
        return None

    result = db.users.find_one({"_id": object_id})

    if not result: 
        return None

    result["id"] = str(result["_id"])
    del result["_id"]

    return result






def db_update_status_of_user(id: str, status: str, updated_time: datetime): 
    print(f"{LOG_DATABASE} vào hàm cập nhập trạng thái: {status} của user: {id} lúc {updated_time}")

    try: 
        object_id = ObjectId(id)
    except: 
        return 0, 0

    result = db.users.update_one(
        {"_id": object_id},
        {"$set": {
            "status": status, 
            "updated_at": updated_time 
        }}
    )


    return result.matched_count, result.modified_count




















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException



class DomainError(Exception): 
    pass



def handle_get_pending_users(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy pending users")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy pending users thôi 
    pending_users = db_get_users_by_status("PENDING")

    ### 2. Chỉnh lại format rồi gửi trả lại theo api contract 
    result = []
    for pu in pending_users: 
        result.append({
            "id": pu["id"], 
            "fullname": pu["fullname"], 
            "email": pu["email"]
        })

    return {
        "pending-users": result 
    }







def handle_approve_user(id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí duyệt user: {id}")

    """
    DOMAIN RULES: 
    1. user phải tồn tại 
    """

    ### 1. check rules
    user = db_get_user_by_id(id)

    if not user: 
        raise DomainError("User not found")

    ### 2. cập nhập status của user trong db 
    updated_time = datetime.now()
    matched_count, modified_count = db_update_status_of_user(id, "APPROVED", updated_time)

    if matched_count == 0: 
        raise DomainError("Failed to approve user")
    else: 
        return {
            "updatedAt": updated_time
        }







def handle_reject_user(id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí từ chối user: {id}")

    """
    DOMAIN RULES: 
    1. user phải tồn tại 
    """

    ### 1. check rules
    user = db_get_user_by_id(id)

    if not user: 
        raise DomainError("User not found")

    ### 2. cập nhập status của user trong db 
    updated_time = datetime.now()
    matched_count, modified_count = db_update_status_of_user(id, "REJECTED", updated_time)

    if matched_count == 0: 
        raise DomainError("Failed to approve user")
    else: 
        return {
            "updatedAt": updated_time
        }

















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter, Depends
from app.dependencies.auth import require_admin
from pydantic import BaseModel


router = APIRouter()



@router.get("/admin/pending-users")
def get_pending_users(current_user = Depends(require_admin)): 
    print(f"{LOG_API} vào get /admin/pending-users")

    try: 
        return handle_get_pending_users()

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






@router.put("/admin/pending-users/{id}/approve")
def approve_user(id: str, current_user = Depends(require_admin)):
    print(f"{LOG_API} vào /admin/pending-users/{id}/approve")

    try: 
        return handle_approve_user(id)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






@router.put("/admin/pending-users/{id}/reject")
def reject_user(id: str, current_user = Depends(require_admin)): 
    print(f"{LOG_API} vào put /admin/pending-users/{id}/reject")

    try: 
        return handle_reject_user(id)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")



