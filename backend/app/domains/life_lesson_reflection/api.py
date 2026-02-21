





LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/life_lesson_reflection")




# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from app.core.database import db 
from bson import ObjectId
from datetime import datetime



def db_get_life_lessons_reflection_all():
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ bài học")

    ### 1. lấy toàn bộ life lesson từ trong collection life-lessons
    life_lessons_reflection = db.life_lessons_reflection.find({})


    ### 2. Đổi key id cho phù hợp với contract 
    result = []
    for llr in life_lessons_reflection: 
        llr["id"] = str(llr["_id"])
        del llr["_id"]
        llr["user_id"] = str(llr["user_id"])
        llr["life_lesson_id"] = str(llr["life_lesson_id"])
        result.append(llr)

    return result


def db_get_life_lesson_main_by_id(id: str): 
    print(f"{LOG_DATABASE} lấy life lessons main by id: {id}")

    ### 1. kiểm tra id
    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 2. lấy llm 
    life_lesson_main = db.life_lessons_main.find_one({"_id": object_id})

    if not life_lesson_main: 
        return None

    life_lesson_main["id"] = str(life_lesson_main["_id"])
    del life_lesson_main["_id"]

    return life_lesson_main





def db_get_life_lessons_reflection_all_by_user_id(user_id: str):
    print(f"{LOG_DATABASE} vào hàm lấy suy ngẫm cá nhân của user có id: {user_id}")

    ### 1. kiểm tra format của user_id
    try: 
        object_id = ObjectId(user_id)
    except: 
        return None

    ### lấy từ db thôi, sửa lại và chuyển sang list dict 
    life_lessons_reflection = db.life_lessons_reflection.find({"user_id": object_id})
    result = []

    for llr in life_lessons_reflection: 
        llr["id"] = str(llr["_id"])
        del llr["_id"]
        llr["user_id"] = str(llr["user_id"])
        llr["life_lesson_id"] = str(llr["life_lesson_id"])        
        result.append(llr)

    return result






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





def db_update_life_lesson_reflection(id: str, updating_reflection: str): 
    print(f"{LOG_DATABASE} cập nhập bài học có id: {id} với nội dung mới: {updating_reflection}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    updated_time = datetime.now()
    result = db.life_lessons_reflection.update_one(
        {"_id": object_id}, 
        {"$set": {
            "reflection": updating_reflection,
            "updated_at": updated_time
        }}
    )

    return updated_time

















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException

class DomainError(Exception):
    pass



def handle_get_life_lessons_reflection_all_basic(user_id: str):
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy toàn bộ bài học reflection cơ bản của user: {user_id}")
    """
    DOMAIN RULES:
    NONE
    """

    ### 1. lấy toàn bộ bài học cuộc sống từ database 
    life_lessons_reflection = db_get_life_lessons_reflection_all_by_user_id(user_id)

    ### 2. chỉ lấy danh sách mà ở mức cơ bản như id và title thôi 
    result = []
    for llr in life_lessons_reflection:
        main = db_get_life_lesson_main_by_id(llr["life_lesson_id"])
        result.append({
            "id": llr["id"],
            "title": main["title"]
        })

    ### 3. return lại
    return {
        "life-lessons": result
    }











def sort_life_lessons_by_updated_time(life_lessons: list):
    print(f"{LOG_DOMAIN}    1. vào hàm sort life lessons theo updated_at")

    return sorted(
        life_lessons,
        key=lambda ll: ll["updated_at"],
        reverse=True
    )

# hiện tại thì sẽ lấy  N bài học mà updated gần nhất. Thực thi bằng cách sắp xếp theo thứ tự updated gần nhất đến xa nhất và lấy n cái đầu tiên 
### note: ở các phiên bản sau sẽ là vào đọc gần nhất. 
### bài học đối với người dùng thì có 2 phần là main và reflection, trong đó cái người dùng sở hữu là reflection là cái mà sẽ thao tác logic còn main chỉ là phần thêm vào để sử dụng bởi tầng api endpoints thôi 
N = 3
def handle_get_life_lessons_reflection_reflection(user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get life lessons reflection của user có id: {user_id}")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy toàn bộ bài học 
    life_lessons_reflection = db_get_life_lessons_reflection_all_by_user_id(user_id)



    ### 2. sắp xếp theo thứ tự updated at gần nhất tới xa nhất 
    life_lessons_reflection_sorted = sort_life_lessons_by_updated_time(life_lessons_reflection)


    ### 2.5 tạo loại dữ liệu mà có thể gửi cho tầng api endpoints theo api contract 
    life_lessons = []
    for ll in life_lessons_reflection_sorted: 
        life_lesson_main = db_get_life_lesson_main_by_id(ll["life_lesson_id"])
        life_lessons.append({
            "id": ll["id"],
            "title": life_lesson_main["title"],
            "main_content": life_lesson_main["main_content"],
            "reflection": ll["reflection"],
        })

    ### 3. return lại n cái gần nhất 
    return {
        "life-lessons": life_lessons[:N]
    }




# TỚI LOGIC NGHIỆP VỤ CHÍNH CỦA TỪNG HÀM 
def handle_get_life_lesson_basic(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy bài học cơ bản có id: {id} của người dùng với id: {user_id}")

    """
    DOMAIN RULES: 
    1. id phải có
    2. user phải có quyền với llr này 
    """

    ### 1. lấy reflection có id trên 
    life_lesson_reflection = db_get_life_lesson_reflection_by_id(id)

    if not life_lesson_reflection: 
        raise DomainError("Life lesson reflection not found")

    if user_id != life_lesson_reflection["user_id"]: 
        raise DomainError("User does not have the right to this life lesson reflection")

    ### 2. lấy main của reflection đó trả kết quả 
    life_lesson_main = db_get_life_lesson_main_by_id(life_lesson_reflection["life_lesson_id"])

    return {
        "id": life_lesson_reflection["id"],
        "title": life_lesson_main["title"]
    }



def handle_get_life_lesson_full(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy bài học đầy đủ có id: {id} của người dùng với id: {user_id}")

    """
    DOMAIN RULES: 
    1. id phải có
    2. user phải có quyền đối với llr này 
    """

    ### 1. lấy reflection có id trên 
    life_lesson_reflection = db_get_life_lesson_reflection_by_id(id)

    if not life_lesson_reflection: 
        raise DomainError("Life lesson reflection not found")

    if user_id != life_lesson_reflection["user_id"]: 
        raise DomainError("User does not have the right to this life lesson reflection")

    ### 2. lấy main của reflection đó trả kết quả 
    life_lesson_main = db_get_life_lesson_main_by_id(life_lesson_reflection["life_lesson_id"])

    return {
        "id": life_lesson_reflection["id"],
        "title": life_lesson_main["title"],
        "main-content": life_lesson_main["main_content"],
        "reflection": life_lesson_reflection["reflection"]
    }







def handle_put_life_lesson(id: str, user_id: str, updating_reflection: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí cho put life lesson với id: {id} và user có id: {user_id} và nội dung suy ngẫm mới: {updating_reflection}")

    """
    DOMAIN RULES: 
    1. ll phải tồn tại 
    2. phải cùng một user thì mới có quyền sửa 
    """

    life_lesson_reflection = db_get_life_lesson_reflection_by_id(id)

    if not life_lesson_reflection: 
        raise DomainError("Life lesson reflection not found")

    if user_id != life_lesson_reflection["user_id"]: 
        raise DomainError("User does not have right to this life lesson reflection")

    
    ### 1. cập nhập trong database thôi
    updated_time = db_update_life_lesson_reflection(id, updating_reflection)


    return {
        "updatedAt": updated_time
    }
    




























# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter
from fastapi import Query, Depends
from app.dependencies.auth import require_login, require_admin 
from pydantic import BaseModel

router = APIRouter()

class APIError(Exception):
    pass



@router.get("/life-lessons-reflection")
def get_life_lessons_reflection_all(view: str = Query(default="basic"), current_user = Depends(require_login)):
    print(f"{LOG_API} vào get /life-lessons-reflection?view={view}")

    try: 
        if view == "basic":
            return handle_get_life_lessons_reflection_all_basic(current_user["id"])
        else:
            raise APIError("Invalid view type")
    

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")









@router.get("/life-lessons-reflection/reflection")
def get_life_lessons_reflection(current_user = Depends(require_login)):
    print(f"{LOG_API} vào api get /life-lessons-reflection/reflection")

    try: 
        return handle_get_life_lessons_reflection_reflection(current_user["id"])

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")









@router.get("/life-lessons-reflection/{id}")
def get_life_lesson(id: str, view : str = Query(default="full"), current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /life-lessons-reflection/{id}?view={view}")

    try: 
        if view == "basic": 
            return handle_get_life_lesson_basic(id, current_user["id"])
        elif view == "full": 
            return handle_get_life_lesson_full(id, current_user["id"])
        else: 
            raise APIError("Invalid view type")


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







class updateRefectionRequest(BaseModel): 
    reflection: str


@router.put("/life-lessons-reflection/{id}")
def put_life_lesson(request: updateRefectionRequest, id: str, current_user = Depends(require_login)): 
    user_id = current_user["id"]
    print(f"{LOG_API} vào api put /life-lessons-reflection/{id} user có id: {user_id} với request: {request.dict()}")

    try: 
        request_dict = request.dict()
        updating_reflection = request_dict["reflection"]
        return handle_put_life_lesson(id, current_user["id"], updating_reflection)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
