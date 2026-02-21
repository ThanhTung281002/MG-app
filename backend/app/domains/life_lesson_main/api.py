





LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/life_lesson_main")





# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from bson import ObjectId
from app.core.database import db 
from datetime import datetime 



def db_get_life_lessons_main_all(): 
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ bài học chính")

    ### lấy toàn bộ bài học chính 
    life_lessons_main = db.life_lessons_main.find({})

    ### đổi sang format bằng result = []
    result = []
    for llm in life_lessons_main: 
        llm["id"] = str(llm["_id"])
        del llm["_id"]
        
        result.append(llm)

    
    return result 




def db_get_life_lesson_main_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy bài học theo id: {id}")

    ### 1. check id 
    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 2. lấy 
    life_lesson_main = db.life_lessons_main.find_one({"_id": object_id})

    if not life_lesson_main: 
        return None

    ### 3. đổi format 
    life_lesson_main["id"] = str(life_lesson_main["_id"])
    del life_lesson_main["_id"]


    ### 4. return 
    return life_lesson_main




def db_update_life_lesson_main(id: str, updating_content: str): 
    print(f"{LOG_DATABASE} vào hàm cập nhập nội dung bài học có id: {id} và nội dung cập nhập: {updating_content}")

    ### 1. kiểm tra id 
    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 4. cập nhập 
    updated_time = datetime.now()
    result = db.life_lessons_main.update_one(
        {"_id": object_id},
        {"$set": {
            "main_content": updating_content,
            "updated_at": updated_time
        }}
    )


    ### 5. trả kết quả 
    return updated_time















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException

class DomainError(Exception): 
    pass


def handle_get_life_lessons_main_all_basic(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy toàn bộ bài học chính cơ bản")

    """
    DOMAIN RULES: 
    NONE
    """

    ### lấy từ db
    life_lessons_main = db_get_life_lessons_main_all()

    ### chỉnh lại phù hợp với api contract rồi gửi trả lại theo format cho tầng api endpoints 
    result = []
    for llm in life_lessons_main: 
        result.append({
            "id": llm["id"],
            "title": llm["title"]
        })

    return {
        "life-lessons": result
    }






def handle_get_life_lesson_main(id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy bài học nội dung chính có id: {id}")

    """
    DOMAIN RULES: 
    1. bài học phải tồn tại
    """

    ### 1. lấy bài học 
    life_lesson_main = db_get_life_lesson_main_by_id(id)

    ### 2. nếu tồn tại thì gửi trả lại theo format trong api contract 
    if not life_lesson_main: 
        raise DomainError("Life lesson not found")    
    
    return {
        "id": life_lesson_main["id"],
        "title": life_lesson_main["title"],
        "mainContent": life_lesson_main["main_content"]
    }



def validate_main_content(main_content: str): 
    print(f"{LOG_DOMAIN}    1. check nội dung chính hợp lệ")

    main_content_strip = main_content.strip()

    if len(main_content_strip) < 10: 
        return False
    else: 
        return True





def handle_update_life_lesson_main_content(id: str, updating_content: str):
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập nội dung chính của bài học có id: {id} và nội dung chỉnh sửa là: {updating_content}")

    """
    DOMAIN RULES: 
    1. bài học phải tồn tại 
    2. Nội dung chỉnh sửa phải không được trống và có ít nhất 10 kí tự 
    """

    ### 1. lấy bài học từ cơ sở dữ liệu 
    life_lesson_main = db_get_life_lesson_main_by_id(id)

    ### 2. check tồn tại và check nội dung chỉnh sửa valid 
    if not life_lesson_main: 
        raise DomainError("Life lesson main not found")

    if not validate_main_content(updating_content): 
        raise DomainError("Input updating content is not valid")

    ### 3. nếu tồn tại thì cập nhập 
    updated_at = db_update_life_lesson_main(id, updating_content)


    ### 4. trả res theo api contract 
    return {
        "updatedAt": updated_at
    }













# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import Depends, APIRouter, Query
from pydantic import BaseModel 
from app.dependencies.auth import require_admin 


router = APIRouter()

class APIError(Exception):
    pass




@router.get("/life-lessons-main")
def get_life_lessons_main_all(view: str = Query(default="basic"), current_user = Depends(require_admin)):
    print(f"{LOG_API} vào get /life-lessons-main?view={view}")

    try: 
        if view == "basic":
            return handle_get_life_lessons_main_all_basic()
        else: 
            raise APIError("Invalid view type")

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")





@router.get("/life-lessons-main/{id}")
def get_life_lesson_main(id: str, current_user = Depends(require_admin)): 
    print(f"{LOG_API} vào get /life-lessons-main/{id}")

    try: 
        return handle_get_life_lesson_main(id)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")





class putRequest(BaseModel): 
    mainContent: str




@router.put("/life-lessons-main/{id}")
def put_life_lesson_main(request: putRequest, id: str, current_user = Depends(require_admin)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào put /life-lessons-main/{id} với request: {request_dict}")

    try: 
        return handle_update_life_lesson_main_content(id, request_dict["mainContent"])

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    