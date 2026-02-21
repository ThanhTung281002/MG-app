# ==================== 4. APP =====================
from fastapi import FastAPI, HTTPException 
from app.domains.teaching_word.api import router as teaching_word_router    
from app.domains.auth.api import router as auth_router
from app.domains.life_lesson_reflection.api import router as life_lesson_reflection_router
from app.domains.life_lesson_main.api import router as life_lesson_main_router
from app.domains.purpose.api import router as purpose_router
from app.domains.action.api import router as action_router
from app.domains.note.api import router as note_router




app = FastAPI()
app.include_router(teaching_word_router)
app.include_router(auth_router)
app.include_router(life_lesson_reflection_router)
app.include_router(life_lesson_main_router)
app.include_router(purpose_router)
app.include_router(action_router)
app.include_router(note_router)



# ============== 3. API ENDPOINTS =================
# note: làm công việc nhận yêu cầu và trả lại phản hồi theo đã thiết kế trong api contract (sử dụng các hàm nghiệp vụ tầng 2)

# ---------- 1. check server ok -------------
@app.get("/health")
def health_check():     
    return {"status": "ok"}

