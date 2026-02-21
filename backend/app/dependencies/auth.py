# ======== FILE MIDDLE ĐỂ LẤY THÔNG TIN USER TRƯỚC KHI VÀO CÁC DOMAIN ==========



from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.core.database import db 
from bson import ObjectId

security = HTTPBearer()




# Cần phải thêm phần check lại trong database 
def require_login(credentials: HTTPAuthorizationCredentials = Depends(security)): 
    print(f"0. MIDDLEWARE LOG  vào require login")

    token = credentials.credentials
    payload = decode_access_token(token)

    ### kiểm tra token có hợp lệ hay không? 
    if payload is None: 
        raise HTTPException(status_code=401, detail="Unauthorized - người dùng chưa xác thực")

    ### check xem trong cơ sở dữ liệu có user này chưa    
    user_id = payload["user_id"]

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user: 
        raise HTTPException(status_code=401, detail="Non existed user")


    ### có user, chỉnh sửa lại format rồi return lại ở hàm này 
    user["id"] = str(user["_id"])
    del user["_id"]

    return user



def require_admin(current_user = Depends(require_login)): 
    print(f"0. MIDDLEWARE LOG  vào require admin")
    if current_user.get("role") != "ADMIN": 
        raise HTTPException(status_code=403, detail="Fobidden - người dùng không có quyền truy cập")

    return current_user



from fastapi import Request


# đối với guest thì phải ở 2 trường hợp là không có token hoặc có token nhưng không hợp lệ
# TH1: không có token, không có authorization header 
# TH2: có token nhưng token không hợp lệ 
# TH3: token hợp lệ và user đã bị xóa ra khỏi database ⁉️ thì sẽ làm sao 
def require_guest(request: Request): 
    print(f"0. MIDDLEWARE LOG  vào require guest")
    auth_header = request.headers.get("Authorization")


    # TH1
    if not auth_header: 
        return None # Chưa đăng nhập -> OK

    
    # TH2
    try: 
        scheme, token = auth_header.split()
    except ValueError: 
        return None

    payload = decode_access_token(token)

    if payload is not None: 
        raise HTTPException(status_code=403, detail="User must logout first")

    
    return None

