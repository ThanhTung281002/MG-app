print("vào file domains/auth/api.py")


LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"


# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from app.core.database import db 
from datetime import datetime 
from bson import ObjectId


def db_get_user_by_email(email: str): 
    print(f"{LOG_DATABASE} vào get user by email: {email}")

    # tìm trong db.users collection có user nào có email như trên không và đổi lại format của id nữa là xong 
    user = db.users.find_one({"email": email})

    if user is None: 
        return None

    # đổi format của _id thành id 
    user["id"] = str(user["_id"])
    del user["_id"]

    return user




def db_get_user_by_username(username: str): 
    print(f"{LOG_DATABASE} vào get user by username: {username}")

    # như trên
    user = db.users.find_one({"username": username})

    if user is None: 
        return None

    # đổi format của _id thành id 
    user["id"] = str(user["_id"])
    del user["_id"]

    return user

    


def db_create_user(fullname: str, email: str, username: str, password_hash: str): 
    print(f"{LOG_DATABASE} vào create user với fullname: {fullname}, email: {email}, username: {username}, password hash: {password_hash}")
    
    ### 1. tạo thời gian tạo 
    created_time = datetime.now()


    ### 2. Thêm vào collection 
    result = db.users.insert_one({
        "fullname": fullname, 
        "email": email,
        "username": username, 
        "password_hash": password_hash, 
        "role": "USER", 
        "status": "PENDING", 
        "created_at": created_time, 
        "updated_at": created_time
    })


    return created_time 





def db_get_life_lessons_main_all(): 
    print(f"{LOG_DATABASE} lấy toàn bộ bài học nội dung chính")

    ### 1. lấy từ database và đổi sang format list, điều chỉnh _id thành id
    life_lessons_main = db.life_lessons_main.find({})

    result = []
    
    for llm in life_lessons_main: 
        llm["id"] = str(llm["_id"])
        del llm["_id"]
        result.append(llm)


    return result 



def db_create_life_lesson_reflection(user_id: str, life_lesson_id: str):
    db.life_lessons_reflection.insert_one({
        "user_id": ObjectId(user_id),
        "life_lesson_id": ObjectId(life_lesson_id),
        "reflection": "",
        "updated_at": datetime.now()
    })





















# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException
from app.dependencies.auth import require_login, require_guest
import re
from app.core.security import create_access_token



class DomainError(Exception): 
    pass




# fullname phải có ít nhất 2 từ và mỗi từ phải có ít nhất 2 kí tự 
def validate_fullname(fullname: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm check họ tên hợp lệ với: {fullname}")

    if not fullname: 
        return False

    # loại bỏ khoảng trắng dư thừa 
    fullname = fullname.strip()

    # tách từ theo khoảng trắng 
    parts = fullname.split()

    # phải có ít nhất 2 từ
    if len(parts) < 2: 
        return False

    # mỗi từ phải có ít nhất 2 kí tự 
    for part in parts: 
        if len(part) < 2: 
            return False

    return True


# email phải có dạng hợp lệ, sử dụng regex 
def validate_email(email: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm check email hợp lệ với: {email}")


    if not email: 
        return False

    email = email.strip()

    # regex cơ bản cho email
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"


    return re.match(pattern, email) is not None



# username phải có ít nhất 5 kí tự 
def validate_username(username: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm check tên đăng nhập hợp lệ với username: {username}")


    if not username: 
        return False

    # loại bỏ khoảng trắng dư thừa 
    username = username.strip()

    if len(username) < 5: 
        return False


    # chỉ cho phép chữ, số và _
    if not username.isalnum() and "_" not in username:
        # cách đơn giản: kiểm tra từng ký tự
        for ch in username:
            if not (ch.isalnum() or ch == "_"):
                return False


    return True




# password phải có ít nhất 8 kí tự và phải có ít nhất một kí tự in hoa, kí tự đặc biệt, kí tự số và kí tự thường 
def validate_password(password: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm check mật khẩu hợp lệ với password: {password}")

    if not password: 
        return False 

    if len(password) < 8: 
        return False 

    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    if not (has_upper and has_lower and has_digit and has_special):
        return False

    return True









from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash_password(password: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm băm mật khẩu với password: {password}")

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str): 
    print(f"{LOG_DOMAIN}    1. vào hàm verify mật khẩu với mật khẩu ban đầu: {plain_password} và mật khẩu băm: {hashed_password}")

    return pwd_context.verify(plain_password, hashed_password)




# tạo ra các reflection ứng với từng life -lesson main đối với user_id trong tham số 
def create_reflections_for_user(user_id: str): 
    ### 1. lấy toàn bộ life-lessons main 
    life_lessons_main = db_get_life_lessons_main_all()

    ### 2. tạo life-lessons-reflection ứng với từng life-lesson main trên gắn với user-id trong tham số vào và nội dung reflection là trống lúc đầu
    for llm in life_lessons_main: 
        db_create_life_lesson_reflection(user_id, llm["id"])






# ngoài những việc mà nó cần làm thì còn phải có một việc nữa, đó là tạo ra các reflection tương ứng với từng life-lessons-main mà gắn với user vừa tạo 
def handle_signup(fullname: str, email: str, username: str, password: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng kí với fullname: {fullname}, email: {email}, username: {username}, password: {password}")

    """
    DOMAIN RULES
    1. fullname phải valid 
    2. email phải valid 
    3. username phải valid
    4. password phải valid 
    5. email không được đã có trong database 
    6. username không được đã có trong database
    """

    if not validate_fullname(fullname): 
        raise DomainError("Invalid input fullname, fullname must have at least 2 word and each word must have at least 2 character")

    if not validate_email(email): 
        raise DomainError("Invalid input email")

    if not validate_username(username): 
        raise DomainError("Invalid input username, username must have at least 5 characters")

    if not validate_password(password):
        raise DomainError("Invalid input password, password must have at least one upper character, one lower character, one number and one special character")


    user = db_get_user_by_email(email)
    if user is not None: 
        raise DomainError("Email has already been used by another user") 

    user = db_get_user_by_username(username)
    if user is not None: 
        raise DomainError("Username has already been used by another user")

    # tạo hash passoword
    password_hash = hash_password(password)

    # tạo user trong database 
    db_create_user(fullname, email, username, password_hash)

    # tạo các reflection ứng với mỗi life-lessons main cho user vừa tạo
    user = db_get_user_by_username(username) 
    create_reflections_for_user(user["id"])

    return {
        "message": "Signup successfully"
    }








def handle_login(username: str, password: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí login với username: {username} và password: {password}")

    """
    DOMAIN RULES
    1. username phải hợp lệ 
    2. password phải hợp lệ 
    3. username phải có trong db
    4. mật khẩu phải khớp 
    """

    if not validate_username(username): 
        raise DomainError("Invalid input username, username must have at least 2 word, each word must have at least 2 characters")

    if not validate_password(password): 
        raise DomainError("Invalid input password, password must have at least one uppercase, one lowercase, one number and one special character")

    user = db_get_user_by_username(username)
    if not user: 
        raise DomainError("Non existed user")
    
    if not verify_password(password, user["password_hash"]): 
        raise DomainError("Wrong password")
    
    data = {
        "user_id": user["id"], 
        "role": user["role"]
    }
    token = create_access_token(data)

    return {
        "data": {
            "accessToken": token, 
            "tokenType": "bearer"
        }, 
        "message": "Login successfully"
    }



# do sử dụng token nên logout thì bên FE xóa token đang lưu, còn BE không làm gì cả
def handle_logout():
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng xuất")

    return {
        "message": "Logout successfully"
    }

    



def handle_me(user: dict): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get me với user: {user}")

    return {
        "id": user["id"],
        "role": user["role"]
    }

















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 

from fastapi import APIRouter, Depends
from pydantic import BaseModel 


router = APIRouter()




class signupRequest(BaseModel): 
    fullname: str
    email: str
    username: str
    password: str


@router.post("/auth/signup")
def signup(request: signupRequest, current_user = Depends(require_guest)): 
    print(f"{LOG_API} vào post /auth/signup với request: {request.dict()}")

    try: 
        request_dict = request.dict()
        fullname = request_dict["fullname"]
        email = request_dict["email"]
        username = request_dict["username"]
        password = request_dict["password"]

        return handle_signup(fullname, email, username, password)
    

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    
    





class loginRequest(BaseModel): 
    username: str
    password: str


@router.post("/auth/login")
def login(request: loginRequest, current_user = Depends(require_guest)): 
    print(f"{LOG_API} vào post /auth/login với request: {request.dict()}")

    try: 
        request_dict = request.dict()
        username = request_dict["username"]
        password = request_dict["password"]

        return handle_login(username, password)
    

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







@router.post("/auth/logout")
def logout(current_user = Depends(require_login)): 
    print(f"{LOG_API} vào post /auth/logout")

    try: 
        return handle_logout()

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

    









@router.get("/auth/me")
def me(current_user = Depends(require_login)): 
    print(f"{LOG_API} vào api get /auth/me với current user: {current_user}")

    try: 
        return handle_me(current_user)
    
    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")










