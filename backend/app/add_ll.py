# ============ FILE CHỈ ĐỂ PHỤC VỤ MỤC ĐÍCH THÊM CÁC BÀI GIẢNG VÀO TRONG CƠ SỞ DỮ LIỆU ===============



from core.database import db 
from datetime import datetime 

def db_add_life_lessons(title: str, main_content: str): 
    ### 1. thêm nội dung vào collection life_lessons trong database 
    created_time = datetime.now()

    result = db.life_lessons.insert_one({
        "title": title, 
        "main_content": main_content, 
        "created_at": created_time, 
        "updated_at": created_time
    })

    return created_time





TITLE = "Thuyết Đấng Ba Ngôi"
MAIN_CONTENT = ""


print(f"Thêm bài giảng có tiêu dề: {TITLE} và nội dung chính: {MAIN_CONTENT}")

result = db_add_life_lessons(TITLE, MAIN_CONTENT)

print(f"Kết quả: {result}")