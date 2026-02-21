



LOG_API = "3. API ENDPOINTS:"
LOG_DOMAIN = "          2. DOMAIN LOGIC:"
LOG_DATABASE = "                        1. DATABASE LOGIC:"

print("vào domains/note")






# ================== 1. DATABASE LOGIC =================
# NOTE: XỬ LÍ ĐƠN GIẢN CRUD ĐỐI VỚI DATABASE, SỬ DỤNG BẢNG Ở models.py ĐỂ HỖ TRỢ 
from bson import ObjectId
from datetime import datetime 
from app.core.database import db 
from bson.errors import InvalidId



def db_delete_note(id: str): 
    print(f"{LOG_DATABASE} vào hàm db xóa note: {id}")

    try: 
        object_id = ObjectId(id)
    except InvalidId: 
        return 0

    ### xóa
    result = db.notes.delete_one({"_id": object_id})

    return result.deleted_count





def db_update_note(id: str, title: str, content: str, type: str, updated_time: datetime): 
    print(f"{LOG_DATABASE} vào hàm cập nhập note: {id}, theo title: {title}, content: {content}, type: {type}")

    try: 
        object_id = ObjectId(id)
    except InvalidId: 
        return 0, 0


    ### cập nhập vào db thôi 
    result = db.notes.update_one(
        {"_id": object_id},
        {"$set": {
            "title": title, 
            "content": content, 
            "type": type, 
            "updated_at": updated_time 
        }}
    )

    return result.matched_count, result.modified_count



def db_get_note_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm db lấy note theo id: {id}")

    try: 
        object_id = ObjectId(id)
    except InvalidId: 
        return None

    
    result = db.notes.find_one({"_id": object_id})

    if not result: 
        return None

    result["id"] = str(result["_id"])
    result["user_id"] = str(result["user_id"])

    return result




def db_create_note(user_id: str, title: str, content: str, display_index: int, created_time: str): 
    print(f"{LOG_DATABASE} vào hàm db tạo note của user: {user_id}, có title: {title}, content: {content}, display_index: {display_index}, created time: {created_time}")

    try: 
        object_user_id = ObjectId(user_id)
    except InvalidId: 
        return None


    result = db.notes.insert_one({
        "user_id": object_user_id, 
        "title": title, 
        "content": content, 
        "type": "NONE",
        "display_index": display_index, 
        "created_at": created_time,
        "updated_at": created_time
    })


    return str(result.inserted_id)





def db_get_notes_by_type(user_id: str, type: str): 
    print(f"{LOG_DATABASE} vào hàm db để lấy các notes của user: {user_id} thuộc loại: {type}")

    try: 
        object_user_id = ObjectId(user_id)
    except InvalidId: 
        return []

    notes = db.notes.find({
        "user_id": object_user_id, 
        "type": type
    })

    result = []

    for n in notes: 
        n["id"] = str(n["_id"])
        del n["_id"]
        n["user_id"] = str(n["user_id"])
        result.append(n)

    return result

    


def db_get_teaching_word_by_id(id: str): 
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






def db_get_life_lesson_reflection_by_id(id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy bài học bằng id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy từ db thôi 
    llr = db.life_lessons_reflection.find_one({"_id": object_id})
    if not llr: 
        return None

    llr["id"] = str(llr["_id"])
    del llr["_id"]
    llr["user_id"] = str(llr["user_id"])
    llr["life_lesson_id"] = str(llr["life_lesson_id"])    

    return llr





def db_get_purpose_by_id(id: str): 
    print(f"{LOG_DATABASE} vào lấy mục đích có id: {id}")

    try: 
        object_id = ObjectId(id)
    except: 
        return None

    ### 1. lấy purpose từ db 
    p = db.purposes.find_one({"_id": object_id})

    if not p: 
        return None

    ### 2. đổi format rồi gửi trả lại 
    p["id"] = str(p["_id"])
    del p["_id"]
    p["user_id"] = str(p["user_id"])

    return p




def db_get_notes(user_id: str): 
    print(f"{LOG_DATABASE} vào hàm lấy toàn bộ note của user: {user_id}")

    try: 
        object_user_id = ObjectId(user_id)
    except InvalidId: 
        return None

    notes = db.notes.find({"user_id": object_user_id})

    result = []
    for n in notes: 
        n["id"] = str(n["_id"])
        del n["_id"]
        n["user_id"] = str(n["user_id"])
        result.append(n)

    
    return result 






def db_create_relation(user_id: str, from_type: str, from_id: str, to_type: str, to_id: str):
    print(f"{LOG_DATABASE} vào hàm tạo mối liên kết của user: {user_id} của bối cảnh: {from_id} ({from_type}) tới vật sinh ra: {to_id} ({to_type})")

    try: 
        object_user_id = ObjectId(user_id)
        object_from_id = ObjectId(from_id)
        object_to_id = ObjectId(to_id)
    except: 
        return None

    ### 1. tạo mối liên kết 
    created_time = datetime.now()

    result = db.relations.insert_one({
        "user_id": object_user_id, 
        "from_type": from_type, 
        "from_id": object_from_id, 
        "to_type": to_type,
        "to_id": object_to_id,
        "created_at": created_time
    })


    return str(result.inserted_id), created_time
























# ================= 2. DOMAIN LOGIC ================= 
# NOTE: XỬ LÍ CÁC NGHIỆP VỤ/LOGIC CHÍNH, SỬ DỤNG CÁC HÀM Ở TẦNG 1. DATABASE LOGIC Ở repository.py và các hàm bổ trợ khác nhưng mình chưa biết nó sẽ nằm ở file nào? 
from fastapi import HTTPException


class DomainError(Exception): 
    pass




def generate_display_code_for_note(note: dict):
    print(f"    {LOG_DOMAIN} tạo display code cho note: {note}")

    display_index = note["display_index"]

    display_code = f"N{display_index:03d}"
    print(f"    {LOG_DOMAIN} kết quả: {display_code}")

    return display_code



def handle_get_notes_unresolved(user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm nghiệp lấy note đang bí của user: {user_id}")

    """
    DOMAIN RULES: 
    NONE
    """

    ### 1. lấy notes unresolved
    unresolved_notes = db_get_notes_by_type(user_id, "UNRESOLVED")

    ### 2. chỉnh format và trả lại theo api contract 
    result = []
    for un in unresolved_notes: 
        display_code = generate_display_code_for_note(un)
        result.append({
            "id": un["id"],
            "title": un["title"],
            "displayCode": display_code,
            "content": un["content"], 
            "type": un["type"]
        })

    return {
        "unresolved-notes": result
    }







def generate_new_note_display_index(user_id): 
    print(f"    {LOG_DOMAIN} tạo display index mới cho note mới của user: {user_id}")

    notes_by_user = db_get_notes(user_id)

    result = len(notes_by_user) + 1

    print(f"    {LOG_DOMAIN} kết quả: {result}")

    return result


### lấy nhiều nhất 5 từ từ content để tạo thành title cho note
def generate_note_title_from_content(content: str):
    print(f"    {LOG_DOMAIN} tạo note title từ content: {content}")

    if not content:
        return ""

    # bỏ khoảng trắng đầu/cuối
    content = content.strip().replace("\n", " ")

    # tách thành list các từ
    words = content.split()

    if not words: 
        return ""

    # lấy tối đa 5 từ đầu
    first_words = words[:5]

    # ghép lại thành chuỗi
    title = " ".join(first_words)

    print(f"    {LOG_DOMAIN} kết quả: {title}")

    return title



def generate_display_code_from_display_index_for_note(display_index: int): 
    print(f"    {LOG_DOMAIN} tạo display code từ display index: {display_index}")

    display_code = f"N{display_index:03d}"
    print(f"    {LOG_DOMAIN} kết quả: {display_code}")

    return display_code





def handle_post_note_free_write(user_id: str, origin_context_type: str, origin_context_id: str, content: str):
    print(f"{LOG_DOMAIN} vào hàm xử lí đăng note tự do cho user: {user_id} với bối cảnh: {origin_context_id} ({origin_context_type}), có nội dung: {content}")

    """
    DOMAIN RULES: 
    1. loại bối cảnh phải là 4 loại đã có 
    2. thực thể bối cảnh phải tồn tại 
    3. thực thể bối cảnh nếu như là life-lesson reflection, purpose, note thì phải thuộc về cùng user nhập vào 
    4. content không được để trống 
    """

    ### 1. check rules 
    if origin_context_type == "TEACHING_WORD": 
        tw = db_get_teaching_word_by_id(origin_context_id)

        if not tw: 
            raise DomainError("Teaching word not found")

    elif origin_context_type == "LIFE_LESSON": 
        llr = db_get_life_lesson_reflection_by_id(origin_context_id)

        if not llr: 
            raise DomainError("Life lesson reflection not found")

        if user_id != llr["user_id"]: 
            raise DomainError("User does not have the right to the origin context")

    elif origin_context_type == "PURPOSE": 
        p = db_get_purpose_by_id(origin_context_id)

        if not p: 
            raise DomainError("Purpose not found")

        if user_id != p["user_id"]: 
            raise DomainError("User does not have the right to the origin context")
    
    elif origin_context_type == "NOTE": 
        n = db_get_note_by_id(origin_context_id)

        if not n: 
            raise DomainError("Note not found")

        if user_id != n["user_id"]: 
            raise DomainError("User does not have the right to the origin context")

    else: 
        raise DomainError("Invalid origin context type")

    
    if not validate_note_content(content): 
        raise DomainError("Invalid input note content")


    ### 1. tạo note, ở đây thì phải generate title (lấy 5 kí tự đầu từ note), generate display_index (đếm tăng dần theo từng user)
    display_index = generate_new_note_display_index(user_id)
    title = generate_note_title_from_content(content)
    created_time = datetime.now()
    note_id = db_create_note(user_id, title, content, display_index, created_time)

    ### 2. gắn liên kết 
    db_create_relation(user_id, origin_context_type, origin_context_id, "NOTE", note_id)



    ### 3. return theo api contract 
    display_code = generate_display_code_from_display_index_for_note(display_index)
    return {
        "id": note_id,
        "displayCode": display_code, 
        "title": title, 
        "createdAt": created_time 
    }








def handle_get_note_basic(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get note {id} cơ bản của user: {user_id}")

    """
    DOMAIN RULES: 
    1. note phải tồn tại 
    2. note phải thuộc cùng user 
    """

    ### 1. check rules
    note = db_get_note_by_id(id)

    if not note: 
        raise DomainError("Note not found")

    if user_id != note["user_id"]: 
        raise DomainError("User does not have the right to this note")

    
    ### 2. trả lại theo api contract 
    display_code = generate_display_code_for_note(note)

    return {
        "id": note["id"], 
        "title": note["title"], 
        "displayCode": display_code, 
        "type": note["type"]
    }






def handle_get_note_full(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí get note {id} đầy đủ của user: {user_id}")

    """
    DOMAIN RULES: 
    1. note phải tồn tại 
    2. note phải thuộc cùng user 
    """

    ### 1. check rules
    note = db_get_note_by_id(id)

    if not note: 
        raise DomainError("Note not found")

    if user_id != note["user_id"]: 
        raise DomainError("User does not have the right to this note")

    
    ### 2. trả lại theo api contract 
    display_code = generate_display_code_for_note(note)

    return {
        "id": note["id"], 
        "title": note["title"], 
        "content": note["content"],
        "displayCode": display_code, 
        "type": note["type"]
    }

    

def validate_note_content(content: str): 
    print(f"    {LOG_DOMAIN} check content của note: {content}")

    content_strip = content.strip()

    if len(content_strip) == 0: 
        return False

    return True


def validate_note_type(type: str): 
    print(f"    {LOG_DOMAIN} check type của note: {type}")

    if type != "NONE" and type != "EXPERIENCED" and type != "UNRESOLVED" and type != "INSIGHT": 
        return False

    return True


def handle_put_note(id: str, user_id: str, content, type): 
    print(f"{LOG_DOMAIN} vào hàm xử lí cập nhập note: {id} của user: {user_id} với nội dung: {content} và loại {type}")

    """
    DOMAIN RULES
    1. note phải tồn tại 
    2. note phải thuộc cùng user
    3. content không được trống
    4. type phải là một trong các loại đã ghi nhận (cả lại NONE)
    """

    ### 1. check rules
    note = db_get_note_by_id(id)

    if not note: 
        raise DomainError("Note not found")

    if user_id != note["user_id"]: 
        raise DomainError("User does not have the right to this note")
    
    if not validate_note_content(content): 
        raise DomainError("Invalid input note content")

    if not validate_note_type(type): 
        raise DomainError("Invalid input note type")

    
    ### 2. cập nhập note thôi 
    title = generate_note_title_from_content(content)
    updated_time = datetime.now()
    matched_count, modified_count = db_update_note(id, title, content, type, updated_time)

    if matched_count == 0: 
        raise DomainError("Failed to update note")


    ### 3. return the api contract 
    return {
        "title": title, 
        "updatedAt": updated_time 
    }






def handle_delete_note(id: str, user_id: str): 
    print(f"{LOG_DOMAIN} vào hàm xử lí xóa note: {id} của user: {user_id}")

    """
    DOMAIN RULES: 
    1. note phải tồn tại 
    2. note phải thuộc cùng user 
    """

    ### 1. check rules 
    note = db_get_note_by_id(id)

    if not note: 
        raise DomainError("Note not found")

    if user_id != note["user_id"]: 
        raise DomainError("User does not have the right to this note")

    
    ### xóa note và xóa mọi thứ gắn bối cảnh là nó và sau đó nữa và xóa mọi liên kết và có gắn nó là cái sinh ra. 
    deleted_count = db_delete_note(id)


    ### 3. return theo api contract
    if deleted_count == 1: 
        return {
            "message": "Delete successfully"
        }
    else: 
        raise DomainError("Failed to delete note")


















# ====================== 3. API ENDPOINTS =====================
# NOTE: TẦNG VIẾT API, NHẬN REQUEST VÀ TRẢ RESPONSE VÀ SỬ DỤNG HÀM NGHIỆP VỤ CỦA TẦNG 2. DOMAIN LOGIC TRONG service.py 
from fastapi import Depends, Query, APIRouter
from app.dependencies.auth import require_login
from pydantic import BaseModel 


router = APIRouter()


class APIError(Exception): 
    pass





@router.get("/notes/unresolved")
def get_notes_unresolved(current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /notes/unresolved")

    try: 
        return handle_get_notes_unresolved(current_user["id"])


    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")




class OriginContextRequest(BaseModel): 
    type: str
    id: str


class PostNoteFreeRequest(BaseModel): 
    originContext: OriginContextRequest
    content: str




@router.post("/notes/free-write")
def post_note_free_write(request: PostNoteFreeRequest, current_user = Depends(require_login)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào post /notes/free-write với request: {request_dict}")

    try: 
        origin_context_type = request_dict["originContext"]["type"]
        origin_context_id = request_dict["originContext"]["id"]
        content = request_dict["content"]
        return handle_post_note_free_write(current_user["id"], origin_context_type, origin_context_id, content)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")










@router.get("/notes/{id}")
def get_note(id: str, view : str = Query(default="full"), current_user = Depends(require_login)): 
    print(f"{LOG_API} vào get /notes/{id}?view={view}")

    try: 
        if view == "basic": 
            return handle_get_note_basic(id, current_user["id"])

        elif view == "full": 
            return handle_get_note_full(id, current_user["id"])

        else: 
            raise APIError("Invalid view type")

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






class PutNoteRequest(BaseModel): 
    content: str
    type: str




@router.put("/notes/{id}")
def put_note(request: PutNoteRequest, id: str, current_user = Depends(require_login)): 
    request_dict = request.dict()
    print(f"{LOG_API} vào put /notes/{id} với request: {request_dict}")

    try: 
        content = request_dict["content"]
        type = request_dict["type"]
        return handle_put_note(id, current_user["id"], content, type)

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")







@router.delete("/notes/{id}")
def delete_note(id: str, current_user = Depends(require_login)): 
    print(f"{LOG_API} vào delete /notes/{id}")

    try: 
        return handle_delete_note(id, current_user["id"])

    except APIError as e: 
        raise HTTPException(status_code=400, detail=str(e))

    except DomainError as e: 
        raise HTTPException(status_code=400, detail=str(e))
  
    except Exception as e: 
        print(f"SERVER ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


