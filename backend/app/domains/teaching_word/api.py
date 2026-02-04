from datetime import datetime 
from fastapi import APIRouter 



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
    }
]









# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 


def db_get_teaching_words_all():
    print(f"{LOG_DATABASE} lấy tất cả teaching words")
    # 1. lấy toàn bộ teaching_words và trả lại 
    return TEACHING_WORDS




def db_get_teaching_word(id): 
    print(f"{LOG_DATABASE} lấy lời dạy mà có id: {id}")
    # 1. lấy tất cả lời dạy
    teaching_words = db_get_teaching_words_all()

    # 2. Tìm lời dạy có id nhập vào, và trả kết quả ngay nếu tìm thấy
    for teaching_word in teaching_words: 
        if teaching_word["id"] == id: 
            return teaching_word

    # 3. nếu không tìm thấy 
    return None















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 

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
    result = max(words_in_week, key=lambda w: w["created_at"])


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

    # 1. lấy toàn bộ teaching words 
    teaching_words = db_get_teaching_words_all()

    # 2. lọc ra teaching word mà thuộc tuần hiện tại 
    this_week_teaching_word = get_latest_teaching_word_this_week(teaching_words)

    if not this_week_teaching_word: 
        return {
            "message": "No teaching words for this week"
        }

    # 3. generate display code cho teaching word mới nhất tuần này 
    display_code = generate_display_code_teaching_word(this_week_teaching_word)

    # 3. trả lại kết quả
    return {
        "id": this_week_teaching_word["id"],
        "displayCode": display_code,
        "title": this_week_teaching_word["title"],
        "content": this_week_teaching_word["content"]
    }


















def handle_get_teaching_word(id): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy teaching word có id: {id}")

    # 1. lấy hàm teaching word có id là id 
    teaching_word = db_get_teaching_word(id)

    if not teaching_word: 
        return {
            "message": "Teaching word not found"
        }
    
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

    ### 1. lấy lời dạy từ database 
    teaching_word = db_get_teaching_word(id)

    if not teaching_word: 
        return {
            "message": "Teaching word not found"
        }

    ### 2. Trả lại theo như response trong api contract 
    ## 2.1 tạo dislay code 
    display_code = generate_display_code_teaching_word(teaching_word)

    return {
        "id": teaching_word["id"],
        "displayCode": display_code,
        "title": teaching_word["title"]
    }






def handle_get_teaching_word_all_basic(): 
    print(f"{LOG_DOMAIN} vào hàm xử lí lấy tất cả lời dạy mức basic")

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












# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py
@router.get("/teaching-words/{id}")
def get_teaching_word(id: str): 
    print(f"{LOG_API} vào get /teaching-words/{id}")

    return handle_get_teaching_word(id)
    


@router.get("/teaching-words/reflection")
def get_teaching_words_reflection(): 
    print(f"{LOG_API} vào get teaching words reflection")

    return handle_get_teaching_word_reflection()











@router.get("/teaching-words/basic/{id}")
def get_teaching_word_basic(id: str):
    print(f"{LOG_API} vào get /teaching-words/{id}/basic")

    return handle_get_teaching_word_basic(id)





@router.get("/teaching-words/basic")
def get_teaching_word_all_basic():
    print(f"{LOG_API} vào get /teaching-words/basic")

    return handle_get_teaching_word_all_basic()