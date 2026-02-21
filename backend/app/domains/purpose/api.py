





LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/purpose")





# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from bson import ObjectId
from datetime import datetime 
from app.core.database import db 


def db_get_purposes_all(user_id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ mục đích của user: {user_id}")

    try: 
        object_user_id = ObjectId(user_id)
    except: 
        return None

    ### 1. lấy từ db 
    purposes = db.purposes.find({"user_id": object_user_id})


    ### 2. đổi format sang list và thành phần trong nó từ ObjectId sang string
    result = []
    for p in purposes: 
        p["id"] = str(p["_id"])
        del p["_id"]
        p["user_id"] = str(p["user_id"])
        result.append(p)

    ### 3. return 
    return result







def db_get_teaching_word_by_id(id): 
    print(f"{LOG_DATABASE} lấy lời dạy mà có id: {id}")
    ### 1. Tìm lời dạy có id như id nhập vào, và nếu có thì trả chính lời dạy đó
    ## 1.1 kiểm tra xem id có hợp format với ObjectId hay không? 
    try: 
        object_id = ObjectId(id)
    except: 
        # id không đúng format ObjectId
        return None

    ## 1.2 lấy lời dạy đó 
    teaching_word = db.teaching_words.find_one({"_id": object_id})

    ## 1.3 đổi format của _id thành id cho đúng api contract
    if teaching_word: 
        teaching_word["id"] = str(teaching_word["_id"])
        del teaching_word["_id"]

        return teaching_word

    ### 2. nếu không tìm thấy thì trả None 
    return None





def db_get_life_lesson_reflection_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy bài học bằng id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy từ db thôi 
    llr = db.life_lessons_reflection.find_one({"_id": object_id})
    if not llr: 
        return None

    llr["id"] = str(llr["_id"])
    del llr["_id"]
    llr["user_id"] = str(llr["user_id"])
    llr["life_lesson_id"] = str(llr["life_lesson_id"])    

    return llr





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




def db_get_note_by_id(id: str): 
    print(f"{LOG_DATABASE} vào lấy note có id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy purpose từ db 
    n = db.notes.find_one({"_id": object_id})

    if not n: 
        return None

    ### 2. đổi format rồi gửi trả lại 
    n["id"] = str(n["_id"])
    del p["_id"]
    n["user_id"] = str(n["user_id"])

    return n






def db_create_purpose(user_id: str, title: str, hope: str): 
    print(f"{LOG_DATABASE} vào tạo mục đích cho user: {user_id} với tiêu đề: {title} và hy vọng: {hope}")

    try: 
        object_user_id = ObjectId(user_id)
    except: 
        return None

    ### 1. tạo trong db thôi 
    created_time = datetime.now()
    result = db.purposes.insert_one({
        "user_id": object_user_id,
        "title": title, 
        "hope": hope, 
        "status": "ACTIVE", 
        "created_at": created_time, 
        "updated_at": created_time
    })

    return str(result.inserted_id), created_time 






def db_create_relation(user_id: str, from_type: str, from_id: str, to_type: str, to_id: str):
    print(f"{LOG_DATABASE} vào hàm tạo mối liên kết của user: {user_id} của bối cảnh: {from_id} ({from_type}) tới vật sinh ra: {to_id} ({to_type})")

    try: 
        object_user_id = ObjectId(user_id)
        object_from_id = ObjectId(from_id)
        object_to_id = ObjectId(to_id)
    except: 
        return None

    ### 1. tạo mối liên kết 
    created_time = datetime.now()

    result = db.relations.insert_one({
        "user_id": object_user_id, 
        "from_type": from_type, 
        "from_id": object_from_id, 
        "to_type": to_type,
        "to_id": object_to_id,
        "created_at": created_time
    })


    return str(result.inserted_id), created_time




def db_update_purpose(id: str, updating_title: str, updating_hope: str, updating_status: str): 
    print(f"{LOG_DATABASE} vào hàm cập nhập mục đích có id: {id}, với tiêu đề: {updating_title}, hope: {updating_hope}, status: {updating_status}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. cập nhập rồi trả lại thông tin 
    updated_time = datetime.now()
    result = db.purposes.update_one(
        {"_id": object_id},
        {"$set": {
            "title": updating_title, 
            "hope": updating_hope, 
            "status": updating_status,
            "updated_at": updated_time
        }}
    )

    return updated_time





















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException


class DomainError(Exception): 
    pass

def handle_get_purposes_all(user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy tất cả mục đích của user có id: {user_id}")

    """
    DOMAIN RULES: 
    NONE 
    """

    ### 1. lấy toàn bộ mục đích 
    purposes = db_get_purposes_all(user_id)

    ### 2. chỉnh lại format phù hợp với bên api contract 
    result = []
    for p in purposes: 
        result.append({
            "id": p["id"],
            "title": p["title"],
            "hope": p["hope"],
            "status": p["status"]
        })
    
    ### 3. return 
    return {
        "purposes": result
    }



# VIỆC CẦN LÀM Ở ĐÂY: LÀ TẠO PURPOSE VÀ TẠO RELATION (from là origin context)
def handle_post_purpose_free(user_id: str, origin_context_type: str, origin_context_id: str, title: str, hope: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng mục đích tự do của user: {user_id} gắn tới bối cảnh là: {origin_context_type} có id: {origin_context_id} cho mục đích: {title} với hy vọng: {hope}")

    """
    DOMAIN RULES: 
    1. origin_context_type phải là một trong 4 loại như "TEACHING_WORD", "LIFE_LESSON", "PURPOSE", "NOTE"
    2. id của bất cứ loại nào thì phải tồn tại trong database 
    2. title và hope có thể trống, không có yêu cầu gì cả. 
    """

    ### 1. check origin context type 
    ### 1.1 check exist of origin object 
    if origin_context_type == "TEACHING_WORD": 
        tw = db_get_teaching_word_by_id(origin_context_id)

        if not tw: 
            raise DomainError("Teaching Word not found")

    elif origin_context_type == "LIFE_LESSON": 
        ll = db_get_life_lesson_reflection_by_id(origin_context_id)

        if not ll: 
            raise DomainError("Life Lesson not found")

    elif origin_context_type == "PURPOSE": 
        p = db_get_purpose_by_id(origin_context_id)

        if not p: 
            raise DomainError("Purpose not found")

    elif origin_context_type == "NOTE": 
        n = db_get_note_by_id(origin_context_id)
        
        if not n: 
            raise DomainError("Note not found")

    else: 
        raise DomainError("Invalid origin context type")


    ### 2. tạo purpose 
    purpose_id, created_time = db_create_purpose(user_id, title, hope)


    ### 3. gắn relation
    db_create_relation(user_id, origin_context_type, origin_context_id, "PURPOSE", purpose_id)


    ### 4. return theo api contract 
    return {
        "id": purpose_id,
        "createdAt": created_time
    }




def handle_get_purpose_basic(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy mục đích cơ bản có id: {id} của user: {user_id}")

    """
    DOMAIN RULES: 
    1. mục đích phải tồn tại 
    2. mục đích phải thuộc về user 
    """

    ### check rules 
    p = db_get_purpose_by_id(id)

    if not p: 
        raise DomainError("Purpose not found")
    
    if p["user_id"] != user_id: 
        raise DomainError("User does not have the right to this purpose")


    ### 1. trả lại theo format của api contract 
    return {
        "id": p["id"],
        "title": p["title"]
    }




def handle_get_purpose_full(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy mục đích đầy đủ có id: {id} của user: {user_id}")

    """
    DOMAIN RULES: 
    1. mục đích phải tồn tại 
    2. mục đích phải thuộc về user 
    """

    ### check rules 
    p = db_get_purpose_by_id(id)

    if not p: 
        raise DomainError("Purpose not found")
    
    if p["user_id"] != user_id: 
        raise DomainError("User does not have the right to this purpose")


    ### 1. trả lại theo format của api contract 
    return {
        "id": p["id"],
        "title": p["title"],
        "hope": p["hope"],
        "status": p["status"]
    }




def handle_put_purpose(id: str, user_id: str, updating_title: str, updating_hope: str, updating_status: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập mục đích: {id} của user: {user_id} với title mới: {updating_title}, hy vọng mới: {updating_hope} và status mới: {updating_status}")

    """
    DOMAIN RULES: 
    1. purpose phải tồn tại 
    2. purpose phải thuộc chính user nhập vào 
    3. updating_status phải có giá trị "ACTIVE" hoặc "ARCHIVED" không có cái khác 
    """

    ### check rules
    p = db_get_purpose_by_id(id)

    if not p: 
        raise DomainError("Purpose not found")
    
    if user_id != p["user_id"]: 
        raise DomainError("User does not have the right to this purpose")

    if updating_status != "ACTIVE" and updating_status != "ARCHIVED": 
        raise DomainError("Invalid status value")

    
    ### 1. Cập nhập purpose vào db
    updated_time = db_update_purpose(id, updating_title, updating_hope, updating_status)


    ### 2. return theo api contract 
    return {
        "updatedAt": updated_time 
    }

















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter, Depends, Query
from app.dependencies.auth import require_login 
from pydantic import BaseModel


router = APIRouter()

class APIError(Exception): 
    pass






@router.get("/purposes")
def get_purposes_all(current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /purposes")

    try: 
        return handle_get_purposes_all(current_user["id"])
    
    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")








class originContextRequest(BaseModel): 
    type: str
    id: str

class postPurposeFreeRequest(BaseModel): 
    originContext: originContextRequest
    title: str
    hope: str


@router.post("/purposes/free-write")
def post_purpose_free_write(request: postPurposeFreeRequest, current_user = Depends(require_login)):
    request_dict = request.dict()
    print(f"{LOG_API} vào post /purposes/free-write có request: {request_dict}")

    try: 
        origin_context_type = request_dict["originContext"]["type"]
        origin_context_id = request_dict["originContext"]["id"]
        title = request_dict["title"]
        hope = request_dict["hope"]

        return handle_post_purpose_free(current_user["id"], origin_context_type, origin_context_id, title, hope)


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







@router.get("/purposes/{id}")
def get_purpose(id: str, view = Query(default="full"), current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /purposes/{id}?view={view}")

    try: 
        if view == "basic": 
            return handle_get_purpose_basic(id, current_user["id"])
        elif view == "full": 
            return handle_get_purpose_full(id, current_user["id"])
        else: 
            raise APIError("Invalid view type")

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")




class putPurposeRequest(BaseModel): 
    title: str
    hope: str
    status: str



@router.put("/purposes/{id}")
def put_purpose(request: putPurposeRequest, id: str, current_user = Depends(require_login)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào put /purposes/{id} với request: {request_dict}")

    try: 
        updating_title = request_dict["title"]
        updating_hope = request_dict["hope"]
        updating_status = request_dict["status"]
        return handle_put_purpose(id, current_user["id"], updating_title, updating_hope, updating_status)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






