# ========== FILE CHỈ LO VỀ JWT (JSON WEB TOKEN) =========
# theo cách mình hiểu là hình như chỉ làm 2 nhiệm vụ là tạo ra token từ thông tin vào và giải mã token để lấy thông tin
print("Vào file app/core/security.py")



from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "IMA_TAI_LAM_BANG_PI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(data: dict): 
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def decode_access_token(token: str): 
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError: 
        return None
