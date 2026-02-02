# ==================== 4. APP =====================
from fastapi import FastAPI, HTTPException 


app = FastAPI()



# ================ 0. MOCK COLLECTION =============



# ================ 1. DATABASE LOGIC ==============




# ================ 2. DOMAIN LOGIC ================




# ============== 3. API ENDPOINTS =================
# note: làm công việc nhận yêu cầu và trả lại phản hồi theo đã thiết kế trong api contract (sử dụng các hàm nghiệp vụ tầng 2)

# ---------- 1. check server ok -------------
@app.get("/health")
def health_check(): 
    return {"status": "ok"}




# --------------- 2. auth -----------------------
# 2.1 signup 
@app.post("/auth/signup")
def signup(request: signupRequest): 
    return handle_signup(request.dict())



# 2.2 login 
@app.post("/auth/login")
def login(request: loginRequest): 
    return handle_login(request.dict())

# 2.3 logout 
@app.post("/auth/logout")
def logout(): 
    return handle_logout()


# 2.4 me
@app.get("/auth/me")
def me(): 
    return handle_me()






# ---------------- 3. teaching
