





LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/life_lesson")




# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from app.core.database import db 



def db_get_life_lessons_all():
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ bài học")

    ### 1. lấy toàn bộ life lesson từ trong collection life-lessons
    life_lessons = db.life_lessons.find({})


    ### 2. Đổi key id cho phù hợp với contract 
    result = []
    for ll in life_lessons: 
        ll["id"] = str(ll["_id"])
        del ll["_id"]
        result.append(ll)

    return result
























# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException

class DomainError(Exception):
    pass



def handle_get_life_lessons_all_basic():
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy toàn bộ bài học cơ bản")
    """
    DOMAIN RULES:
    NONE
    """

    ### 1. lấy toàn bộ bài học cuộc sống từ database 
    life_lessons = db_get_life_lessons_all()

    ### 2. chỉ lấy danh sách mà ở mức cơ bản như id và title thôi 
    result = []
    for life_lesson in life_lessons:
        result.append({
            "id": life_lesson["id"],
            "title": life_lesson["title"]
        })

    ### 3. return lại
    return {
        "life-lessons": result
    }









# 
# hiện tại thì sẽ lấy  N bài học mà updated gần nhất. Thực thi bằng cách sắp xếp theo thứ tự updated gần nhất đến xa nhất và lấy n cái đầu tiên 
### note: ở các phiên bản sau sẽ là vào đọc gần nhất. 
### bài học thì gồm 2 phần: main và reflections. Mình nghĩ là lấy 2 cái trong db rồi ghép lại để gửi cho api endpoints nếu cần 
### nhìn từ góc độ người dùng thì bài giảng chính là phần reflection nhưng có thêm phần main content từ life-lessons-main 
N = 3
def handle_get_life_lessons_reflection(user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get life lessons reflection của user có id: {user_id}")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy toàn bộ bài học 
    life_lessons = []
    life_lessons_reflection = db_get_life_lessons_reflection_all_by_user_id(user_id)

    for ll in life_lessons_reflection: 
        life_lesson_main = db_get_life_lesson_main_by_id(ll["life_lesson_id"])
        life_lessons.append({
            "id": ll["id"],
            "title": life_lesson_main["title"],
            "main_content": life_lesson_main["main_content"],
            "reflection": ll["reflection"],
            "updated_at": ll["updated_at"]
        })



    ### 2. sắp xếp theo thứ tự updated at gần nhất tới xa nhất 
    life_lessons_sorted = sort_life_lessons_by_updated_time(life_lessons)


    ### 3. return lại n cái gần nhất 
    return {
        "life-lessons": life_lessons_sorted[:N]
    }








def handle_get_life_lesson_basic(id): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get life lesson basic với id: {id}")

    """
    DOMAIN RULES:
    1. LIFE LESSON PHẢI CÓ TRONG CƠ SỞ DỮ LIỆU 
    """

    life_lesson = db_get_life_lesson_main()













# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import APIRouter
from fastapi import Query, Depends
from app.dependencies.auth import require_login, require_admin 
from pydantic import BaseModel

router = APIRouter()

class APIError(Exception):
    pass



@router.get("/life-lessons")
def get_life_lessons_all(view: str = Query(default="basic"), current_user = Depends(require_login)):
    print(f"{LOG_API} vào get /life-lessons?view={view}")

    try: 
        if view == "basic":
            return handle_get_life_lessons_all_basic()
        else:
            raise APIError("Invalid view type")
    

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")





@router.get("/life-lessons/reflection")
def get_life_lessons_reflection():
    print(f"{LOG_API} vào api get /life-lessons/reflection")

    try: 
        return handle_get_life_lessons_reflection()

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception: 
        raise HTTPException(status_code=500, detail="Internal server error")







# @router.get("/life-lessons/{id}")
# def get_life_lesson(id: str, view : str = Query(default="full")):
#     print(f"{LOG_API} vào get /life-lessons/{id}?view={view}")

#     try: 
#         if view == "basic": 
#             return handle_get_life_lesson_basic(id)
#         elif view == "mainContent":
#             return handle_get_life_lesson_main_content(id)
#         elif view == "full": 
#             return handle_get_life_lesson_full(id)
#         else: 
#             raise APIError("invalid view type")


#     except APIError as e: 
#         raise HTTPException(status_code=400, detail=str(e))

#     except DomainError as e: 
#         raise HTTPException(status_code=400, detail=str(e))
  
#     except Exception: 
#         raise HTTPException(status_code=500, detail="Internal server error")




# @router.put("/life-lessons/{id}")
# def put_life_lesson(id: str, view : str = Query(default="reflection")):
#     print(f"{LOG_API} vào put /life-lessons/{id}?view={view}")

#     try: 
#         if view == "mainContent": 
#             return handle_put_life_lesson_main_content(id)
#         elif view == "reflection": 
#             return handle_put_life_lesson_reflection(id)
#         else: 
#             raise APIError("Invalid view type")

#     except APIError as e: 
#         raise HTTPException(status_code=400, detail=str(e))

#     except DomainError as e: 
#         raise HTTPException(status_code=400, detail=str(e))
  
#     except Exception: 
#         raise HTTPException(status_code=500, detail="Internal server error")





