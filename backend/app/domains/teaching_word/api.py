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

print("Vào domain/teaching-words/api.py")

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

def db_get_teaching_words_all():
    print(f"{LOG_DATABASE} lấy tất cả teaching words")
    # 1. lấy toàn bộ teaching_words 
    teaching_words = db.teaching_words.find({})

    # 2. đổi key _id thành id cho phù hợp với contract 
    result = []
    for teaching_word in teaching_words: 
        teaching_word["id"] = str(teaching_word["_id"])
        del teaching_word["_id"]
        result.append(teaching_word)

    # 3. return list teaching words
    return result 




def db_get_teaching_word(id): 
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



def db_create_teaching_word(title, content, year, week, weekday): 
    print(f"{LOG_DATABASE} tạo lời dạy mới với title: {title}, content: {content}, year: {year}, week: {week}, weekday: {weekday}")

    ### 1. tạo thời gian tạo 
    created_time = datetime.now()

    ### 2. thêm vào collection 
    result = db.teaching_words.insert_one({
        "title": title,
        "content": content, 
        "year": year, 
        "week": week, 
        "weekday": weekday,
        "created_at": created_time, 
        "updated_at": created_time
    })



    return str(result.inserted_id), created_time
    


# cập nhập nội dung lời dạy có id = id
def db_update_teaching_word(id, title, content, year, week, weekday): 
    print(f"{LOG_DATABASE} cập nhập lời dạy có id: {id} với nội dung mới là: {title}, content: {content}, date is: {weekday}W{week}Y{year}")

    # 1. kiểm tra xem id có hợp lệ hay không?
    try: 
        obj_id = ObjectId(id)
    except: 
        return False


    # 2. sửa lại trong database teaching word theo tham số của hàm 
    updated_time = datetime.now()
    result = db.teaching_words.update_one(
        {"_id": obj_id},
        {"$set": {
            "title": title,
            "content": content, 
            "year": year, 
            "week": week, 
            "weekday": weekday, 
            "updated_at": updated_time
        }}
    )


    return updated_time









# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
class DomainError(Exception):
    pass


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


def tw_validate_date(date: str) -> bool:
    if date is None:
        return False
    try:
        datetime.strptime(date, "%d/%m/%Y")
        return True
    except ValueError:
        return False



def get_current_year_and_week(): 
    # tách từ now 
    now = datetime.now()
    year = now.year
    week = now.isocalendar().week

    print(f"{LOG_DOMAIN} tuần hiện tại là: {week}, năm hiện tại: {year}")
    
    return week, year



def get_latest_teaching_word_this_week(teaching_words):
    # 1. lấy năm hiện tại và tuần hiện tại 
    week, year = get_current_year_and_week()

    # 2. tìm kiếm các lời dạy của nằm hiện tại và tuần hiện tại 
    words_in_week = [
        w for w in teaching_words
        if w["year"] == year and w["week"] == week
    ]

    if not words_in_week:
        return None

    # 3. lấy lời dạy có mà có week day cao nhất 
    result = max(words_in_week, key=lambda w: w["weekday"])


    # 4. trả kết quả
    return result



def generate_display_code_teaching_word(teaching_word): 
    # 1. lấy weekday, week và year của lời dạy 
    weekday = teaching_word["weekday"]
    week = teaching_word["week"]
    year = teaching_word["year"]

    # 2. tạo ra một string theo dạng T{weekday} or CN (nếu weekday là 1, là chủ nhật) + W{week} + Y(2 số cuối của year)
    ## 2.1 day part 
    if weekday == 1: 
        day_part = "CN"
    else: 
        day_part = f"T{weekday}"

    ## 2.2 year part 
    year_part = str(year)[-2:]

    ## 2.3 tạo kết quả 
    result = f"{day_part}W{week}Y{year_part}"

    # 3. return result string 
    return result




def handle_get_teaching_word_reflection(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get teaching word reflection")

    """
    DOMAIN RULES: 
    NONE
    """

    # 1. lấy toàn bộ teaching words 
    teaching_words = db_get_teaching_words_all()

    # 2. lọc ra teaching word mà thuộc tuần hiện tại 
    this_week_teaching_word = get_latest_teaching_word_this_week(teaching_words)

    if not this_week_teaching_word: 
        return {
            "teachingWord": None
        }
        

    # 3. generate display code cho teaching word mới nhất tuần này 
    display_code = generate_display_code_teaching_word(this_week_teaching_word)

    # 4. trả lại kết quả
    return {
        "teachingWord": {
            "id": this_week_teaching_word["id"],
            "displayCode": display_code,
            "title": this_week_teaching_word["title"],
            "content": this_week_teaching_word["content"]
        }
    }






def handle_get_teaching_word_full(id): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy teaching word có id: {id}")

    """
    DOMAIN RULES: 
    1. lời dạy có id phải có trong cơ sở dữ liệu
    """

    # 1. lấy hàm teaching word có id là id 
    teaching_word = db_get_teaching_word(id)

    if not teaching_word: 
        raise DomainError("Teaching word not found")
    
    # 2. generate display code 
    display_code = generate_display_code_teaching_word(teaching_word)

    # 3. trả lại kết quả
    return {
        "id": teaching_word["id"],
        "displayCode": display_code,
        "title": teaching_word["title"],
        "content": teaching_word["content"]
    }







def handle_get_teaching_word_basic(id): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy lời dạy cơ bản có id: {id}")

    """
    DOMAIN RULES: 
    1. LỜI DẠY VỚI ID PHẢI CÓ TRONG DATABASE
    """

    ### 1. lấy lời dạy từ database 
    teaching_word = db_get_teaching_word(id)

    if not teaching_word: 
        raise DomainError("Teaching words not found")

    ### 2. Trả lại theo như response trong api contract 
    ## 2.1 tạo dislay code 
    display_code = generate_display_code_teaching_word(teaching_word)

    return {
        "id": teaching_word["id"],
        "displayCode": display_code,
        "title": teaching_word["title"]
    }





def handle_get_teaching_words_all_basic(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy tất cả lời dạy mức basic")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy tất cả lời dạy từ db 
    teaching_words = db_get_teaching_words_all()
    
    ### 2. tạo một list các object mới mà chỉ có các field mới theo như response (id, display code (đã có hàm tạo displayCode từ một teaching_word object) và title thôi)
    teaching_words_basic = []

    for teaching_word in teaching_words: 
        teaching_words_basic.append({
            "id": teaching_word["id"],
            "displayCode": generate_display_code_teaching_word(teaching_word),
            "title": teaching_word["title"]
        })


    ### 3. return kết quả
    return {
        "teaching-words": teaching_words_basic
    }





### tách date: str dạng "day/month/year" ra weekday, week, year ở dạng số (weekday thì CN là 1, Thứ 2 là 2)
def get_date_part(date: str):
    # parse string "day/month/year" -> datetime
    dt = datetime.strptime(date, "%d/%m/%Y")

    year = dt.year

    # Python: Monday = 0, Sunday = 6
    python_weekday = dt.weekday()

    # Chuyển sang rule của bạn: Sunday = 1, Monday = 2, ..., Saturday = 7
    weekday = ((python_weekday + 1) % 7) + 1

    # Lấy số tuần trong năm (ISO week)
    week = dt.isocalendar().week

    # vì CN (weekday = 1) là ngày đầu tiên của tuần mới nên nếu là CN thì phải tự động cộng 1 vào số tuần 
    if weekday == 1: 
        week += 1

    return weekday, week, year





def handle_post_teaching_words(title, content, date): 
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng lời dạy mới với title: {title}, content: {content}, date: {date}")

    """
    DOMAIN RULES: 
    1. lời dạy phải có tiêu đề ít nhất 3 kí tự hợp lệ 
    2. lời dạy phải nội dung ít nhất 50 kí tự hợp lệ 
    3. lời dạy phải có ngày dạy hợp lệ 
    """

    ### rules 
    if not tw_validate_title(title):
        raise DomainError("Title must have at least 3 valid characters")

    if not tw_validate_content(content):
        raise DomainError("Content must have at least 50 valid characters")

    if not tw_validate_date(date):
        raise DomainError("Date must be a valid date (dd/mm/yyyy)")


    ### 1. tách year, week và weekday từ date 
    weekday, week, year = get_date_part(date)

    ### 2. tạo mới trong database
    id, created_at = db_create_teaching_word(title, content, year, week, weekday)

    return {
        "id": id, 
        "createdAt": created_at
    }





def handle_put_teaching_words(id, title, content, date):
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập lời dạy có id: {id}, title: {title}, content: {content} và date: {date}")

    """
    DOMAIN RULES: 
    1. Lời dạy phải có trong cơ sở dữ liệu 
    2. lời dạy phải có tiêu đề có ít nhất 3 kí tự hợp lệ 
    3. lời dạy phải có nội dung có ít nhất 50 kí tự hợp lệ 
    4. lời dạy phải có date hợp lệ
    """


    ### rules
    if not db_get_teaching_word(id): 
        raise DomainError("Teaching word not found")

    if not tw_validate_title(title):
        raise DomainError("Title must have at least 3 valid characters")

    if not tw_validate_content(content):
        raise DomainError("Content must have at least 50 valid characters")

    if not tw_validate_date(date):
        raise DomainError("Date must be a valid date (dd/mm/yyyy)")


    ### 1. tách year, week và weekday từ date 
    weekday, week, year = get_date_part(date)


    ### 2. cập nhập dữ liệu vào db
    updated_at = db_update_teaching_word(id, title, content, year, week, weekday)

    ### 3. trả thông tin update time 
    return {
        "updatedAt": updated_at
    }



















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py
class APIError(Exception):
    pass


@router.get("/teaching-words/reflection")
def get_teaching_words_reflection(current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /teaching-words/reflection")

    try: 
        return handle_get_teaching_word_reflection()

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")



@router.get("/teaching-words/{id}")
def get_teaching_word(
    id: str,
    view: str = Query(default="full"), 
    current_user = Depends(require_login)
    ): 

    print(f"{LOG_API} vào get /teaching-words/:id, id: {id}")

    
    try: 
        ### 1. nếu view basic thì handle get teaching word basic 
        if view == "basic":
            return handle_get_teaching_word_basic(id)
    
        ### 2. nếu view full thì handle get teaching word full
        if view == "full": 
            return handle_get_teaching_word_full(id)

        raise APIError("Invalid view type")


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")




@router.get("/teaching-words")
def get_teaching_words_basic(
    view: str = Query(default="basic"),
    current_user = Depends(require_login)
    ):

    print(f"{LOG_API} vào get /teaching-words")

    try: 
        if view == "basic":
            return handle_get_teaching_words_all_basic()
        
        raise APIError("Invalid view type")


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")








class teachingWordRequest(BaseModel): 
    title: str
    content: str
    date: str



@router.post("/teaching-words")
def post_teaching_words(request: teachingWordRequest, current_user = Depends(require_admin)):
    print(f"{LOG_API} vào post /teaching-words có request: {request.dict()}")

    try: 
        ### 1. handle post teaching word
        request_dict = request.dict()
        return handle_post_teaching_words(request_dict["title"], request_dict["content"], request_dict["date"])    
        
    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







@router.put("/teaching-words/{id}")
def put_teaching_word(id: str, request: teachingWordRequest, current_user = Depends(require_admin)):
    print(f"{LOG_API} vào put /teaching-words/:id có request: {request.dict()}")

    try: 
        ### 1. handle put teaching word id 
        request_dict = request.dict()
        return handle_put_teaching_words(id, request_dict["title"], request_dict["content"], request_dict["date"])

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


