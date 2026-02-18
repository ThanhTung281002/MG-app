# ==================== 4. APP =====================
from fastapi import FastAPI, HTTPException 
from app.domains.teaching_word.api import router as teaching_word_router    
from app.domains.auth.api import router as auth_router
from app.domains.life_lesson.api import router as life_lesson_router



app = FastAPI()
app.include_router(teaching_word_router)
app.include_router(auth_router)
app.include_router(life_lesson_router)



# ============== 3. API ENDPOINTS =================
# note: làm công việc nhận yêu cầu và trả lại phản hồi theo đã thiết kế trong api contract (sử dụng các hàm nghiệp vụ tầng 2)

# ---------- 1. check server ok -------------
@app.get("/health")
def health_check():     
    return {"status": "ok"}

