from datetime import datetime 
from fastapi import APIRouter, HTTPException, Depends 
from fastapi import Query
from pydantic import BaseModel
from app.core.database import db
from bson import ObjectId
from app.dependencies.auth import require_admin, require_login



LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("Vào domain/educational-teaching-words/api.py")

router = APIRouter()


# =================== 0. MOCK DATA =====================
TEACHING_WORDS = [
    {
        "id": "1",
        "title": "Ai là người tháo gỡ nghi vấn?",
        "content": """
        Các con hãy thu nhỏ mà nhìn.
        Giống như việc xây nhà mới mà ông đã xây nhà to và sống cả đời ở đó. 
        Con cái phải di chuyển ra khỏi chỗ cũ và tới chỗ mới mà xây nhà. 
        """,
        "year": 2026,
        "week": 6, 
        "weekday": 1, 
        "created_at": datetime(2026, 2, 1),
        "updated_at": datetime.now()
    },
    {
        "id": "2",
        "title": "Người không hành động là người chết",
        "content": """
        Phải sử dụng thì mới phát triển. Tạo ra những vật thần bí. 
        Đừng chơi nữa mà hãy tìm kiếm HA. 
        """,
        "year": 2026,
        "week": 4, 
        "weekday": 4, 
        "created_at": datetime(2026, 1, 21),
        "updated_at": datetime.now()
    },
    {
        "id": "3",
        "title": "Yoksa PH của KAMI, hãy ino",
        "content": """Khi thời đại mới đến, nhiều người bắt đầu yoksa của riêng bản thân mình. Giống như việc gieo hạt khi mùa xuân đến vậy. Ngay cả lúc R bắt đầu yoksa PH, hàng chục giáo phái đã nói rằng họ sẽ làm yoksa mới. Phần lớn đã biến mất ngay trong đương thời và bây giờ hầu như không còn nữa.""",
        "year": 2026,
        "week": 6, 
        "weekday": 4, 
        "created_at": datetime(2026, 2, 4),
        "updated_at": datetime.now()
    }
]


























# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
import uuid



def db_get_educational_teaching_words_all(): 
    print(f"{LOG_DATABASE} lấy tất cả educational teaching words")

    # 1. lấy toàn bộ teaching_words 
    educational_teaching_words = db.educational_teaching_words.find({})

    # 2. đổi key _id thành id cho phù hợp với contract 
    result = []
    for educational_teaching_word in educational_teaching_words: 
        educational_teaching_word["id"] = str(educational_teaching_word["_id"])
        del educational_teaching_word["_id"]
        result.append(educational_teaching_word)

    # 3. return list teaching words
    return result 





def db_get_educational_teaching_word(id): 
    print(f"{LOG_DATABASE} lấy MG giáo dục mà có id: {id}")


    ### 1. Tìm lời dạy có id như id nhập vào, và nếu có thì trả chính lời dạy đó
    ## 1.1 kiểm tra xem id có hợp format với ObjectId hay không? 
    try: 
        object_id = ObjectId(id)
    except: 
        # id không đúng format ObjectId
        return None

    ## 1.2 lấy lời dạy đó 
    educational_teaching_word = db.educational_teaching_words.find_one({"_id": object_id})

    ## 1.3 đổi format của _id thành id cho đúng api contract
    if educational_teaching_word: 
        educational_teaching_word["id"] = str(educational_teaching_word["_id"])
        del educational_teaching_word["_id"]

        return educational_teaching_word

    ### 2. nếu không tìm thấy thì trả None 
    return None





def db_create_educational_teaching_word(title, content): 
    print(f"{LOG_DATABASE} tạo MG giáo dục mới với title: {title}, content: {content}")


    ### 1. tạo thời gian tạo 
    created_time = datetime.now()


    ### 2. thêm vào collection 
    result = db.educational_teaching_words.insert_one({
        "title": title,
        "content": content, 
        "created_at": created_time, 
        "updated_at": created_time
    })



    return str(result.inserted_id), created_time






# cập nhập nội dung lời dạy có id = id
def db_update_educational_teaching_word(id, title, content): 
    print(f"{LOG_DATABASE} cập nhập MG giáo dục có id: {id} với nội dung mới là: {title}, content: {content}")


    # 1. kiểm tra xem id có hợp lệ hay không?
    try: 
        obj_id = ObjectId(id)
    except: 
        return False


    # 2. sửa lại trong database teaching word theo tham số của hàm 
    updated_time = datetime.now()
    result = db.educational_teaching_words.update_one(
        {"_id": obj_id},
        {"$set": {
            "title": title,
            "content": content, 
            "updated_at": updated_time
        }}
    )


    return updated_time





















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
class DomainError(Exception):
    pass



def handle_get_educational_teaching_word(id): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy MG giáo dục có id: {id}")

    """
    DOMAIN RULES: 
    1. MG phải có id trong db
    """ 

    # 1. lấy MG có id là id 
    edu_tw = db_get_educational_teaching_word(id)

    if not edu_tw:
        raise DomainError("Educational teaching word not found")


    # 2. trả kết quả theo yêu cầu 
    return {
        "id": edu_tw["id"], 
        "title": edu_tw["title"], 
        "content": edu_tw["content"], 
        "updatedAt": edu_tw["updated_at"]
    }






def handle_get_educational_teaching_words_all_basic(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy tất cả MG giáo dục mức basic")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy tất cả lời dạy từ db 
    edu_tws = db_get_educational_teaching_words_all()
    
    ### 2. tạo một list các object mới mà chỉ có các field mới theo như response (id, display code (đã có hàm tạo displayCode từ một teaching_word object) và title thôi)
    edu_teaching_words = []

    for edu_tw in edu_tws: 
        edu_teaching_words.append({
            "id": edu_tw["id"]
        })


    ### 3. return kết quả
    return {
        "educationalTeachingWords": edu_teaching_words
    }








def tw_validate_title(title: str) -> bool:
    if title is None:
        return False
    
    # Trim and ensure at least 3 characters remain
    return len(title.strip()) >= 3


def tw_validate_content(content: str) -> bool:
    if content is None:
        return False
    
    # Trim and ensure at least 50 characters remain
    return len(content.strip()) >= 50



def handle_post_educational_teaching_words(title, content): 
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng MG giáo dục mới với title: {title}, content: {content}")

    """
    DOMAIN RULES: 
    1. lời dạy phải có tiêu đề ít nhất 3 kí tự hợp lệ 
    2. lời dạy phải nội dung ít nhất 50 kí tự hợp lệ 
    """

    ### rules 
    if not tw_validate_title(title):
        raise DomainError("Title must have at least 3 valid characters")

    if not tw_validate_content(content):
        raise DomainError("Content must have at least 50 valid characters")



    ### 2. tạo mới trong database
    id, created_at = db_create_educational_teaching_word(title, content)

    return {
        "id": id, 
        "createdAt": created_at
    }







def handle_put_educational_teaching_words(id, title, content):
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập MG giáo dục có id: {id}, title: {title}, content: {content}")

    """
    DOMAIN RULES: 
    1. Lời dạy phải có trong cơ sở dữ liệu 
    2. lời dạy phải có tiêu đề có ít nhất 3 kí tự hợp lệ 
    3. lời dạy phải có nội dung có ít nhất 50 kí tự hợp lệ 
    """


    ### rules
    if not db_get_educational_teaching_word(id): 
        raise DomainError("Teaching word not found")

    if not tw_validate_title(title):
        raise DomainError("Title must have at least 3 valid characters")

    if not tw_validate_content(content):
        raise DomainError("Content must have at least 50 valid characters")


    ### 2. cập nhập dữ liệu vào db
    updated_at = db_update_educational_teaching_word(id, title, content)

    ### 3. trả thông tin update time 
    return {
        "updatedAt": updated_at
    }


































# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py
class APIError(Exception):
    pass



@router.get("/educational-teaching-words/{id}")
def get_educational_teaching_word(
    id: str,
    current_user = Depends(require_login)
    ): 

    print(f"{LOG_API} vào get /educational-teaching-words/{id}")

    
    try: 
        return handle_get_educational_teaching_word(id)


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")




@router.get("/educational-teaching-words")
def get_educational_teaching_words_basic(
    view: str = Query(default="basic"),
    current_user = Depends(require_login)
    ):

    print(f"{LOG_API} vào get /educational-teaching-words?view={view}")

    try: 
        if view == "basic":
            return handle_get_educational_teaching_words_all_basic()
        
        raise APIError("Invalid view type")


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")








class educationalTeachingWordRequest(BaseModel): 
    title: str
    content: str



@router.post("/educational-teaching-words")
def post_educational_teaching_words(request: educationalTeachingWordRequest, current_user = Depends(require_admin)):
    print(f"{LOG_API} vào post /educational-teaching-words có request: {request.dict()}")

    try: 
        ### 1. handle post teaching word
        request_dict = request.dict()
        return handle_post_educational_teaching_words(request_dict["title"], request_dict["content"]) 
        
    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







@router.put("/educational-teaching-words/{id}")
def put_educational_teaching_word(id: str, request: educationalTeachingWordRequest, current_user = Depends(require_admin)):
    print(f"{LOG_API} vào put /educational-teaching-words/:id có request: {request.dict()}")

    try: 
        ### 1. handle put teaching word id 
        request_dict = request.dict()
        return handle_put_educational_teaching_words(id, request_dict["title"], request_dict["content"])

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


