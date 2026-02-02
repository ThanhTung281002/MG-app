





# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 


def db_get_teaching_words_all():
    # 1. lấy 











# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 



# hàm logic bổ trợ cho domain 
def get_this_week_teaching_word(teaching_words): 
    # 1. tìm kiếm bằng cách đọc trong miền ngày tháng, nằm của 



def handle_get_teaching_word_reflection(): 
    # 1. lấy toàn bộ teaching words 

    # 2. lọc ra teaching word mà thuộc tuần hiện tại 

    # 3. trả lại kết quả









# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
@app.get("teaching-words/reflection")
def get_teaching-words_reflection(): 
    return handle_get_teaching_word_reflection()





