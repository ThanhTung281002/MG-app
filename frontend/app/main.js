console.log("main.js loaded")


// 1. HA HƯỚNG DẪN LÀ ĐỂ ÔN LẠI THÌ LÀM ĐÓ LÀ CLICK THÌ ĐỔI TRẠNG THÁI STATE PAGE 
// 2. HA hướng dẫn là để viết tốt hàm render thì hãy thử với nhiều giá trị state khác nhau và chạy thử trong tầng 5 init

import {login, getMe, signup, getTeachingWordReflection, getTeachingWord, getLifeLessonsReflectionReflection, getLifeLessonReflection, getActivePurposes, getPurpose, getActions, getUnresolvedNotes, getNote, getBornEntities, purposeFreeWrite, noteFreeWrite, updateLifeLessonReflection, updatePurpose, updateAction, addAction, updateNote, deleteNote, getAllTeachingWords, getAllLifeLessonsReflection, getPendingUsers, getRejectedUsers, getUser, updateUserStatus, updateTeachingWord, getAllLifeLessonsMain, getLifeLessonMain, updateLifeLessonMain, addTeachingWord} from "./services/services.js";


const DOM_LOG = "                   0. DOM:"; 
const API_FLOW_LOG = "                  1. API FLOW:"; 
const RENDER_LOG = "            2. RENDER:"; 
const CONTROLLER_LOG = "        3. CONTROLLER:"
const EVENT_HANDLER_LOG = "   4. EVENT HANDLER:"; 
const INIT_LOG = "5. INIT:";















// ================== 0. STATE ================
// state là hàm sự thật, có thể nói là nó chứa toàn bộ thông tin, trạng thái của trang web. 
// ??? mình thắc mắc là việc thay đổi giá trị trong state và rồi chạy hàm render là việc của tầng controller phải không? Vì việc thay đổi và sau đó chạy hàm renderState theo phong cách state driven UI thì sẽ liền mạch như vậy nên mình nghĩ vậy. 
const state = {
    user: null, 

    route: {
        name: "LOG_IN", 
        userRole: null, 
        currentEntity: null
    },

    cache: {
        teachingWords: {}, 
        lifeLessonsReflection: {}, 
        lifeLessonsMain: {}, 
        purposes: {}, 
        notes: {}, 
        relations: {
            origin: {}, 
            born: {}
        },
        users: {}
    },

    ui: {
        loading: false, 
        disabled: false, 
        fabState: null, 
        overlayVisible: false, 
        overlayEntity: null,
        saveStatus: "SAVED",
        noteTypeMenuOpen: false
    }, 

    error: null

}























function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



// ================== 1. API FLOW ================
// gọi và lấy dữ liệu từ api 
async function loginFlow(username, password) {
    console.log(`${API_FLOW_LOG} vào login flow với username: ${username}, password: ${password}`); 

    try {
        const {data, message} = await login(username, password); 
        return {data, message}; 
    } catch(err) {
        console.log(`lỗi ở loginFlow: ${err.message}`); 
        throw err; 
    }
}







async function getMeFlow() {
    console.log(`${API_FLOW_LOG} vào getMeFlow`)

    const token = localStorage.getItem("accessToken"); 

    if (!token) {
        throw new Error("No token"); 
    }

    try {
        const user = await getMe(token); 
        return user; 
    } catch(err) {
        console.log(`${API_FLOW_LOG} lỗi ở getMeFlow: ${err.message}`); 

        throw err; 
    }
}



async function signupFlow(fullname, email, username, password) {
    console.log(`${API_FLOW_LOG} vào signupFlow với họ tên: ${fullname}, email: ${email}, username: ${username}, password: ${password}`); 

    // 1. logic chính 
    try {
        const {message} = await signup(fullname, email, username, password); 

        return {message}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở signupFlow: ${err.message}`); 

        throw err; 
    }
}



async function getTeachingWordReflectionFlow() {
    console.log(`${API_FLOW_LOG} vào hàm lấy lời dạy hiện tại`); 

    try {
        const {teachingWord} = await getTeachingWordReflection(); 

        return {teachingWord}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở api flow: ${err.message}`);

        throw err; 
    }
}




async function getTeachingWordFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy lời dạy theo id: ${id}`); 

    try {
        const teachingWord = await getTeachingWord(id); 

        return teachingWord; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở api flow: ${err.message}`); 

        throw err; 
    }
}



async function getLifeLessonsReflectionReflectionFlow() {
    console.log(`${API_FLOW_LOG} vào hàm lấy id của 3 bài học gần nhất`); 

    try {
        const {lifeLessonsReflection} = await getLifeLessonsReflectionReflection(); 

        // console.log(`${API_FLOW_LOG} 1. lifeLessonsReflection: ${JSON.stringify(lifeLessonsReflection, null, 2)}`); 

        return {lifeLessonsReflection}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở api flow: ${err.message}`); 

        throw err; 
    }
}




async function getLifeLessonReflectionFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy nội dung đầy đủ của bài học có id: ${id}`); 

    try {
        const lifeLesson = await getLifeLessonReflection(id); 

        return lifeLesson; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở api flow: ${err.message}`); 

        throw err; 
    }
}




async function getActivePurposesFlow() {
    console.log(`${API_FLOW_LOG} vào hàm lấy toàn bộ purpose có trạng thái active`); 

    try {
        // 1. lấy thôi rồi trả lại 

        const {activePurposes} = await getActivePurposes(); 

        return {activePurposes}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 
        throw err; 
    }
}



async function getPurposeFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy mục đích có id: ${id}`); 

    try {
        const purpose = await getPurpose(id); 
        
        return purpose; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 
        throw err; 

    }
}



async function getActionsFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy tất cả hành động của mục đích: ${id}`); 

    try {
        const {actions} = await getActions(id); 

        return {actions}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 
        throw err; 
    }
}



async function getUnresolvedNotesFlow() {
    console.log(`${API_FLOW_LOG} vào hàm lấy thắc mắc chưa giải quyết`); 

    try {
        const {unresolvedNotes} = await getUnresolvedNotes(); 

        return {unresolvedNotes}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 
        throw err; 
    }
}



async function getNoteFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy note có id: ${id}`); 

    try {
        const note = await getNote(id); 
        return note; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 
        throw err; 
    }
}





async function getBornEntitiesFlow(type, id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy các thực thể sinh ra từ thực thể (${type} ${id})`); 

    try {
        const {born} = await getBornEntities(type, id); 

        return {born}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function purposeFreeWriteFlow(type, inputId, purposeContext, hopeContext) {
    console.log(`${API_FLOW_LOG} vào hàm gửi purpose free write với origin: (${type}, ${inputId}) có purpose: ${purposeContext} và hope: ${hopeContext}`); 

    try {
        const {id, createdAt} = await purposeFreeWrite(type, inputId, purposeContext, hopeContext); 

        return {id, createdAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function noteFreeWriteFlow(type, inputId, context) {
    console.log(`${API_FLOW_LOG} vào hàm gửi note free write có origin: (${type}, ${inputId}) và có context: ${context}`); 

    try {
        const {id, displayCode, title, createdAt} = await noteFreeWrite(type, inputId, context); 

        return {id, displayCode, title, createdAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}







async function updateLifeLessonReflectionFlow(id, reflection) {
    console.log(`${API_FLOW_LOG} vào hàm update cho life lesson reflection (id: ${id}) với reflection: ${reflection}`); 

    try {
        const {updatedAt} = await updateLifeLessonReflection(id, reflection); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}





async function updatePurposeFlow(id, title, hope, status = "ACTIVE") {
    console.log(`${API_FLOW_LOG} cập nhập cho purpose ${id} với title: ${title}, hope: ${hope}, status: ${status}`); 

    try {
        const {updatedAt} = await updatePurpose(id, title, hope, status); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api: ${err.message}`); 

        throw err; 
    }
}




async function updateActionFlow(purposeId, actionId, context, status) {
    console.log(`${API_FLOW_LOG} cập nhập cho action ${actionId} của purpose ${purposeId} với context: ${context}, status: ${status}`); 

    try {
        const {updatedAt} = await updateAction(purposeId, actionId, context, status); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}





async function addActionFlow(purposeId, context) {
    console.log(`${API_FLOW_LOG} thêm action của purpose ${purposeId} với context: ${context}`); 

    try {
        const {id, createdAt} = await addAction(purposeId, context); 

        return {id, createdAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function updateNoteFlow(id, content, type) {
    console.log(`${API_FLOW_LOG} vào hàm cập nhập ghi chú với nội dung: ${content}, type: ${type}`); 

    try {
        const {title, updatedAt} = await updateNote(id, content, type); 

        return {title, updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}





async function deleteNoteFlow(id) {
    console.log(`${API_FLOW_LOG} xóa note ${id}`); 

    try {
        const {message} = await deleteNote(id); 

        return {message}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
    
}








async function getAllTeachingWordsFlow() {
    console.log(`${API_FLOW_LOG} lấy toàn bộ Lời dạy`); 

    try {
        const {teachingWords} = await getAllTeachingWords(); 

        return {teachingWords}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function getAllLifeLessonsReflectionFlow() {
    console.log(`${API_FLOW_LOG} Lấy toàn bộ bài học`); 

    try {
        const {lifeLessonsReflection} = await getAllLifeLessonsReflection(); 

        return {lifeLessonsReflection}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}





async function getPendingUsersFlow() {
    console.log(`${API_FLOW_LOG} lấy danh sách người dùng đang chờ duyệt`); 

    try {
        const {pendingUsers} = await  getPendingUsers(); 

        return {pendingUsers}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}







async function getRejectedUsersFlow() {
    console.log(`${API_FLOW_LOG} lấy danh sách người dùng bị từ chối`); 

    try {
        const {rejectedUsers} = await  getRejectedUsers(); 

        return {rejectedUsers}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function getUserFlow(id) {
    console.log(`${API_FLOW_LOG} lấy thông tin đầy đủ của người dùng có id: ${id}`); 

    try {
        const user = await getUser(id)

        return user; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}




async function updateUserStatusFlow(id, status) {
    console.log(`${API_FLOW_LOG} cập nhập trạng thái ${status} của user ${id}`);

    try {
        const {updatedAt} = await updateUserStatus(id, status); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}




async function updateTeachingWordFlow(id, title, content, date) {
    console.log(`${API_FLOW_LOG} cập nhập cho lời dạy: ${id}, với title ${title}, content: ${content}, date: ${date}`); 

    try {
        const {updatedAt} = await updateTeachingWord(id, title, content, date); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}



async function getAllLifeLessonsMainFlow() {
    console.log(`${API_FLOW_LOG} vào hàm lấy toàn bộ lời dạy chính của admin`); 

    try {
        const {lifeLessonsMain} = await getAllLifeLessonsMain(); 

        return {lifeLessonsMain}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}






async function getLifeLessonMainFlow(id) {
    console.log(`${API_FLOW_LOG} vào hàm lấy lời dạy chính của admin có id: ${id}`); 

    try {
        const lifeLessonMain = await getLifeLessonMain(id); 

        return lifeLessonMain; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}




async function updateLifeLessonMainFlow(id, mainContent) {
    console.log(`${API_FLOW_LOG} vào hàm cập nhập lời dạy chính của admin có id: ${id}, và nội dung chính cần cập nhập: ${mainContent}`); 

    try {
        const {updatedAt} = await updateLifeLessonMain(id, mainContent); 

        return {updatedAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}



async function addTeachingWordFlow(title, date, content) {
    console.log(`${API_FLOW_LOG} vào hàm thêm lời dạy mới với chủ đề: ${title}, ngày thêm: ${date}, nội dung: ${content}`); 

    try {
        const {id, createdAt} = await addTeachingWord(title, date, content); 

        return {id, createdAt}; 
    } catch (err) {
        console.log(`${API_FLOW_LOG}    1. lỗi ở tầng api flow: ${err.message}`); 

        throw err; 
    }
}

































// ============== 2. RENDER ===============
// hàm mà render toàn bộ trang web từ nguồn sự thật, mình nghĩ là mình sẽ viết pseudo code trước 
async function render() {
    console.log(`${RENDER_LOG} vào hàm lớn render`); 

    // 1. render error 
    if (state.error) {
        renderError(); 

    } else {
        // 1. render page phù hợp
        await renderRoute(); 

        // 2. render ui state như loading, disabled, fabOpen. 
        renderUIState(); 
    }

    

    // câu hỏi đặt ra là render page trước hay render ui state trước? Vì phải có gì đó thì mới có trạng thái của cái đó nên là render page trước. 
}




function renderError() {
    console.log(`${RENDER_LOG}  1. render error: ${state.error}`); 

    alert(state.error); 
}





async function renderRoute() {
    console.log(`${RENDER_LOG}  1. render route cho trang với route: ${JSON.stringify(state.route, null, 2)}`); 


    // Mình nghĩ là làm theo kiểu chia nhánh để dễ kiểm soát hơn
    // 1. ẩn tất cả các trang
    // 2. nếu là trang login hoặc signup thì hiển thị trang 
    // 3. không thì kiểm tra userRole rồi chia nhánh ra, nếu userRole là user thì ok
    // 4. nếu userRole là admin thì ok. 
    hideAllPages(); 

    if (state.route.name === "LOG_IN" || state.route.name === "SIGN_UP") {
        if (state.route.name === "LOG_IN") {
            showLogInPage(); 
        } else {
            showSignUpPage(); 
        }
    } else {
        if (state.route.userRole === "USER") {
            if (state.route.name === "HOME") {
                showUserHomePage(); 
                await renderReflectionTeachingWord(); 
                await renderlatestLifeLessons(); 
                await renderActivePurposes(); 
                await renderUnresolvedNotes(); 



            } else if (state.route.name === "TEACHING_WORDS") {
                showUserTeachingWordsPage(); 
                await renderUserTeachingWordsPage(); 


            } else if (state.route.name === "LIFE_LESSONS") {
                showUserLifeLessonsPage(); 
                await renderUserLifeLessonsPage(); 


            } else {

                showUserEntityPage(); 
                hideAllEntityType(); 
                // tùy thuộc vào entity type mà show và render phù hợp 
                if (state.route.currentEntity.type === "TEACHING_WORD") {
                    showTeachingWordEntity(); 
                    await renderTeachingWordEntity(); 


                } else if (state.route.currentEntity.type === "LIFE_LESSON") {
                    showLifeLessonEntity(); 
                    await renderLifeLessonEntity(); 


                } else if (state.route.currentEntity.type === "PURPOSE") {
                    showPurposeEntity(); 
                    await renderPurposeEntity(); 


                } else if (state.route.currentEntity.type === "NOTE") {
                    showNoteEntity(); 
                    await renderNoteEntity(); 


                }

                await renderBornEntities(); 

            }



        } else {
            if (state.route.name === "HOME") {
                showAdminHomePage(); 
                await renderAdminHomePage(); 


            } else if (state.route.name === "TEACHING_WORDS") {
                showAdminTeachingWordsPage(); 
                await renderAdminTeachingWordsPage(); 


            } else if (state.route.name === "LIFE_LESSONS") {
                showAdminLifeLessonsPage(); 
                await renderAdminLifeLessonsPage(); 


            } else if (state.route.name === "ENTITY"){
                showAdminEntityPage(); 
                hideAllAdminEntityType(); 

                if (state.route.currentEntity.type === "USER") {
                    showAdminUserEntity(); 
                    await renderAdminUserEntity(); 

                } else if (state.route.currentEntity.type === "TEACHING_WORD") {
                    showAdminTeachingWordEntity(); 
                    await renderAdminTeachingWordEntity(); 

                } else if (state.route.currentEntity.type === "LIFE_LESSON") {
                    showAdminLifeLessonEntity(); 
                    await renderAdminLifeLessonEntity(); 

                }
                
            }
        }
    }



}





// hiển thị các trạng thái ui của trang web như loading, error mà trước mắt thì mình sẽ làm với error
function renderUIState() {
    console.log(`${RENDER_LOG}  2. vào hàm render UI state với state.ui: ${JSON.stringify(state.ui, null, 2)}`); 

    renderFabState(); 
    renderOverlayVisible(); 
    renderOverlayEntity(); 
    renderSaveStatus(); 
    renderNoteTypeMenuOpen(); 
}



// các hàm con của renderRoute
function hideAllPages() {
    console.log(`${RENDER_LOG}      1.1 ẩn tất cả các trang`); 

    document.querySelectorAll("[data-page]").forEach(el => el.classList.add("hidden")); 
}


function showLogInPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang login`); 

    document.querySelector('[data-page="LOG_IN"]').classList.remove("hidden"); 
}


function showSignUpPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang signup`); 

    document.querySelector('[data-page="SIGN_UP"]').classList.remove("hidden"); 
}



function showUserHomePage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang user home`); 

    document.querySelector('[data-user-role="USER"] [data-page="HOME"]').classList.remove("hidden"); 
}


function showUserTeachingWordsPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang user teaching words`); 

    document.querySelector('[data-user-role="USER"] [data-page="TEACHING_WORDS"]').classList.remove("hidden"); 
}


function showUserLifeLessonsPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang user life lessons`); 

    document.querySelector('[data-user-role="USER"] [data-page="LIFE_LESSONS"]').classList.remove("hidden"); 
}



function showUserEntityPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang user entity`); 

    document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').classList.remove("hidden"); 
}




function hideAllEntityType() {
    console.log(`${RENDER_LOG}      1.3 ẩn toàn entity type`); 

    document.querySelectorAll('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type]').forEach(el => el.classList.add("hidden"));
}



function showTeachingWordEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị entity lời dạy`); 

    document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="TEACHING_WORD"]').classList.remove("hidden");
}


function showLifeLessonEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị entity bài học`); 

    document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="LIFE_LESSON"]').classList.remove("hidden");
}


function showPurposeEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị entity mục đích`); 

    document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="PURPOSE"]').classList.remove("hidden");
}


function showNoteEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị entity ghi chú`); 

    document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="NOTE"]').classList.remove("hidden");
}












function showAdminHomePage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang admin home`); 

    document.querySelector(`[data-user-role="ADMIN"] [data-page="HOME"]`).classList.remove("hidden"); 
}


function showAdminTeachingWordsPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang admin teaching words`); 

    document.querySelector(`[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"]`).classList.remove("hidden"); 
}



function showAdminLifeLessonsPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang admin life lessons`); 

    document.querySelector(`[data-user-role="ADMIN"] [data-page="LIFE_LESSONS"]`).classList.remove("hidden"); 
}



function showAdminEntityPage() {
    console.log(`${RENDER_LOG}      1.2 hiện trang admin entity`); 

    document.querySelector(`[data-user-role="ADMIN"] [data-page="ENTITY"]`).classList.remove("hidden"); 
}





function hideAllAdminEntityType() {
    console.log(`${RENDER_LOG}      1.3 ẩn tất cả loại entity của admin`); 

    document.querySelectorAll('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type]').forEach(el => el.classList.add("hidden")); 
}





function showAdminUserEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị loại thực thể user của admin`); 

    document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="USER"]').classList.remove("hidden"); 
}



function showAdminTeachingWordEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị loại thực thể lời dạy của admin`); 

    document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="TEACHING_WORD"]').classList.remove("hidden"); 
}



function showAdminLifeLessonEntity() {
    console.log(`${RENDER_LOG}      1.4 hiển thị loại thực thể bài học của admin`); 

    document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="LIFE_LESSON"]').classList.remove("hidden"); 
}
















async function renderReflectionTeachingWord() {
    console.log(`${RENDER_LOG}      1.3 render nội dung của Lời Dạy mới nhất`); 

    state.error = null; 

    try {
        // 1. lấy dữ liệu teaching word 
        // 1.1 lấy id từ server 
        // 1.2 check trong cache, 
        // 1.2.1 nếu không có sẵn thì lấy từ server
        // 1.2.2 nếu có rồi thì lấy từ cache
        const {teachingWord} = await getTeachingWordReflectionFlow(); 

        // console.log(`${RENDER_LOG}      1.3.1 kiểm tra teachingWord: ${JSON.stringify(teachingWord, null, 2)}`); 

        let tw; // Lời dạy đầy đủ 

        if (!ExistsInCache(teachingWord.id, "TEACHING_WORD")) {
            tw = await getTeachingWordFlow(teachingWord.id); 

            // lưu vào cache 
            state.cache.teachingWords[tw.id] = tw; 


        } else {
            // lấy từ cache 
            tw = state.cache.teachingWords[teachingWord.id]; 
        }
        console.log(`${RENDER_LOG}      1.3.2 Lời dạy có nội dung là: ${JSON.stringify(tw, null, 2)}`); 

        // 2. render ra trang web. 
        const twContainer = document.querySelector('[data-user-role="USER"] [data-page="HOME"] .teaching-words-section');
        twContainer.innerHTML = '<h2 class="relative right-4 font-bold mt-4">Mục Lời Dạy</h2>'; 
        twContainer.innerHTML += createTeachingWordCard(tw); 


    } catch(err) {
        state.error = err.message; 
        await render(); 
    }

}



function createTeachingWordCard(teachingWord) {
    console.log(`${RENDER_LOG}          1.3.3 tạo ra nội dung html cho card lời dạy có: ${JSON.stringify(teachingWord, null, 2)}`); 
    // chỗ content phải là bản tóm tắt của nó mới hợp lí 
    return `<div class="teaching-word-card card mt-4 shadow-md bg-white rounded-4xl">
                                <div class="card-body relative">
                                    <h1 class="card-title text-2xl">${teachingWord.title}</h1>
                                    <h2 class="text-xl">${teachingWord.displayCode}</h2>
                                    <p class="whitespace-pre-wrap mt-4 line-clamp-[22]">${teachingWord.content}</p>


                                    <p class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-white flex items-end justify-center rounded-3xl">
                                        <button data-id="${teachingWord.id}" class="btn btn-outline flex gap-2 mb-6 font-bold text-lg items-center">
                                            <div class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <p>xem thêm</p>
                                        </button>
                                    </p>
                                </div>
                            </div>`
}
  





function ExistsInCache(id, type) {
    console.log(`${RENDER_LOG}          1.3.1 hàm kiểm tra (${type}, ${id}) có nằm trong cache rồi hay không?`); 


    if (type === "TEACHING_WORD") {
        const tw = state.cache.teachingWords[id]; 

        if (!tw) {
            return false; 
        } 

        return true; 


    } else if (type === "LIFE_LESSON_REFLECTION") {
        const ll = state.cache.lifeLessonsReflection[id]; 

        if (!ll) {
            return false; 
        } 

        return true; 

    } else if (type === "LIFE_LESSON_MAIN") {
        const ll = state.cache.lifeLessonsMain[id]; 

        if (!ll) {
            return false; 
        } 

        return true; 

    } else if (type === "PURPOSE") {
        const p = state.cache.purposes[id]; 

        if (!p) {
            return false; 
        } 

        return true; 

        
    } else if (type === "NOTE") {
        const n = state.cache.notes[id]; 

        if (!n) {
            return false; 
        } 

        return true; 

    } else if (type === "USER") {
        const u = state.cache.users[id]; 

        if (!u) {
            return false; 
        } 

        return true; 

    } else if (type === "RELATION") {
        // 
    } else {
        return false; 
    }
}











async function renderlatestLifeLessons() {
    console.log(`${RENDER_LOG}      1.4 render nội dung bài học cuộc sống update gần nhất`); 

    state.error = null; 

    // 1. lấy dữ liệu life lesson từ server 
    // 1.1 lấy id từ server
    // 1.2 check trong cache 
    // 1.2.1 nếu bất cứ cái nào không có trong cache thi lấy từ server rồi thêm vào cache
    // 1.2.2 nếu có rồi thì không làm gì 

    // 2. render ra DOM card lifel lesson với nội dung đã lấy được. 
    try {
        const {lifeLessonsReflection} = await getLifeLessonsReflectionReflectionFlow(); 

        // console.log(`${RENDER_LOG}      1.4.1 Life lessons reflection:${JSON.stringify(lifeLessonsReflection, null, 2)}`); 

        for (let ll of lifeLessonsReflection) {
            if (!ExistsInCache(ll.id, "LIFE_LESSON_REFLECTION")) {
                state.cache.lifeLessonsReflection[ll.id] = await getLifeLessonReflectionFlow(ll.id); 
            }
        }


        const llContainer = document.querySelector('[data-user-role="USER"] [data-page="HOME"] .life-lessons-section');
        llContainer.innerHTML = '<h2 class="relative right-4 font-bold mt-4 mb-10">Mục Bài Học</h2>';
        for (let ll of lifeLessonsReflection) {
            let lifeLessonFull = state.cache.lifeLessonsReflection[ll.id]; 

            llContainer.innerHTML += createLifeLessonReflectionCard(lifeLessonFull); 
        }

    } catch (err) {
        state.error = err.message; 

        console.log(`${RENDER_LOG}  1. lỗi ở tầng render: ${state.error}`); 

        await render(); 
    }


    

}


function createLifeLessonReflectionCard(lifeLessonFull) {
    return `<div class="card mb-48 shadow-md bg-white rounded-4xl">
                                <div class="card-body relative">
                                    <h1 class="card-title text-2xl">${lifeLessonFull.title}</h1>
                                    <h3 class="mt-4 font-semibold">Nội dung chính</h3>
                                    <p class="whitespace-pre-wrap line-clamp-[22]">${lifeLessonFull.mainContent}</p>

                                    
                                    <p class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-white flex items-end justify-center rounded-3xl">
                                        <button data-id="${lifeLessonFull.id}" class="btn btn-outline flex gap-2 mb-6 font-bold text-lg items-center">
                                            <div class="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <p>Xem thêm</p>
                                        </button>
                                    </p>
                                </div>
                            </div>`
}










// ----- HÀM RENDER MỤC ĐÍCH TRONG TRANG HOME USER ------
async function renderActivePurposes() {
    console.log(`${RENDER_LOG}      1.5 render tất cả mục đích trong trang home user`); 

    state.error = null; 

    // 1. lấy id của toàn bộ mục đích có trạng thái active
    // 2. kiểm tra cache đã có từng mục đích đó chưa?
    // 2.1 nếu không có thì lấy nội dung đầy đủ, lấy actions của nó và cập nhập phù hợp vào cache (đã ghi cấu trúc trong README.md)
    // 3. render DOM thôi 
    try {
        const {activePurposes} = await getActivePurposesFlow(); 

        for (let p of activePurposes) {
            if (!ExistsInCache(p.id, "PURPOSE")) {
                const purpose = await getPurposeFlow(p.id); console.log(`${RENDER_LOG}          1.5.1 purpose là: ${JSON.stringify(purpose, null, 2)}`); 
                const {actions} = await getActionsFlow(p.id); console.log(`${RENDER_LOG}            1.5.2 actions là: ${JSON.stringify(actions, null, 2)}`); 
                const numIncompleteActions = actions.filter(action => action.status === "INCOMPLETE").length; 

                purpose.actions = actions; 
                purpose.numIncompleteActions = numIncompleteActions; 

                state.cache.purposes[p.id] = purpose; 
            }
        }

        
        const purposesContainer = document.querySelector('[data-user-role="USER"] [data-page="HOME"] .purposes-section'); 
        purposesContainer.innerHTML = '<h2 class="relative right-4 font-bold mt-4 mb-10">Mục Mục đích</h2>'; 
        for (let p of activePurposes) {
            const purpose = state.cache.purposes[p.id]; 
            purposesContainer.innerHTML += createPurposeCard(purpose); 
        }


    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.5.2 lỗi ở tầng render: ${state.error}`); 
        await render(); 
    }
}




function createPurposeCard(purpose) {
    console.log(`${RENDER_LOG}          1.5.1 tạo nội dung html cho card purpose là ${JSON.stringify(purpose, null, 2)}`); 

    const noteContent = (purpose.numIncompleteActions === 0) ? "Không có hành động chưa trọn vẹn nào" : `Có ${purpose.numIncompleteActions} hành động chưa trọn vẹn`; 

    return `<div data-id="${purpose.id}" class="card mb-36 shadow-md bg-white rounded-4xl">
                                <div class="card-body">
                                    <h1 class="card-title text-xl whitespace-pre-wrap">${purpose.title}</h1>
                                    <div class="flex gap-1 font-light items-center">
                                        <div class="note-content text-sm">
                                            ${noteContent}
                                        </div>
                                        <div class="note-icon text-xl text-red-500">
                                            *
                                        </div>
                                    </div>
                                    <p class="whitespace-pre-wrap mt-2">${purpose.hope}</p>
                                </div>
                            </div>`; 
}





async function renderUnresolvedNotes() {
    console.log(`${RENDER_LOG}  1.6 vào hàm render thắc mắc chưa được giải đáp trong note`); 

    // 1. lấy tất cả note unresolved 
    // 1.1 kiểm tra xem trong các note đó thì note nào chưa có trong cache
    // 1.1.1 nếu không có thì lấy từ server và lưu thích hợp vào cache
    // 2. render ra DOM 

    state.error = null; 

    try {
        const {unresolvedNotes} = await getUnresolvedNotesFlow(); 
        
        // console.log(`${RENDER_LOG}          1.6.1 unresolvedNotes là: ${JSON.stringify(unresolvedNotes, null, 2)}`); 

        for (let n of unresolvedNotes) {
            // console.log(`${RENDER_LOG}          1.6.2 n is ${JSON.stringify(n, null, 2)}`); 
            if (!ExistsInCache(n.id, "NOTE")) {
                const note = await getNoteFlow(n.id); 

                state.cache.notes[n.id] = note; 
            }
        }

        

        const noteContainer = document.querySelector('[data-user-role="USER"] [data-page="HOME"] .notes-section'); 
        noteContainer.innerHTML = '<h2 class="relative right-4 font-bold mt-4 mb-10">Mục Ghi Chú</h2>'; 
        for (let n of unresolvedNotes) {
            const note = state.cache.notes[n.id]; 
            noteContainer.innerHTML += createNoteCard(note); 
        } 
    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}      1.6.9 lỗi ở tầng render: ${err.message}`); 

        await render(); 
    }
}




function createNoteCard(note) {
    console.log(`${RENDER_LOG}          1.6.1 tạo nội dung html cho card note: ${JSON.stringify(note, null, 2)}`); 

    return `<div data-id="${note.id}" class="card mb-48 shadow-md bg-white rounded-4xl">
                                <div class="card-body relative">
                                    <h1 class="card-title text-2xl font-semibold">${note.title}</h1>
                                    <p class="whitespace-pre-wrap">${note.content}</p>

                                    <p class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-white flex items-end justify-center rounded-full">
                                    </p>
                                </div>
                            </div>`; 
}






// HÀM RENDER CHO THỰC THỂ LỜI DẠY
async function renderTeachingWordEntity() {
    console.log(`${RENDER_LOG}      1.5 render nội dung cho trang thực thể lời dạy`); 


    try {
        // 1. render ra thôi, nhưng trước đó cần lấy teachingWord từ cache (do vào tới thực thể thì thường là đã có rồi. Hãy vẫn luôn cần check để đảm bảo)
        const twId = state.route.currentEntity.id; 

        // console.log(`🪛🪛🪛: twId is ${twId}`); 

        if (!ExistsInCache(twId, "TEACHING_WORD")) {
            const teachingWordServer = await getTeachingWordFlow(twId); 

            // console.log(`🪛🪛🪛: teachingWordServer is: ${teachingWordServer}`); 

            state.cache.teachingWords[twId] = teachingWordServer; 
        } 

        // console.log(`🪛🪛🪛: state.cache.teachingWords[twId] is ${JSON.stringify(state.cache.teachingWords[twId], null, 2)}`); 

        const teachingWord = state.cache.teachingWords[twId]; 


        const container = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="TEACHING_WORD"]`); 
        container.innerHTML = ""; 
        container.innerHTML += createTeachingWordEntity(teachingWord); 
    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.5.1 lỗi ở tầng render: ${state.error}`); 

        await render(); 
    }


}







function createTeachingWordEntity(teachingWord) {
    console.log(`${RENDER_LOG}              1.5.1.1 tạo ra nội dung của thực thể teaching word có: ${JSON.stringify(teachingWord, null, 2)}`); 

    return `<h1 class="text-3xl">${teachingWord.title}</h1>
                        <div class="mt-8 text-xl whitespace-pre-wrap">${teachingWord.content}</div>
                    
                    
                    
                        <button class="floating-action-button-open-btn fixed bottom-32 right-14 btn btn-circle btn-lg btn-outline bg-white opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>

                        
                        <div class="floating-action-button-close z-50 fixed bottom-32 right-14 flex flex-col gap-20 items-end hidden">
                            <div class="flex items-center relative left-4">
                                <div class="relative top-4 text-2xl font-semibold">tạo mục đích</div>

                                <button data-action="purpose-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/purpose.png" alt="tạo mục đích" class="w-20">
                                </button>
                            </div>

                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">tạo ghi chú</div>

                                <button data-action="note-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/note.png" alt="tạo ghi chép" class="w-16 opacity-75">
                                </button>
                            </div>

                            <button class="floating-action-button-close-btn btn btn-circle btn-lg btn-ghost bg-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>`
}













async function renderLifeLessonEntity() {
    console.log(`${RENDER_LOG}      1.6 render thực thể bài học`); 

    state.err = null; 
    
    try {
        // 1. lấy thực thể bài học 
        // 2. kiểm tra xem đã có trong cache hay chưa?
        // 2.1 nếu chưa thì gọi từ server
        // 3. render ra DOM 

        const llId = state.route.currentEntity.id; 

        if (!ExistsInCache(llId, "LIFE_LESSON_REFLECTION")) {
            const lifeLessonServer = await getLifeLessonReflectionFlow(llId); 

            state.cache.lifeLessonsReflection[llId] = lifeLessonServer; 
        }

        const lifeLesson = state.cache.lifeLessonsReflection[llId]; 


        const container = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="LIFE_LESSON"]'); 
        container.innerHTML = ""; 
        container.innerHTML += createLifeLessonEntity(lifeLesson); 

    } catch (err) {
        state.error = err.message; 

        console.log(`${RENDER_LOG}          1.6.9 lỗi ở tầng render: ${err.message}`); 
        await render(); 
    }
        
}







function createLifeLessonEntity(lifeLesson) {
    return `<h1 class="text-3xl">${lifeLesson.title}</h1>
                        <h3 class="mt-8 text-xl font-semibold">Nội dung chính</h3>
                        <div class="mt-2 text-xl whitespace-pre-wrap">${lifeLesson.mainContent}</div>
                        <div class="divider"></div>
                        <h3 class="mt-8 text-xl font-semibold flex gap-4">
                            Nhận biết cá nhân
                            <div class="edit-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                        </h3>
                        <div data-content-type="reflection" contenteditable="true" class="mt-2 text-xl outline-none whitespace-pre-wrap">${lifeLesson.reflection}</div>
                    
                        

                        <button class="floating-action-button-open-btn fixed bottom-32 right-14 btn btn-circle btn-lg btn-outline bg-white opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>

                        
                        <div class="floating-action-button-close z-50 fixed bottom-32 right-14 flex flex-col gap-20 items-end hidden">
                            <div class="flex items-center relative left-4">
                                <div class="relative top-4 text-2xl font-semibold">tạo mục đích</div>

                                <button data-action="purpose-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/purpose.png" alt="tạo mục đích" class="w-20">
                                </button>
                            </div>

                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">tạo ghi chú</div>

                                <button data-action="note-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/note.png" alt="tạo ghi chép" class="w-16 opacity-75">
                                </button>
                            </div>

                            <button class="floating-action-button-close-btn btn btn-circle btn-lg btn-ghost bg-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>`
}



// hàm render thực thể mục đích 
async function renderPurposeEntity() {
    console.log(`${RENDER_LOG}      1.6 vào hàm render thực thể mục đích của user`); 

    // 1. lấy id của purpose 
    // 2. check trong cache có chưa
    // 2.1 nếu chưa thì lấy từ server và bỏ vào cache phù hợp. 
    state.error = null; 

    // 3. render ra DOM 
    try {
        const purposeId = state.route.currentEntity.id; 

        if (!ExistsInCache(purposeId, "PURPOSE")) {
            const purposeServer = await getPurposeFlow(purposeId); 
            const {actions} = await getActionsFlow(purposeId); 
            const numIncompleteActions = actions.filter(action => action.status === "INCOMPLETE").length;

            

            purposeServer.actions = actions; 
            purposeServer.numIncompleteActions = numIncompleteActions; 

            state.cache.purposes[purposeId] = purposeServer; 
        }


        
        const purpose = state.cache.purposes[purposeId];
        const container = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="PURPOSE"]');
        container.innerHTML = "";
        container.innerHTML += createPurposeEntity(purpose);

        console.log("BUG: trước lỗi"); 
        // thêm actions 
        const completeActionsContainer = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="PURPOSE"] .complete-actions');
        const completeActions = purpose.actions.filter(action => action.status === "COMPLETE");
        completeActionsContainer.innerHTML = "";
        for (let action of completeActions) {
            completeActionsContainer.innerHTML += createCompleteAction(action);
        }
        console.log("BUG: sau lỗi");

        const incompleteActionsContainer = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="PURPOSE"] .incomplete-actions');
        const incompleteActions = purpose.actions.filter(action => action.status === "INCOMPLETE");
        incompleteActionsContainer.innerHTML = "";
        for (let action of incompleteActions) {
            incompleteActionsContainer.innerHTML += createIncompleteAction(action);
        }


        
    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.9 lỗi ở tầng render: ${err.message}`); 

        await render(); 
    }
}




function createPurposeEntity(purpose) {
    
    return `<h1 data-content-type="title" class="text-2xl outline-none whitespace-pre-wrap" contenteditable="true">${purpose.title}</h1>
                        <h2 class="mt-4 text-lg">
                            <span class="font-semibold">Hy vọng:</span>
                            <span data-content-type="hope" contenteditable="true" class="outline-none whitespace-pre-wrap">${purpose.hope}</span>
                        </h2>
                        <div class="divider"></div>
                        <h3 class="font-semibold mt-8 text-lg">Hành động</h3>
                        <div class="px-8">
                            <h5 class="font-light text-center mt-6">Trọn vẹn</h5>
                            <div class="complete-actions flex flex-col gap-4 mt-4">

                            </div>







                            <h5 class="font-light text-center mt-16">Chưa trọn vẹn</h5>
                            <div class="incomplete-actions flex flex-col gap-4 mt-4">

                            </div>
                        </div>



                        <button class="floating-action-button-open-btn fixed bottom-32 right-14 btn btn-circle btn-lg btn-outline bg-white opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                        
                        <div class="floating-action-button-close z-50 fixed bottom-32 right-14 flex flex-col gap-20 items-end hidden">
                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">tạo hành động</div>

                                <button data-action="action-add" class="action btn btn-ghost btn-sm">
                                    <img src="/image/action.png" alt="tạo ghi chép" class="w-16 opacity-70">
                                </button>
                            </div>

                            <div class="flex items-center relative left-4">
                                <div class="relative top-4 text-2xl font-semibold">tạo mục đích</div>

                                <button data-action="purpose-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/purpose.png" alt="tạo mục đích" class="w-20">
                                </button>
                            </div>

                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">tạo ghi chú</div>

                                <button data-action="note-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/note.png" alt="tạo ghi chép" class="w-16 opacity-75">
                                </button>
                            </div>

                            <button class="floating-action-button-close-btn btn btn-circle btn-lg btn-ghost bg-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>`;
}






function createCompleteAction(action) {
    return `<div class="flex flex-row gap-4 p-2 items-center rounded-2xl border border-green-300">
                                    <button data-id="${action.id}" class="btn action-icon btn-ghost">
                                        <img src="/image/hiking.png" alt="Đang leo núi" class="w-8">
                                    </button>
                                    <div data-content-type="action-${action.id}" contenteditable="true" class="action-context outline-none">${action.context}</div>
                                </div>`;
}






function createIncompleteAction(action) {
    return `<div class="flex flex-row gap-4 p-2 items-center rounded-2xl border border-yellow-300">
                                    <button data-id="${action.id}" class="btn action-icon btn-ghost">
                                        <img src="/image/summit.png" alt="Đang leo núi" class="w-8">
                                    </button>
                                    <div data-content-type="action-${action.id}" contenteditable="true" class="action-context outline-none">${action.context}</div>
                                </div>`;
}












// ------- HÀM RENDER THỰC THỂ GHI CHÚ CỦA USER --------
async function renderNoteEntity() {
    console.log(`${RENDER_LOG}      1.6 render thực thể ghi chú của user`); 

    // 1. lấy id của note 
    // 2. check trong cache có chưa
    // 2.1 nếu chưa thì lấy từ server và bỏ vào cache phù hợp. 
    state.error = null; 

    // 3. render ra DOM 
    try {
        const noteId = state.route.currentEntity.id; 

        if (!ExistsInCache(noteId, "NOTE")) {
            const noteServer = await getNoteFlow(noteId); 

            state.cache.notes[noteId] = noteServer; 
        }

        const note = state.cache.notes[noteId]; 
        const container = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="NOTE"]'); 
        container.innerHTML = ""; 
        container.innerHTML += createNoteEntity(note); 

    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.9 lỗi ở tầng render: ${err.message}`); 

        await render(); 
    }
}




function createNoteEntity(note) {
    let noteTypeDisplay = ""; 
    let noteTypeBadge = ""; 

    if (note.type === "NONE") {
        noteTypeDisplay = "Chưa xác định"; 
        noteTypeBadge = "badge-neutral"; 

    } else if (note.type === "UNRESOLVED") {
        noteTypeDisplay = "Mâu thuẫn"; 
        noteTypeBadge = "badge-error"; 
        
    } else if (note.type === "EXPERIENCED") {
        noteTypeDisplay = "Trải nghiệm"; 
        noteTypeBadge = "badge-success"; 
        
    } else if (note.type === "INSIGHT") {
        noteTypeDisplay = "Nhận biết"; 
        noteTypeBadge = "badge-warning"; 
        
    }


    return `<div class="flex justify-between">
                            <div class="flex gap-0 text-xl font-base"><span>${note.displayCode}</span></div>
                            <div class="note-type relative">
                                <div class="note-type-selected badge ${noteTypeBadge} badge-outline badge-lg text-lg px-10 py-4">${noteTypeDisplay}</div>
                                <div id="note-type-menu" class="hidden absolute mt-1 text-sm rounded-lg bg-[#FAFAF7] w-full text-gray-700">
                                    <div data-note-type="INSIGHT" class="option p-1 border-t border-x border-gray-400 w-full rounded-t-lg pl-2 pt-2">Nhận biết</div>
                                    <div data-note-type="EXPERIENCED" class="option p-1 border-t border-x border-gray-400 w-full pl-2">Trải nghiệm</div>
                                    <div data-note-type="UNRESOLVED" class="option p-1 border-t border-x border-gray-400 w-full pl-2">Mâu thuẫn</div>
                                    <div data-note-type="NONE" class="option p-1 border border-gray-400 w-full rounded-b-lg pl-2 pb-2">Chưa xác định</div>
                                </div>
                            </div>
                            

                        </div>
                        <div data-content-type="content" class="outline-none text-2xl mt-16 whitespace-pre-wrap" contenteditable="true">${note.content}</div>


                        <button class="floating-action-button-open-btn fixed bottom-32 right-14 btn btn-circle btn-lg btn-outline bg-white opacity-25">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>

                        <div class="floating-action-button-close z-50 fixed bottom-32 right-14 flex flex-col gap-20 items-end hidden">
                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">Xóa ghi chú</div>

                                <button data-action="note-delete" class="action btn btn-ghost btn-sm">
                                    <img src="/image/delete-document.png" alt="tạo ghi chép" class="w-16 opacity-70">
                                </button>
                            </div>

                            <div class="flex items-center relative left-4">
                                <div class="relative top-4 text-2xl font-semibold">tạo mục đích</div>

                                <button data-action="purpose-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/purpose.png" alt="tạo mục đích" class="w-20">
                                </button>
                            </div>

                            <div class="flex items-center relative left-2">
                                <div class="relative top-4 text-2xl font-semibold">tạo ghi chú</div>

                                <button data-action="note-free-write" class="action btn btn-ghost btn-sm">
                                    <img src="/image/note.png" alt="tạo ghi chép" class="w-16 opacity-75">
                                </button>
                            </div>

                            <button class="floating-action-button-close-btn btn btn-circle btn-lg btn-ghost bg-zinc-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
`; 
}














// -------- hàm render các thực thể sinh ra từ thực thể hiện tại --------
async function renderBornEntities() {
    console.log(`${RENDER_LOG}      1.6 render preview các thực thể sinh ra từ thực thể hiện tại: (${state.route.currentEntity.type}, ${state.route.currentEntity.id})`); 

    state.error = null; 


    try {
        // cần có type, id của thực thể sinh ra của thực thể hiện tại
        // cần có nội dung của type, id của các thực thể sinh ra. 

        const currEntity = state.route.currentEntity; 

        const keyNameInRelations = `${currEntity.type}-${currEntity.id}`; 

        // kiểm tra đã có trong cache chưa, nếu chưa thì gọi từ server 
        const bornEntities = state.cache.relations.born[keyNameInRelations]; 

        // console.log(`BUG: from cache | bornEntities: ${JSON.stringify(bornEntities, null, 2)}`); 


        if (!bornEntities) {
            // console.log(`BUG: các thực thể sinh ra chưa có trong cache`); 
            const {born} = await getBornEntitiesFlow(currEntity.type, currEntity.id); 

            // console.log(`BUG: born: ${JSON.stringify(born, null, 2)}`); 

            const notes = born.filter(e => e.type === "NOTE").map(
                e => ({
                    id: e.id
                })
            ); 

            const purposes = born.filter(e => e.type === "PURPOSE").map(
                e => ({
                    id: e.id
                })
            ); 

            // bỏ origin vào với các thực thể này. 
            for (let p of purposes) {
                const key = `PURPOSE-${p.id}`; 
                state.cache.relations.origin[key] = currEntity; 
            } 

            for (let n of notes) {
                const key = `NOTE-${n.id}`; 
                state.cache.relations.origin[key] = currEntity; 
            }



            state.cache.relations.born[keyNameInRelations] = {
                notes: [], 
                purposes: []
            }

            state.cache.relations.born[keyNameInRelations].notes = notes; 
            state.cache.relations.born[keyNameInRelations].purposes = purposes; 
        }

        // kiểm tra từng cái đã có trong cache chưa
        const notes = state.cache.relations.born[keyNameInRelations].notes; 
        const purposes = state.cache.relations.born[keyNameInRelations].purposes; 


        console.log(`BUG: end result | notes: ${JSON.stringify(notes, null, 2)}, purposes: ${JSON.stringify(purposes, null, 2)}`); 

        for (let n of notes) {
            if (!ExistsInCache(n.id, "NOTE")) {
                const note = await getNoteFlow(n.id); 

                state.cache.notes[n.id] = note; 
            }
        }

        for (let p of purposes) {
            if (!ExistsInCache(p.id, "PURPOSE")) {
                const purpose = await getPurposeFlow(p.id);
                const {actions} = await getActionsFlow(p.id); 
                const numIncompleteActions = actions.filter(action => action.status === "INCOMPLETE").length;

                

                purpose.actions = actions; 
                purpose.numIncompleteActions = numIncompleteActions; 

                state.cache.purposes[p.id] = purpose; 
            }
        }

        // render thực sự lên phần born entities 
        const purposeContainer = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] .drawer-side .purposes'); 
        purposeContainer.innerHTML = ""; 
        for (let p of purposes) {
            const purpose = state.cache.purposes[p.id]; 

            // console.log(`BUG: p is ${JSON.stringify(p, null, 2)}, purpose is ${JSON.stringify(purpose, null, 2)}`); 

            purposeContainer.innerHTML += createPurposePreviewCard(purpose);
        }
        

        const noteContainer = document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] .drawer-side .notes'); 
        noteContainer.innerHTML = ""; 
        for (let n of notes) {
            const note = state.cache.notes[n.id]
            noteContainer.innerHTML += createNotePreviewCard(note);
        }
    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
    
}




function createPurposePreviewCard(purpose) {
    console.log(`${RENDER_LOG}          1.6.8 tạo thẻ preview mục đích với: ${JSON.stringify(purpose, null, 2)}`); 

    return `<div data-id="${purpose.id}" class="card bg-white rounded-4xl border-2 border-red-200">
                                <div class="card-body">
                                    <h3 class="card-title text-xl whitespace-pre-wrap">${purpose.title}</h3>
                                </div>
                            </div>`
}



function createNotePreviewCard(note) {
    console.log(`${RENDER_LOG}          1.6.9 tạo thẻ preview ghi chép với ${JSON.stringify(note, null, 2)}`); 

    return `<div data-id="${note.id}" class="card bg-white rounded-4xl border-2 border-green-200">
                                <div class="card-body relative">
                                    <h3 class="card-title text-2xl font-semibold">${note.title}</h3>
                                </div>
                            </div>`; 
}











// ----------- ROUTE: USER TEACHING WORD ----------
async function renderUserTeachingWordsPage() {
    console.log(`${RENDER_LOG} render trang LC của user`); 

        
    state.error = null; 


    try {
        // làm gì? 
        // 1. lấy tất cả lời dạy 
        // 2. check từng cái đã có trong cache chưa, nếu chưa thì gọi từ server
        // 3. render ra DOM phù hợp. 
        const {teachingWords} = await getAllTeachingWordsFlow(); 

        const tws = teachingWords; 

        for (let tw of tws) {
            if (!ExistsInCache(tw.id, "TEACHING_WORD")) {
                const teachingWordServer = await getTeachingWordFlow(tw.id); 

                state.cache.teachingWords[tw.id] = teachingWordServer; 
            }
        }
        
        // render ra DOM như thế nào? 
        // 1. tạo ra một dữ liệu trung gian dạng 2 tầng để sử dụng cho render vì dữ liệu hiển thị có 2 tầng. 
        // 1.1 tạo thành groups
        const groups = {}; 

        for (const tw of tws) {
            const teachingWord = state.cache.teachingWords[tw.id]; 

            const week = Number(teachingWord.displayCode.slice(3, 5)); 

            if (!groups[week]) {
                groups[week] = []; 
            } 

            groups[week].push(teachingWord.id); 
        }

        console.log(`BUG: groups lúc này: ${JSON.stringify(groups, null, 2)}`); 

        
        // 1.2 chuyển object thành array 
        const teachingWordsByWeek = []; 

        for (const week in groups) {

            teachingWordsByWeek.push({
                week: Number(week), 
                ids: groups[week]
            });
        }

        teachingWordsByWeek.sort((a, b) => b.week - a.week); 

        state.cache.teachingWordsByWeek = teachingWordsByWeek; 


        // 2. sử dụng cho render. Render như thế nào? 
        const container = document.querySelector('[data-user-role="USER"] [data-page="TEACHING_WORDS"] .drawer .drawer-content .content');
        container.innerHTML = '<h1 class="text-2xl font-semibold text-center">Năm <span>2026</span>: <span>Năm chạy như ngựa</span></h1>'; 

        for (let week of state.cache.teachingWordsByWeek) {
            container.innerHTML += createTeachingWordsByWeek(week); 
        }



    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }

}






function createTeachingWordsByWeek(week) {
    let result = `<h3 class="text-lg font-semibold mt-4">Tuần <span>${week.week}</span></h3> <div class="flex flex-col gap-6 text-lg mt-4">`; 

    for (let twId of week.ids) {
        const teachingWord = state.cache.teachingWords[twId]; 

        result += createTeachingWordMiniCard(teachingWord); 
    }

    result += `</div>`; 

    return result; 
}



function createTeachingWordMiniCard(teachingWord) {
    return `<div data-id="${teachingWord.id}" class="mini-card min-h-28 bg-white p-4 rounded-xl font-semibold"><span class="mr-2 font-normal opacity-50">${teachingWord.displayCode}:</span> ${teachingWord.title}</div>`; 
}









// -------------- ROUTE: USER - LIFE LESSONS ---------------------
async function renderUserLifeLessonsPage() {
    console.log(`${RENDER_LOG} render trang bài học của user`); 


    state.error = null; 


    try {
        // 1. lấy toàn bộ life lessons reflection 
        const {lifeLessonsReflection} = await getAllLifeLessonsReflectionFlow(); 

        const lls = lifeLessonsReflection; 


        // 2. kiểm tra có trong cache chưa, nếu chưa thì lấy rồi load ra DOM 
        const container = document.querySelector(`[data-user-role="USER"] [data-page="LIFE_LESSONS"] .drawer .drawer-content .content`); 
        container.innerHTML = ""; 

        for (let ll of lls) {
            if (!ExistsInCache(ll.id, "LIFE_LESSON_REFLECTION")) {
                const lifeLesson = await getLifeLessonReflection(ll.id); 

                state.cache.lifeLessonsReflection[ll.id] = lifeLesson; 
            }

            const lifeLessonReflection = state.cache.lifeLessonsReflection[ll.id]; 

            container.innerHTML += createLifeLessonReflectionMiniCard(lifeLessonReflection); 

            await delay(65); // chờ 65ms
        }

        


        

    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
}





function createLifeLessonReflectionMiniCard(lifeLesson) {
    return `<div data-id="${lifeLesson.id}" class="mini-card flex justify-center items-center bg-white rounded-xl min-h-20 text-xl font-semibold px-4 text-center">${lifeLesson.title}</div>`;
}






// =========== ROUTE: ADMIN HOME ===========
async function renderAdminHomePage() {
    console.log(`${RENDER_LOG}      1.3 render trang admin home`); 

    state.error = null; 


    try {
        // làm gì? 
        // 1. lấy các user pending và user rejected
        const {pendingUsers} = await getPendingUsersFlow(); 
        const {rejectedUsers} = await getRejectedUsersFlow(); 


        // 2. nếu chưa có trong cache thì lấy từ server 
        for (let pu of pendingUsers) {
            if (!ExistsInCache(pu.id, "USER")) {
                const userServer = await getUserFlow(pu.id); 

                state.cache.users[pu.id] = userServer; 
            }
        }

        for (let ru of rejectedUsers) {
            if (!ExistsInCache(ru.id, "USER")) {
                const userServer = await getUserFlow(ru.id); 

                state.cache.users[ru.id] = userServer; 
            }
        }



        // 3. render ra DOM 
        const pendingContainer = document.querySelector('[data-user-role="ADMIN"] [data-page="HOME"] .drawer-content .pending-users');
        pendingContainer.innerHTML = ""; 

        for (let pu of pendingUsers) {
            const user = state.cache.users[pu.id]; 

            pendingContainer.innerHTML += createUserCard(user); 
        }



        const rejectedContainer = document.querySelector('[data-user-role="ADMIN"] [data-page="HOME"] .drawer-content .rejected-users');
        rejectedContainer.innerHTML = ""; 

        for (let ru of rejectedUsers) {
            const user = state.cache.users[ru.id]; 

            rejectedContainer.innerHTML += createUserCard(user); 
        }


        



    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
}






function createUserCard(user) {
    return `<div class="user p-4 flex flex-col gap-2 border border-black rounded-lg">
                                <div class="font-semibold text-lg">${user.fullname}</div>
                                <div class="font-semibold text-lg">${user.email}</div>
                                <div class="action flex justify-between items-center">
                                    <div class="helper font-light text-sm">Xem chi tiết</div>
                                    <button data-id="${user.id}" class="icon btn btn-sm btn-ghost">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>`; 
}









async function renderAdminTeachingWordsPage() {
    console.log(`${RENDER_LOG}      1.3 render trang lời dạy của admin`); 

    state.error = null; 


    try {
        // 1. lấy toàn bộ lời dạy
        const {teachingWords} = await getAllTeachingWordsFlow(); 
        const tws = teachingWords; 

        for (let tw of tws) {
            if (!ExistsInCache(tw.id, "TEACHING_WORD")) {
                const teachingWordServer = await getTeachingWordFlow(tw.id); 

                state.cache.teachingWords[tw.id] = teachingWordServer; 
            }
        }

        // 2. render ra DOM 
        const container = document.querySelector('[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"] .teaching-words'); 
        container.innerHTML = ""; 

        for (let tw of tws) {
            const teachingWord = state.cache.teachingWords[tw.id]; 

            container.innerHTML += createAdminTeachingWordMiniCard(teachingWord); 
        }

    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }

}



function createAdminTeachingWordMiniCard(teachingWord) {
    return `<div data-id="${teachingWord.id}" class="teaching-word min-h-24 border-2 border-black rounded-lg p-2 text-lg px-4 shadow-sm">
                                <span class="mr-2 font-light">${teachingWord.displayCode}</span> ${teachingWord.title}
                            </div>`; 
}






async function renderAdminLifeLessonsPage() {
    console.log(`${RENDER_LOG}      1.3 render trang bài học của admin`); 

    state.error = null; 


    try {
        // 1. lấy toàn bộ bài học chính 
        // 2. check trong caches, nếu chưa có thì lấy từ server 
        // 3. render ra DOM 

        const {lifeLessonsMain} = await getAllLifeLessonsMainFlow(); 
        const llms = lifeLessonsMain; 

        for (let llm of llms) {
            if (!ExistsInCache(llm.id, "LIFE_LESSON_MAIN")) {
                const lifeLessonMainServer = await getLifeLessonMainFlow(llm.id); 

                state.cache.lifeLessonsMain[llm.id] = lifeLessonMainServer; 
            }
        }


        const container = document.querySelector('[data-user-role="ADMIN"] [data-page="LIFE_LESSONS"] .life-lessons'); 
        container.innerHTML = ""; 

        for (let llm of llms) {
            const lifeLessonMain = state.cache.lifeLessonsMain[llm.id]; 

            container.innerHTML += createAdminLifeLessonMainMiniCard(lifeLessonMain); 
        }

    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
}







function createAdminLifeLessonMainMiniCard(lifeLessonMain) {
    return `<button data-id="${lifeLessonMain.id}" class="life-lesson btn btn-outline w-full min-h-20 text-lg">${lifeLessonMain.title}</button>`
}
















async function renderAdminUserEntity() {
    console.log(`${RENDER_LOG}      1.4 render trang thực thể user của admin`); 

    state.error = null; 


    try {
        // 1. lấy user, nếu không có trong cache thì lấy từ server 
        // 2. render ra DOM 
        const userEntity = state.route.currentEntity; 

        if (!ExistsInCache(userEntity.id, "USER")) {
            const userServer = await getUserFlow(userEntity.id); 

            state.cache.users[userEntity.id] = userServer; 
        }

        const user = state.cache.users[userEntity.id]; 

        const container = document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="USER"]'); 
        container.innerHTML = ""; 
        container.innerHTML += createAdminUserEntity(user); 


    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
}



function createAdminUserEntity(user) {
    return `<div class="content flex-1 flex flex-col justify-between p-4 py-6">
                    <div class="info mt-6">
                        <div class="font-semibold text-2xl">${user.fullname}</div>
                        <div class="font-semibold text-2xl mt-2">${user.email}</div>
                    </div>
                    <div class="action flex justify-between px-4">
                        <button data-mini-action="reject" class="btn btn-lg btn-error">Từ chối</button>
                        <button data-mini-action="approve" class="btn btn-lg btn-info">Duyệt</button>
                    </div>
                </div>`; 
}






async function renderAdminTeachingWordEntity() {
    console.log(`${RENDER_LOG}      1.4 render thực thể lời dạy của admin`);

    state.error = null; 


    try {
        // 1. lấy thực thể lời dạy hiện tại 
        // 2. kiểm tra xem có ở cache
        // 3. render ra DOM 
        const twEntity = state.route.currentEntity; 

        if (!ExistsInCache(twEntity.id, "TEACHING_WORD")) {
            const teachingWordServer = await getTeachingWordFlow(twEntity.id);

            state.cache.teachingWords[twEntity.id] = teachingWordServer; 
        }

        const teachingWord = state.cache.teachingWords[twEntity.id];
        const container = document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="TEACHING_WORD"]');
        container.innerHTML = "";
        container.innerHTML += createAdminTeachingWordEntity(teachingWord); 


    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
}




function createAdminTeachingWordEntity(teachingWord) {
    const date = displayCodeToDate(teachingWord.displayCode); 
    const inputDate = dateToInputDate(date); 

    return `<div class="">
                    <div class="text-base font-semibold">Tiêu đề</div>
                    <div data-content-type="title" contenteditable="true" class="text-xl outline-none border border-black rounded-lg min-h-20 mt-2 p-2 px-4">${teachingWord.title}</div>
                </div>

                <div>
                    <div class="font-semibold mt-10">Ngày truyền</div>
                    <input data-content-type="date" type="date" value="${inputDate}" class="p-2 px-4 text-xl border border-black rounded-lg mt-2 w-full h-12 ">
                </div>

                <div class="">
                    <div class="text-base font-semibold mt-10">Nội dung</div>
                    <div data-content-type="content" contenteditable="true" class="text-xl outline-none border border-black rounded-lg h-96 mt-2 p-2 px-4 whitespace-pre-wrap overflow-auto">${teachingWord.content}</div>
                </div>`; 
}






async function renderAdminLifeLessonEntity() {
    console.log(`${RENDER_LOG} render thực thể bài học của admin`); 

    state.error = null; 


    try {
        // 1. lấy entity 
        // 2. kiểm tra xem có trong cache chưa, nếu chưa thì lấy từ server 
        // 3. render ra DOM 
        const llmEntity = state.route.currentEntity; 

        if (!ExistsInCache(llmEntity.id, "LIFE_LESSON_MAIN")) {
            const lifeLessonMainServer = await getLifeLessonMainFlow(llmEntity.id);

            state.cache.lifeLessonsMain[llmEntity.id] = lifeLessonMainServer; 
        }


        
        const container = document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"] [data-entity-type="LIFE_LESSON"]'); 
        container.innerHTML = ""; 

        const lifeLessonMain = state.cache.lifeLessonsMain[llmEntity.id]; 
        container.innerHTML += createAdminLifeLessonEntity(lifeLessonMain); 


    } catch (err) {
        state.error = err.message; 
        console.log(`${RENDER_LOG}          1.6.10 lỗi ở tầng render: ${err.message}`);
        await render(); 
    }
    

}




function createAdminLifeLessonEntity(lifeLessonMain) {
    return `<h1 class="text-2xl text-center">${lifeLessonMain.title}</h1>
                <div class="mt-10">
                    <div class="font-semibold">Nội dung chính</div>
                    <div data-content-type="main-content" contenteditable="true" class="text-xl outline-none border border-black rounded-lg h-96 mt-2 p-2 px-4 whitespace-pre-wrap overflow-auto">${lifeLessonMain.mainContent}</div>
                </div>`; 
}

















function displayCodeToDate(displayCode) {
    const match = displayCode.match(/^(CN|T[2-7])W(\d{1,2})Y(\d{2}|\d{4})$/);
    if (!match) return "";

    const [, dayPart, weekText, yearText] = match;

    const targetWeekday = dayPart === "CN" ? 1 : Number(dayPart.slice(1));
    const targetWeek = Number(weekText);
    const targetYear = yearText.length === 2 ? 2000 + Number(yearText) : Number(yearText);

    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
            const date = new Date(targetYear, month, day);

            if (date.getFullYear() !== targetYear || date.getMonth() !== month) {
                continue;
            }

            const parts = getTeachingWordDateParts(date);

            if (
                parts.year === targetYear &&
                parts.week === targetWeek &&
                parts.weekday === targetWeekday
            ) {
                return formatDateDDMMYYYY(date);
            }
        }
    }

    return "";
}

function dateToInputDate(date) {
    // date dạng dd/mm/yyyy
    const [day, month, year] = date.split("/");

    if (!day || !month || !year) return "";

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function getTeachingWordDateParts(date) {
    const year = date.getFullYear();

    // JS: Sunday = 0, Monday = 1, ..., Saturday = 6
    // Rule backend: Sunday = 1, Monday = 2, ..., Saturday = 7
    const weekday = date.getDay() + 1;

    let week = getIsoWeek(date);

    // Backend cộng thêm 1 nếu là Chủ nhật
    if (weekday === 1) {
        week += 1;
    }

    return { weekday, week, year };
}

function getIsoWeek(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay() || 7;

    d.setDate(d.getDate() + 4 - day);

    const yearStart = new Date(d.getFullYear(), 0, 1);

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatDateDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}



function inputDateToDate(inputDate) {
    // inputDate dạng yyyy-mm-dd
    const [year, month, day] = inputDate.split("-");

    if (!year || !month || !day) return "";

    return `${day}/${month}/${year}`;
}























// ---------- FAB render function ----------
function renderFabState() {
    if (state.ui.fabState === null) {
        return; 
    }

    // 1. kiểm tra state rồi render phù hợp. 
    if (state.ui.fabState === 0) {
        renderFabStateZero(); 
    } else if (state.ui.fabState === 1) {
        renderFabStateOne();
    } else if (state.ui.fabState === 2) {
        renderFabStateTwo();
    }
}






function renderFabStateZero() {
    const fabOpenBtn = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"] .floating-action-button-open-btn`); 

    if (!fabOpenBtn) return; 


    fabOpenBtn.classList.remove("opacity-75", "opacity-25"); 
    fabOpenBtn.classList.add("opacity-25");
}


function renderFabStateOne() {  
    const fabOpenBtn = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"] .floating-action-button-open-btn`); 
    const fabClose = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"] .floating-action-button-close`); 


    

    if (!fabOpenBtn) return; 
    if (!fabClose) return; 


    fabClose.classList.add("hidden");
    fabOpenBtn.classList.remove("hidden"); 

    fabOpenBtn.classList.remove("opacity-75", "opacity-25"); 
    fabOpenBtn.classList.add("opacity-75");
    
}

function renderFabStateTwo() {
    const fabOpenBtn = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"] .floating-action-button-open-btn`); 
    const fabClose = document.querySelector(`[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"] .floating-action-button-close`); 

    if (!fabOpenBtn) return; 
    if (!fabClose) return; 


    fabOpenBtn.classList.add("hidden"); 
    fabClose.classList.remove("hidden"); 
    
}









// ------- RENDER OVERLAY VISIBLE --------
function renderOverlayVisible() {
    const overlay = document.querySelector("#overlay"); 

    if (state.ui.overlayVisible === true) {
        overlay.classList.remove("hidden"); 

    } else {
        overlay.classList.add("hidden"); 
    }
}







// ------ RENDER OVERLAY ENTITY ---------
function renderOverlayEntity() {
    const noteFreeWrite = document.querySelector("#note-free-write"); 
    const purposeFreeWrite = document.querySelector("#purpose-free-write");
    const actionAddition = document.querySelector("#action-addition"); 
    const teachingWordAddition = document.querySelector("#teaching-word-addition"); 


    if (state.ui.overlayEntity === null) {
        noteFreeWrite.classList.add("hidden"); 
        purposeFreeWrite.classList.add("hidden"); 
        actionAddition.classList.add("hidden"); 
        teachingWordAddition.classList.add("hidden"); 

    } else if (state.ui.overlayEntity === "NOTE_FREE_WRITE") {
        noteFreeWrite.classList.remove("hidden"); 

    } else if (state.ui.overlayEntity === "PURPOSE_FREE_WRITE") {
        purposeFreeWrite.classList.remove("hidden"); 

    } else if (state.ui.overlayEntity === "ACTION_ADDITION") {
        // console.log(`bug: actionAddition: ${JSON.stringify(actionAddition, null, 2)}`); 
        actionAddition.classList.remove("hidden"); 
    } else if (state.ui.overlayEntity === "TEACHING_WORD_ADDITION") {
        teachingWordAddition.classList.remove("hidden"); 
    }
    
}


























// ------- RENDER SAVE STATUS ----------
let lastSaveStatus = "SAVED"; 
let displaySavedtime = 1500; // 1.5s 

function renderSaveStatus() {
    // nếu last là saving và hiện tại saved thì mới làm 
    if (lastSaveStatus === "SAVING" && state.ui.saveStatus === "SAVED") {
        const savedEl = document.getElementById("saved");
        savedEl.classList.remove("hidden"); 
        setTimeout(() => {
            savedEl.classList.add("hidden"); 
        }, displaySavedtime); 
    }

    lastSaveStatus = state.ui.saveStatus; 
}








// ---------- RENDER NOTE TYPE MENU OPEN ---------
function renderNoteTypeMenuOpen() {
    const noteTypeMenu = document.querySelector("#note-type-menu"); 

    if (!noteTypeMenu) return; 

    if (state.ui.noteTypeMenuOpen === true) {
        noteTypeMenu.classList.remove("hidden"); 
    } else {
        noteTypeMenu.classList.add("hidden"); 
    }
}






















































// ================== 3. CONTROLLER =========
// làm gì đó (trung tâm logic chính), làm gì là render hoặc gọi dữ liệu từ api 





// ------ hàm lấy route từ url 
function getRouteFromURL() {
    console.log(`${CONTROLLER_LOG} 1. lấy route từ url`)
    
    // 1. lấy địa chỉ nhánh trong url !?
    const path = window.location.pathname; 

    // 2. trả lại route phù hợp theo path, nếu path không nằm trong số cho phép thì trả về login 
    if (path === "/login") return {name: "LOG_IN"}; 
    if (path === "/signup") return {name: "SIGN_UP"}; 
    if (path === "/home") return {name: "HOME", userRole: "USER"}; 
    if (path === "/teaching-words") return {name: "TEACHING_WORDS", userRole: "USER"}; 
    if (path === "/life-lessons") return {name: "LIFE_LESSONS", userRole: "USER"}; 
    if (path === "/admin/home") return {name: "HOME", userRole: "ADMIN"}; 
    if (path === "/admin/teaching-words") return {name: "TEACHING_WORDS", userRole: "ADMIN"}; 
    if (path === "/admin/life-lessons") return {name: "LIFE_LESSONS", userRole: "ADMIN"}; 
    

    const parts = path.split("/"); 

    if (parts[1] === "entity") {
        return {
            name: "ENTITY", 
            userRole: "USER", 
            currentEntity: {
                type: parts[2].replaceAll("-", "_").toUpperCase(), 
                id: (parts[3])
            }
        }
    }

    if (parts[1] === "admin" && parts[2] === "entity") {
        return {
            name: "ENTITY", 
            userRole: "ADMIN", 
            currentEntity: {
                type: parts[3].replaceAll("-", "_").toUpperCase(), 
                id: (parts[4])
            }
        }
    }



    return {name: "login"}
}






// ------ hàm chuyển đổi route về url 
function toURL(route) {
    if (route.name === "LOG_IN") {
        return "/login"; 
    } else if (route.name === "SIGN_UP") {
        return "/signup"; 
    } else {
        if (route.userRole === "USER") {
            if (route.name === "HOME") {
                return "/home"; 
            } else if (route.name === "TEACHING_WORDS") {
                return "/teaching-words"; 
            } else if (route.name === "LIFE_LESSONS") {
                return "/life-lessons"; 
            } else if (route.name === "ENTITY") {
                if (route.currentEntity.type === "TEACHING_WORD") {
                    return `/entity/teaching-word/${route.currentEntity.id}`; 
                } else if (route.currentEntity.type === "LIFE_LESSON") {
                    return `/entity/life-lesson/${route.currentEntity.id}`; 
                } else if (route.currentEntity.type === "PURPOSE") {
                    return `/entity/purpose/${route.currentEntity.id}`; 
                } else if (route.currentEntity.type === "NOTE") {
                    return `/entity/note/${route.currentEntity.id}`; 
                } 

            }
        } else if (route.userRole === "ADMIN") {
            if (route.name === "HOME") {
                return "/admin/home"; 

            } else if (route.name === "TEACHING_WORDS") {
                return "/admin/teaching-words"; 

            } else if (route.name === "LIFE_LESSONS") {
                return "/admin/life-lessons"; 


            } else if (route.name === "ENTITY") {
                if (route.currentEntity.type === "USER") {
                    return `/admin/entity/user/${route.currentEntity.id}`; 

                } else if (route.currentEntity.type === "TEACHING_WORD") {
                    return `/admin/entity/teaching-word/${route.currentEntity.id}`;

                } else if (route.currentEntity.type === "LIFE_LESSON") {
                    return `/admin/entity/life-lesson/${route.currentEntity.id}`; 

                }
            }
        }
    }
}




// ------- hàm điều hướng 
async function navigate(route) {
    console.log(`${CONTROLLER_LOG}  1. hàm người dùng điều hướng tới route: ${JSON.stringify(route, null, 2)}`)

    // 1. update state
    state.route = route; 

    state.ui.fabState = null; 

    if (state.route.name === "ENTITY" && state.route.userRole === "USER") {
        state.ui.fabState = 0; 
    }


    // 2. convert route to url 
    const url = toURL(route); 

    // 3. replace trong history 
    history.pushState(route, "", url); 

    // 4. render 
    await render(); 
}

async function redirect(route) {
    console.log(`${CONTROLLER_LOG}  1. hàm hệ thống tự điều hướng về route: ${JSON.stringify(route, null, 2)}`); 

    // 1. update state
    state.route = route; 

    state.ui.fabState = null; 

    if (state.route.name === "ENTITY" && state.route.userRole === "USER") {
        state.ui.fabState = 0; 
    }

    // 2. convert route to url 
    const url = toURL(route); 

    // 3. replace trong history 
    history.replaceState(route, "", url); 

    // 4. render 
    await render(); 
}


// ------- hàm khởi tạo app ---------------------------
// là những gì cần làm lúc reload lại page, mình hiểu như vậy
const VALID_ROUTE_NAME = new Set(["HOME", "TEACHING_WORDS", "LIFE_LESSONS", "ENTITY"]); 

async function initApp() {
    console.log(`${CONTROLLER_LOG} vào hàm khởi tạo app`); 

    state.error = null; 

    const route = getRouteFromURL(); 
    console.log(`${CONTROLLER_LOG} 1. route: ${JSON.stringify(route, null, 2)}`); 

    const token = localStorage.getItem("accessToken"); 

    // 1. nếu không có token và route name không phải là login hoặc signup thì 
    // 1.1 cho login 
    // 1.2 sửa lại ở url 
    // 1.3 gán vào state 
    // 1.4 render 
    if (!token) {
        console.log(`${CONTROLLER_LOG}  1. không có token`)

        if (route.name !== "LOG_IN" && route.name !== "SIGN_UP") {
            console.log(`${CONTROLLER_LOG}      1.1 route.name không phải là login và sign_up, route.name: ${route.name}`)

            await redirect({name: "LOG_IN"}); 
        } else {
            console.log(`${CONTROLLER_LOG}      1.1 route.name là login hoặc signup, route.name: ${route.name}`)

            await redirect(route); 
        }
    } else { // TH: có token
        console.log(`${CONTROLLER_LOG}  1. có token: ${token}`)
        // thử lấy user, nếu báo lỗi nghĩa là có user thì check xem nếu là route là login hoặc sign up thì trả về home, còn không thì cứ gán và render bình thường. 
        // nếu không (nghĩa là token không còn hợp lệ do hết hạn thì lúc này yêu cầu người dùng phải đăng nhập lại) nên trả về login


        // new: thử lấy user, nếu có user thì gán state.user vào user 
        // 1. nếu route là home, hoặc entity, teaching words hoặc life-lessons thì đi như bình thường, còn không thì điều hướng về home 
        try {
            const user = await getMeFlow(); 

            console.log(`${CONTROLLER_LOG}      1.1 có user: ${JSON.stringify(user, null, 2)}`)
            state.user = user; 

            // 1. nếu route.userRole đúng với user.role
            if (route.userRole === user.role) {
                console.log(`BUG: route.userRole khớp với user.role`); 

                // 1. route.name khớp với các route name hợp lệ thì đi vào đó, không thì vào "HOME"
                if (VALID_ROUTE_NAME.has(route.name)) {
                    console.log('BUG: route.name khớp với ROUTE NAME hợp lệ'); 
                    await redirect(route); 
                } else {
                    console.log('BUG: route.name không khớp với ROUTE NAME hợp lệ'); 
                    await redirect({name: "HOME", userRole: user.role}); 
                }
            } else {
                console.log(`BUG: route.userRole không khớp với user.role`); 

                // nếu không đúng thì sao? Vì về trang home của user.role
                await redirect({name: "HOME", userRole: user.role}); 
            }


        } catch {
            console.log(`${CONTROLLER_LOG}      1.1 user không hợp lệ`)

            localStorage.removeItem("accessToken"); 
            await redirect({name: "LOG_IN"}); 
        }
    }

}



// ----- hàm để xử lí sự kiện popState
async function handlePopState(currRoute) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí pop state với currRoute: ${JSON.stringify(currRoute, null, 2)}`); 

    // 1. kiểm tra xem còn token không? 
    // 1.1 nếu không có token thì kiểm tra currRoute có userRole không? 
    // 1.1.1 nếu không có thì ok, nếu có thì quay về login 

    const token = localStorage.getItem("accessToken"); 

    if (!token) {
        if (currRoute.userRole)  {
            await redirect({name: "LOG_IN"}); 
        } else {
            await redirect(currRoute); 
        }
    } else {
        await redirect(currRoute); 
    }

    // nói chung là nó đơn giản hơn cả cái initAPP nhưng tương tự

}










// ======= ROUTE: LOGIN ======
// --------- Hàm xử lí thao tác login -----------
async function handleLogin(username, password) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí login với username: ${username}, password: ${password}`); 

    state.error = null; 

    // 1. xử lí 
    try {
        // 1. giao tiếp login với server 
        const {data, message} = await loginFlow(username, password); 


        // 2. lấy token 
        const token = data.accessToken; 

        // 3. giao tiếp me với server
        localStorage.setItem("accessToken", token); 

        // 4. lấy user 
        const user = await getMeFlow(); 

        // 5. tùy vào user role mà cập nhập lại state 
        state.user = user;

        // 6. điều hướng sang home tương ứng với user
        await redirect({name: "HOME", userRole: user.role}); 

    } catch(err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG} lỗi ở handleLogin: ${err.message}`); 

        await render(); 
    }

}


// ------ hàm xử lí chuyển hướng sang trang đăng kí ----
async function handleRedirectToSignUpPage() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí chuyển hướng đăng kí trong trang đăng nhập`); 

    state.error = null; 
    await navigate({name: "SIGN_UP"}); 
}












// ======= ROUTE: SIGNUP =======


// ------ hàm xử lí chuyển hướng sang trang đăng nhập ------
async function handleRedirectToLogInPage() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí chuyển hướng đăng nhập trong trang đăng kí`); 

    state.error = null; 
    await navigate({name: "LOG_IN"}); 
}




// ------ hàm xử lí đăng kí ---------
async function handleSignup(fullname, email, username, password) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí đăng kí với họ tên: ${fullname}, email: ${email}, username: ${username}, password: ${password}`); 

    // logic chính của nó là gì? Mình muốn nó làm gì? 

    // 1. gửi cho server, chờ nhận trả lời từ server. Server trả về cái gì nhỉ? là message báo đăng kí thành công. 
    // 2. vậy không làm gì cả mà tự động chuyển qua trang login 
    state.error = null; 

    try {
        const {message} = await signupFlow(fullname, email, username, password); 

        await navigate({name: "LOG_IN"}); 
    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG} 1. lỗi ở handleSignup: ${err.message}`); 

        await render(); 
    }
}




// ======= ROUTE: HOME USER ========
async function handleLogOut() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí đăng xuất`); 

    state.error = null; 

    // 1. xóa token 
    localStorage.removeItem("accessToken"); 
    state.user = null; 

    // 2. điều hướng về login 
    await redirect({name: "LOG_IN"}); 

}












// ========== ROUTE: HOME ENTITY ==========
// ------- hàm xử lí click vào nút fab trong thực thể lời dạy --------
// let lastClickTime = Date.now(); 
let stateOneTimer = null;
let stateOneTime = 3000; // 3s

async function handleClickFab() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí click vào nút fab trong thực thể lời dạy`); 

    clearTimeout(stateOneTimer); 


    if (state.ui.fabState === 0 || state.ui.fabState === 2) {
        // state 1
        state.ui.fabState = 1; 
        state.ui.overlayVisible = false; 

        await render(); 

        stateOneTimer = setTimeout(async () => {
            // state 0
            state.ui.fabState = 0; 
            await render(); 
        }, stateOneTime); 
    } else if (state.ui.fabState === 1) {
        // state 2
        state.ui.fabState = 2; 
        state.ui.overlayVisible = true; 
        await render(); 
    } 
}



async function handleAction(action) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí hành động ${action}`); 

    state.ui.fabState = 0; 
    

    if (action === "note-free-write") {
        state.ui.overlayVisible = true; 
        state.ui.overlayEntity = "NOTE_FREE_WRITE";
        await render(); 

    } else if (action === "purpose-free-write") {
        state.ui.overlayVisible = true; 
        state.ui.overlayEntity = "PURPOSE_FREE_WRITE"; 
        await render(); 

    } else if (action === "action-add") {
        state.ui.overlayVisible = true; 
        state.ui.overlayEntity = "ACTION_ADDITION"; 
        await render(); 

    } else if (action === "note-delete") {
        state.ui.overlayVisible = false; 
        await deleteCurrentNote(); 
    }

    
}





async function deleteCurrentNote() {
    console.log(`${CONTROLLER_LOG}  1. xóa note hiện tại`); 

    state.error = null; 

    try {
        // 1. xóa note hiện tại trên server
        // 2. xóa note trong server. Cái mình băn khoăn một chút và để lát suy nghĩ sau là relations. 
        // 3. làm việc mà tương đương ấn nút quay lại trên entity. 
        const entity = state.route.currentEntity; 

        await deleteNoteFlow(entity.id); 
        delete state.cache.notes[entity.id]; 

        // xóa triệt để
        deleteBornRelationOfOrigin(entity); 
        deleteBornEntities(entity); 


        if (history.length > 1) {
            history.back();
        } else {
            await redirect({
                name: "HOME",
                userRole: "USER"
            });
        }
    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }
}





// ------------ HÀM XÓA ĐI LIÊN KẾT TỪ ORIGIN TỚI THỰC THỂ HIỆN TẠI ---------- 
function deleteBornRelationOfOrigin(entity) {
    console.log(`${CONTROLLER_LOG}      1.1 xóa đi thực thể bối cảnh của entity: ${JSON.stringify(entity, null, 2)}`); 

    // 1. tìm thực thể gốc
    const entityKey = `${entity.type}-${entity.id}`; 

    const originEntity = state.cache.relations.origin[entityKey]; 

    if (!originEntity) {
        return; 
    }

    const originKey = `${originEntity.type}-${originEntity.id}`; 

    // 2. xóa đi liên kết born của thực thể gốc trong cache
    delete state.cache.relations.born[originKey]; 
}






// -------- HÀM NÀY LÀ XÓA ĐI CÁC THỰC THỂ SINH RA TỪ THỰC THỂ HIỆN TẠI ---------
function deleteBornEntities(entity) {
    // hàm này thì mình định dùng đệ quy, học được rồi thì cứ xài thôi. 
    console.log(`${CONTROLLER_LOG}      1.2 xóa đi toàn bộ các thực thể con sinh ra từ thực thể ${JSON.stringify(entity, null, 2)}`); 

    // Mình định dùng cách đệ quy. Vậy thì đầu tiên là việc nó cần làm là gì? Điều kiện dừng là gì? 
    const key = `${entity.type}-${entity.id}`; 

    // điều kiện dừng là gì? là khi tìm key trong born là rỗng. Và lúc như vậy thì không làm gì cả. 
    const bornEntities = state.cache.relations.born[key]; 
    if (!bornEntities) {
        return; 
    }

    // Làm gì? Nên nhớ là mình có hàm xóa các thực thể sinh ra từ thực thể hiện tại.
    // 1. vào từng object của mảng vào và xóa các thực thể sinh ra rồi xóa chính nó là xong. 
    for (let p of bornEntities.purposes) {
        deleteBornEntities({type: "PURPOSE", id: p.id}); 
        delete state.cache.purposes[p.id]; 
    }

    for (let n of bornEntities.notes) {
        deleteBornEntities({type: "NOTE", id: n.id}); 
        delete state.cache.notes[n.id]; 
    }

    delete state.cache.relations.born[key]; 
}













// ------ HÀM XỬ LÍ VIỆC CLICK VÀO CÁC MINI ACTION TRONG NOTE FREE WRITE ACTION -------

async function handleNfwMiniAction(miniAction, content) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí mini action của note free write ${miniAction} với content: ${content}`); 

    state.error = null; 

    try {
        if (miniAction === "close") {
            state.ui.overlayEntity = null; 
        } else if (miniAction === "save") {
            // save thì làm gì? 
            // 1. gửi giá trị lên server. 
            // 2. nhận về id của purpose mới tạo và bỏ vào trong relations 
            // 3. trạng thái freewrite mất. 
            await noteFreeWriteFlow(state.route.currentEntity.type, state.route.currentEntity.id, content); 
            
            // Clear born entities cache để force refetch
            const keyNameInRelations = `${state.route.currentEntity.type}-${state.route.currentEntity.id}`;
            delete state.cache.relations.born[keyNameInRelations];
            
            state.ui.overlayEntity = null; 
        }

        state.ui.overlayVisible = false;
        await render(); 
    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }
    
}





// ---------- HÀM XỬ LÍ MINI ACTION TRONG PURPOSE FREE WRITE ACTION --------- 
async function handlePfwMiniAction(miniAction, purposeContext, hopeContext) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí mini action của purpose free write ${miniAction} với purpose context: ${purposeContext} và hope context: ${hopeContext}`); 

    state.error = null; 

    try {
        if (miniAction === "close") {
            state.ui.overlayEntity = null; 
        } else if (miniAction === "save") {
            // save thì làm gì? 
            // 1. gửi giá trị lên server.  
            // 2. overlayEntity rỗng. 
            await purposeFreeWriteFlow(state.route.currentEntity.type, state.route.currentEntity.id, purposeContext, hopeContext); 
            
            // Clear born entities cache để force refetch
            const keyNameInRelations = `${state.route.currentEntity.type}-${state.route.currentEntity.id}`;
            delete state.cache.relations.born[keyNameInRelations];
            
            state.ui.overlayEntity = null; 
        }

        state.ui.overlayVisible = false; 
        await render(); 
    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }
    
}







// -------- HÀM XỬ LÍ MINI ACTION CỦA ACTION ADDITION ACTION ----------
async function handleAaMiniAction(miniAction, content) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí mini action cho action addition với mini action: ${miniAction}, content: ${content}`); 

    // làm gì đây? basic thì mình biết rồi. 
    state.error = null; 

    try {
        // xét từng mini action 
        if (miniAction === "close") {
            state.ui.overlayEntity = null; 
            state.ui.overlayVisible = false; 
        } else if (miniAction === "save") {
            // lưu hành động của mục đích thfi mình làm gì? 
            // 1. lưu vào server
            // 2. xóa cái caches của mục đích hiện tại lấy từ route. Để khi render buộc phải refetch lại từ server. 
            const currentEntity = state.route.currentEntity; 

            await addActionFlow(currentEntity.id, content); 

            

            delete state.cache.purposes[currentEntity.id]; 

            console.log("BUG: cây dò bug 🚩"); 

            state.ui.overlayEntity = null; 
            state.ui.overlayVisible = false; 
        }

        await render(); 

    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }

}
















// hàm xử lí khi nhập input 
let saveTimer = null; 
const saveTime = 1500; // 5s


async function handleInput(contentType, content) {
    console.log(`${CONTROLLER_LOG} xử lí khi nhập input ở contentType ${contentType} có content: ${content}`); 

    // làm gì đây, vào hàm này nghĩa là người dùng đang nhập gì đó
    // 1. xóa timer
    // 2. đặt lại timer mới là sau một khoảng thời gian thì sẽ save. 
    clearTimeout(saveTimer); 

    if (state.ui.saveStatus === "SAVED" || state.ui.saveStatus === "SAVING") {
        state.ui.saveStatus = "EDITTING"; 

        saveTimer = setTimeout(async () => {
            state.ui.saveStatus = "SAVING"; 
            await render(); 
            
            await save(contentType, content); 
            
            state.ui.saveStatus = "SAVED"; 
            await render(); 
        }, saveTime); 
    } else if (state.ui.saveStatus === "EDITTING") {
        // nếu nhập trong lúc đang nhập thì reset timer 
        saveTimer = setTimeout(async () => {
            state.ui.saveStatus = "SAVING"; 
            await render(); 
            
            await save(contentType, content); 
            
            state.ui.saveStatus = "SAVED"; 
            await render(); 
        }, saveTime); 
    } 

}




async function save(contentType, content) {
    console.log(`${CONTROLLER_LOG}  1. lưu nội dung loại: ${contentType} có nội dung: ${content}`); 


    state.error = null; 

    try {
        // 1. lưu theo loại thực thể và loại nội dung
        // 1.1 lưu vào server 
        // 1.2 lưu vào cache 
        const entity = state.route.currentEntity; 

        if (entity.type === "LIFE_LESSON") {
                await updateLifeLessonReflectionFlow(entity.id, content); 
            state.cache.lifeLessonsReflection[entity.id].reflection = content; 


        } else if (entity.type === "PURPOSE") {
            const [ctType, contentIdString] = contentType.split("-"); 
            const actionId = (contentIdString); 

            let title = state.cache.purposes[entity.id].title; 
            let hope = state.cache.purposes[entity.id].hope; 

            if (contentType === "title") {
                title = content; 
            } else if (contentType === "hope") {
                hope = content; 
            } else if (ctType === "action") {
                // update context, giữ nguyên status
                const action = state.cache.purposes[entity.id].actions.find(a => a.id === actionId); 
                if (!action) {
                    throw new Error(`Không tìm thấy action ${actionId} trong cache`);
                }

                await updateActionFlow(entity.id, actionId, content, action.status); 
                action.context = content; 
            }

            await updatePurposeFlow(entity.id, title, hope); 
            state.cache.purposes[entity.id].title = title; 
            state.cache.purposes[entity.id].hope = hope; 
        } else if (entity.type === "NOTE") {
            const noteCache = state.cache.notes[entity.id]; 


            await updateNoteFlow(entity.id, content, noteCache.type); 
            state.cache.notes[entity.id].content = content; 
        }
    } catch (err) {
        state.error = err.message; 
        console.log(`${CONTROLLER_LOG}      1.9 lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }
}





// hàm xử lí khi click vào nút của action trong purpose
async function handleClickActionStatusBtn(id, status) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí khi click vào nút status của action ${id}, để đổi thành trạng thái: ${status}`); 

    state.error = null; 

    try {
        // đổi trạng thái của action đó ở server
        // đổi trạng thái của action đó ở cache
        const purposeId = state.route.currentEntity.id; 
        const action = state.cache.purposes[purposeId].actions.find(a => a.id === id); 
        if (!action) {
            throw new Error("Action not found"); 
        }

        await updateActionFlow(purposeId, id, action.context, status); 
        action.status = status; 

        await render(); 
    } catch (err) {
        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        state.error = err.message; 
        await render(); 
    }
}









// ----------- HÀM XỬ LÍ CLICK VÀO NOTE TYPE SELECTED ------
async function handleClickNoteTypeSelected() {
    console.log(`${CONTROLLER_LOG} hàm xử lí click vào nhãn loại ghi chú`); 

    // nếu open thì close và ngược lại 
    if (state.ui.noteTypeMenuOpen === true) {
        state.ui.noteTypeMenuOpen = false; 

    } else if (state.ui.noteTypeMenuOpen === false) {
        state.ui.noteTypeMenuOpen = true; 
    }

    await render(); 
}








// ---------- HÀM XỬ LÍ CLICK VÀO NOTE TYPE OPTION ---------
async function handleClickNoteTypeOption(noteType) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí click chọn note type option: ${noteType}`); 

    
    state.error = null; 

    try {
        // 1. lưu vào server 
        // 2. lưu vào cache 
        // 3. đổi trạng thái ui phù hợp rồi render

        const noteId = state.route.currentEntity.id; 
        const note = state.cache.notes[noteId]; 

        await updateNoteFlow(noteId, note.content, noteType); 
        note.type = noteType; 

        state.ui.noteTypeMenuOpen = false; 
        
        await render(); 
    } catch (err) {
        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        state.error = err.message; 
        await render(); 
    }
}





// --------------------- ROUTE: USER - TEACHING WORDS ----------------------
async function handleClickMiniCardTeachingWord(id) {
    console.log(`${CONTROLLER_LOG} hàm xử lí click vào mini card Lời Dạy có id: ${id}`); 

    // làm gì? 
    // chuyển route thôi 
    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            id: id, 
            type: "TEACHING_WORD"
        }
    })
}







// --------------------- ROUTE: USER - LIFE LESSONS ----------------------
async function handleClickMiniCardLifeLesson(id) {
    console.log(`${CONTROLLER_LOG} hàm xử lí click vào mini card bài học có id: ${id}`); 


    // chuyển route thôi 
    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            id: id, 
            type: "LIFE_LESSON"
        }
    })
}










// ------------------ ROUTE: ADMIN HOME ---------------------


// HÀM XỬ LÍ CLICK VÀO NÚT XEM THÊM Ở CARD USER 
async function handleClickSeeMoreUser(id) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí khi click vào nút xem thêm của card user: ${id}`); 

    // 1. navigate sang page entity user đó
    await navigate({
        name: "ENTITY", 
        userRole: "ADMIN", 
        currentEntity: {
            type: "USER", 
            id: id
        }
    })
}









// ------------- ROUTE: ADMIN ENTITY -------------------
async function handleUserMiniAction(miniAction) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí mini action: ${miniAction} của thực thể admin user`); 

    
    state.error = null; 

    try {
        const userEntity = state.route.currentEntity; 

        // 1. xét từng trường hợp thôi 
        // 1.1 nếu từ chối người dùng thì cập nhập trạng thái của người dùng và quay về trước đó và xóa người dùng đó trong cache. 
        if (miniAction === "reject") {
            await updateUserStatusFlow(userEntity.id, "REJECTED"); 

            delete state.cache.users[userEntity.id]; 
            history.back(); 
        } else if (miniAction === "approve") {
            await updateUserStatusFlow(userEntity.id, "APPROVED"); 

            delete state.cache.users[userEntity.id]; 
            history.back(); 
        }
    } catch (err) {
        console.log(`${CONTROLLER_LOG}  1. lỗi ở tầng controller: ${err.message}`); 

        state.error = err.message; 
        await render(); 
    }
}




async function handleAdminInput(contentType, content) {
    console.log(`${CONTROLLER_LOG} xử lí nhập cho entity (${state.route.currentEntity.type}, ${state.route.currentEntity.id}) với loại content: ${contentType}, nội dung: ${content}`); 

    // làm gì đây, vào hàm này nghĩa là người dùng đang nhập gì đó
    // 1. xóa timer
    // 2. đặt lại timer mới là sau một khoảng thời gian thì sẽ save. 
    clearTimeout(saveTimer); 

    if (state.ui.saveStatus === "SAVED" || state.ui.saveStatus === "SAVING") {
        state.ui.saveStatus = "EDITTING"; 

        saveTimer = setTimeout(async () => {
            state.ui.saveStatus = "SAVING"; 
            await render(); 
            
            await saveAdmin(contentType, content); 
            
            state.ui.saveStatus = "SAVED"; 
            await render(); 
        }, saveTime); 
    } else if (state.ui.saveStatus === "EDITTING") {
        // nếu nhập trong lúc đang nhập thì reset timer 
        saveTimer = setTimeout(async () => {
            state.ui.saveStatus = "SAVING"; 
            await render(); 
            
            await saveAdmin(contentType, content); 
            
            state.ui.saveStatus = "SAVED"; 
            await render(); 
        }, saveTime); 
    } 
}




async function saveAdmin(contentType, content) {
    console.log(`${CONTROLLER_LOG}  1. lưu cho entity (${state.route.currentEntity.type}, ${state.route.currentEntity.id}) với loại content: ${contentType}, nội dung: ${content}`); 

    const entity = state.route.currentEntity; 

    // 1. nếu như là teaching word 
    if (entity.type === "TEACHING_WORD") {
        const teachingWord = state.cache.teachingWords[entity.id];

        let title = teachingWord.title; 
        let twContent = teachingWord.content; 
        let date = displayCodeToDate(teachingWord.displayCode); 

        if (contentType === "title") {
            title = content; 
        } else if (contentType === "content") {
            twContent = content; 
        } else if (contentType === "date") {
            date = content; 
        }

        await updateTeachingWordFlow(entity.id, title, twContent, date); 
        delete state.cache.teachingWords[entity.id]; 



    } else if (entity.type === "LIFE_LESSON") {
        const lifeLessonMain = state.cache.lifeLessonsMain[entity.id]; 

        let mainContent = lifeLessonMain.mainContent; 

        if (contentType === "main-content") {
            mainContent = content; 
        }


        await updateLifeLessonMainFlow(entity.id, mainContent); 
        delete state.cache.lifeLessonsMain[entity.id]; 
    }
}










// ------------- ROUTE: ADMIN TEACHING WORDS ----------------
async function handleClickAdminTeachingWordMiniCard(id) {
    console.log(`${CONTROLLER_LOG} vào hàm xử click lời dạy mini card có id: ${id}`); 

    
    await navigate({
        name: "ENTITY", 
        userRole: "ADMIN", 
        currentEntity: {
            type: "TEACHING_WORD", 
            id: id
        }
    });

}




async function handleClickAddTeachingWord() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí click nút thêm lời dạy`); 

    // làm gì? 
    state.ui.overlayVisible = true; 
    state.ui.overlayEntity = "TEACHING_WORD_ADDITION"; 
    await render(); 


}




async function handleCloseTeachingWordAddition() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí đóng trang thêm lời dạy mới`); 

    state.ui.overlayVisible = false; 
    state.ui.overlayEntity = null; 
    await render(); 
}




async function handleAddTeachingWord(title, date, content) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí thêm lời dạy mới với chủ đề: ${title}, ngày thêm: ${date}, nội dung: ${content}`); 


    state.error = null; 

    try {
        // làm gì? thì thêm vào server và sau đó quay ra thôi

        await addTeachingWordFlow(title, date, content); 

        state.ui.overlayVisible = false; 
        state.ui.overlayEntity = null; 
        await render();


    } catch (err) {
        state.error = err.message; 

        console.log(`${CONTROLLER_LOG} lỗi ở tầng controller: ${err.message}`); 

        await render(); 
    }
}











// --------------- ROUTE: ADMIN LIFE LESSONS ------------------
async function handleClickAdminLifeLessonMainMiniCard(id) {
    console.log(`${CONTROLLER_LOG} hàm xử lí click vào mini card bài học của admin có id: ${id}`); 

    await navigate({
        name: "ENTITY",
        userRole: "ADMIN",
        currentEntity: {
            id: id, 
            type: "LIFE_LESSON"
        }
    });
}

















































// ================== 4. EVENT HANDLER ======
// nhận sự kiện với element và kích hoạt hàm controller tương ứng



// ----- sự kiện quay lại -------
window.addEventListener("popstate", (event) => {
    console.log(`${EVENT_HANDLER_LOG} đổi entry trong history`); 

    const currRoute = event.state || getRouteFromURL(); 


    // state.route = currRoute; 
    // render(); 

    handlePopState(currRoute); 
});





// ====== ROUTE: LOGIN =======
// ----- sự kiện click vào nút gửi trong trang login -------- 
document.getElementById("login-button").addEventListener("click", () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút đăng nhập trong trang đăng nhập`)

    const username = document.getElementById("login-username-input").value.trim(); 
    const password = document.getElementById("login-password-input").value.trim(); 

    handleLogin(username, password); 
});


// ----- sự kiện click vào nút đăng kí trong trang login -----
document.getElementById("sign-up-helper").addEventListener("click", async () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút chuyển hướng đăng kí trong trang đăng nhập`); 

    await handleRedirectToSignUpPage(); 
});













// ========== ROUTE: SIGN_UP ==========
// ----- sự kiện click vào nút đăng nhập ----------
document.getElementById("log-in-helper").addEventListener("click", async () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút chuyển hướng đăng nhập trong trang đăng kí`); 

    await handleRedirectToLogInPage(); 
}); 




// ------ sự kiện click gửi đăng kí ---------
document.getElementById("signup-button").addEventListener("click", () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút đăng kí để gửi thông tin đăng kí`); 

    const fullname = document.getElementById("signup-fullname-input").value.trim(); 
    const email = document.getElementById("signup-email-input").value.trim(); 
    const username = document.getElementById("signup-username-input").value.trim(); 
    const password = document.getElementById("signup-password-input").value.trim(); 


    handleSignup(fullname, email, username, password); 
}); 




// ======== ROUTE: HOME USER ==========


// ------- sự kiện click vào sidenav của trang home user -------
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang user home`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    // đóng sidenav 
    document.querySelector('[data-user-role="USER"] [data-page="HOME"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "USER"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 






// ------- sự kiện click vào nút xem thêm của lời dạy section -------
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .teaching-words-section').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} click vào mục lời dạy trong trang home user`); 

    const button = e.target.closest("button"); 

    if (!button) return; 

    // xử lí việc navigate tới trang entity teaching word với id là gì gì đó. 
    const entityId = (button.dataset.id); 

    await navigate({
        name: "ENTITY",
        userRole: "USER", 
        currentEntity: {
            type: "TEACHING_WORD", 
            id: entityId
        }
    }); 
}); 






// ------- hàm click vào section của bài học ---------
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .life-lessons-section').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} click vào mục bài học trong trang home user`); 

    const button = e.target.closest("button"); 

    if (!button) return; 

    // xử lí việc navigate tới trang entity teaching word với id là gì gì đó. 
    const entityId = (button.dataset.id); 
    await navigate({
        name: "ENTITY",
        userRole: "USER", 
        currentEntity: {
            type: "LIFE_LESSON", 
            id: entityId
        }
    }); 
}); 




// ------ hàm click vào mục mục đích --------
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .purposes-section').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} click vào mục mục đích trong trang home user`); 

    const card = e.target.closest(".card"); 

    if (!card) {
        return; 
    }

    const entityId = (card.dataset.id); 

    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            type: "PURPOSE", 
            id: entityId
        }
    }); 

}); 






// ------ hàm click vào mục ghi chú --------
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .notes-section').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} click vào mục ghi chú trong trang home user`); 

    const card = e.target.closest(".card"); 

    if (!card) {
        return; 
    }

    const entityId = (card.dataset.id); 

    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            type: "NOTE", 
            id: entityId
        }
    }); 

}); 





// ===== ROUTE: USER ENTITY =======


// hàm click vào nút quay lại trong trang user entity
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] .back-icon').addEventListener("click", () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút quay lại trong trang thực thể của user`); 

    history.back(); 
}); 





// hàm click vào thực thể mục đích trong mục thực thể sinh ra
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] .drawer-side .purposes').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào mục mục đích trong phần thực thể sinh ra của trang thực thể của user`); 

    const card = e.target.closest(".card"); 

    if (!card) return; 

    // đóng drawer 
    document.querySelector("#born-entities").checked = false; 

    const entityId = (card.dataset.id); 

    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            type: "PURPOSE", 
            id: entityId
        }
    }); 

}); 




// hàm click vào thực thể ghi chép trong mục thực thể sinh ra
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] .drawer-side .notes').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào mục ghi chép trong phần thực thể sinh ra của trang thực thể của user`); 

    const card = e.target.closest(".card"); 

    if (!card) return; 

    // đóng drawer 
    document.querySelector("#born-entities").checked = false; 

    const entityId = (card.dataset.id); 

    await navigate({
        name: "ENTITY", 
        userRole: "USER", 
        currentEntity: {
            type: "NOTE", 
            id: entityId
        }
    }); 

}); 









// hàm click vào nút fab-open trong trang thực thể 
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể để lắng nghe click nút fab open`);

    const fab = e.target.closest(".floating-action-button-open-btn"); 

    if (!fab) return; 

    await handleClickFab(); 
}); 





// hàm click vào nút fab-close trong trang thực thể 
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể để lắng nghe click nút fab close`);

    const fab = e.target.closest(".floating-action-button-close-btn"); 

    if (!fab) return; 

    await handleClickFab(); 
}); 




// hàm click vào từng nút hành động trong trang thực thể
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể lắng nghe tìm thực thể action và nội dung action đó`);

    const action = e.target.closest(".action"); 

    if (!action) return; 

    const actionContent = action.dataset.action; 
    await handleAction(actionContent); 

}); 






// hàm click vào thực thể nào đó trong trang note free write 
document.querySelector("#note-free-write").addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang note free write`);

    const btn = e.target.closest(".btn"); 

    if (!btn) return; 

    const miniAction = btn.dataset.miniAction; 
    const content = document.querySelector("#note-free-write .textarea").value; 

    await handleNfwMiniAction(miniAction, content); 

}); 




// hàm click vào thực thể nào đó trong trang purpose free write
document.querySelector("#purpose-free-write").addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang purpose free write`);

    const btn = e.target.closest(".btn"); 

    if (!btn) return; 

    const miniAction = btn.dataset.miniAction; 
    const purposeContext = document.querySelector("#purpose-free-write .purpose-context").value; 
    const hopeContext = document.querySelector("#purpose-free-write .hope-context").value; 

    await handlePfwMiniAction(miniAction, purposeContext, hopeContext); 

}); 





// hàm click vào thực thể nào đó trong trang action addition 
document.querySelector("#action-addition").addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang action addition`); 

    const btn = e.target.closest(".btn"); 

    if (!btn) return; 


    const miniAction = btn.dataset.miniAction; 
    const content = document.querySelector("#action-addition .textarea").value; 

    await handleAaMiniAction(miniAction, content); 
}); 






// sự kiện nhập trong entity 
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').addEventListener("input", (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện nhập trong trang user entity`); 

    // nếu là contenteditable thì ok 
    const content = e.target.closest('[contenteditable]'); 

    if (!content) return; 
    const contentType = content.dataset.contentType; 
    const contentText = content.innerText; 

    handleInput(contentType, contentText); 
}); 








// mình muốn làm sao cho khi click vào button mà thay đổi trạng thái của nó, vậy thì cái mình cần lắng nghe cũng chỉ là như trên thôi, trang entity. Gộp vào sau. 
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể để lắng nghe nút đổi trạng thái của action trong trang purpose`);

    const completeActionBtn = e.target.closest(".incomplete-actions .action-icon"); 

    if (!completeActionBtn) {
        // return; 
    } else {
        const actionId = (completeActionBtn.dataset.id); 
        await handleClickActionStatusBtn(actionId, "COMPLETE"); 
    } 




    const incompleteActionBtn = e.target.closest(".complete-actions .action-icon"); 
    
    if (!incompleteActionBtn) {
        // return; 
    } else {
        const actionId = (incompleteActionBtn.dataset.id); 
        await handleClickActionStatusBtn(actionId, "INCOMPLETE"); 
    }
}); 








// ------ LẮNG NGHE SỰ KIỆN CLICK VÀO NOTE TYPE SELECTED TRONG NOTE ENTITY ---------
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="NOTE"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} lắng nghe sự kiện click vào note type selected trong entity-type="NOTE"`); 

    const noteTypeSelected = e.target.closest(".note-type-selected"); 

    if (!noteTypeSelected) return; 

    await handleClickNoteTypeSelected(); 
}); 






// ------ LẮNG NGHE SỰ KIỆN CLICK VÀO NOTE TYPE OPTION --------
document.querySelector('[data-user-role="USER"] [data-page="ENTITY"] [data-entity-type="NOTE"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} lắng nghe sự kiện click vào note type option"`); 

    const noteTypeOption = e.target.closest("#note-type-menu .option"); 

    if (!noteTypeOption) return; 

    const noteType = noteTypeOption.dataset.noteType; 
    await handleClickNoteTypeOption(noteType); 
}); 









// ------------------- ROUTE: USER - TEACHING WORDS -------------
document.querySelector('[data-user-role="USER"] [data-page="TEACHING_WORDS"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} lắng nghe sự kiện click trong trang Lời dạy của user khi click vào mini Card Lời dạy`); 

    const miniCard = e.target.closest(".mini-card"); 

    if (!miniCard) return; 
    
    const id = miniCard.dataset.id; 
    await handleClickMiniCardTeachingWord(id); 
});



// ------- sự kiện click vào sidenav của trang teaching word user -------
document.querySelector('[data-user-role="USER"] [data-page="TEACHING_WORDS"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang user teaching words`); 

    const target = event.target.closest("li, button"); 

    if (!target) return;

    // đóng sidenav 
    document.querySelector('[data-user-role="USER"] [data-page="TEACHING_WORDS"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "USER"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 





// ------------------- ROUTE: USER - LIFE LESSONS -------------
document.querySelector('[data-user-role="USER"] [data-page="LIFE_LESSONS"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} lắng nghe sự kiện click trong trang bài học của user khi click vào mini card bài học`); 

    const miniCard = e.target.closest(".mini-card"); 

    if (!miniCard) return; 
    
    const id = miniCard.dataset.id; 
    await handleClickMiniCardLifeLesson(id); 
});




// ------- sự kiện click vào sidenav của trang home life lessons -------
document.querySelector('[data-user-role="USER"] [data-page="LIFE_LESSONS"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang user life lessons`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    // đóng sidenav 
    document.querySelector('[data-user-role="USER"] [data-page="LIFE_LESSONS"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "USER"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 













// ------------- ROUTE: ADMIN HOME --------------------


// HÀM CLICK VÀO USER VÀ VÀO ENTITY USER ĐÓ 
document.querySelector(`[data-user-role="ADMIN"] [data-page="HOME"]`).addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang admin home để lắng nghe sự kiện click vào xem thêm ở user`); 

    const seeMoreBtn = e.target.closest(".user button"); 

    if (!seeMoreBtn) return; 


    const userId = (seeMoreBtn.dataset.id); 
    await handleClickSeeMoreUser(userId); 
}); 





// HÀM CLICK VÀO SIDE NAV CỦA ADMIN HOME 
document.querySelector('[data-user-role="ADMIN"] [data-page="HOME"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang admin home`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    // đóng sidenav 
    document.querySelector('[data-user-role="ADMIN"] [data-page="HOME"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "ADMIN"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 





// --------------- ROUTE: ADMIN TEACHING WORDS ----------------
document.querySelector('[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang lời dạy của admin`); 

    const teachingWordMiniCard = e.target.closest(".teaching-words .teaching-word"); 

    if (!teachingWordMiniCard) return; 
    
    const id = (teachingWordMiniCard.dataset.id); 

    await handleClickAdminTeachingWordMiniCard(id); 
}); 





// HÀM CLICK VÀO SIDE NAV 
document.querySelector('[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang admin lời dạy`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    // đóng sidenav 
    document.querySelector('[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "ADMIN"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 



// click vào nút thêm lời dạy trong trang admin Lời dạy
document.querySelector('[data-user-role="ADMIN"] [data-page="TEACHING_WORDS"] #add-teaching-word-button').addEventListener("click", async () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút thêm lời dạy trong trang lời dạy của admin`); 

    // làm gì? xử lí thôi 
    await handleClickAddTeachingWord(); 
}); 




// HÀM CLICK VÀO TRANG TEACHING WORD ADDITION 
document.querySelector("#teaching-word-addition").addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thêm lời dạy`); 

    const miniActionEl = e.target.closest('[data-mini-action]'); 

    if (!miniActionEl) return; 

    const miniAction = miniActionEl.dataset.miniAction; 

    if (miniAction === "close") {
        await handleCloseTeachingWordAddition(); 


    } else if (miniAction === "add") {
        const title = document.querySelector('#teaching-word-addition [data-content-type="title"]').value; 
        const date = inputDateToDate(document.querySelector('#teaching-word-addition [data-content-type="date"]').value); 
        const content = document.querySelector('#teaching-word-addition [data-content-type="content"]').value; 
        await handleAddTeachingWord(title, date, content); 
    }
}); 








// ---------------- ROUTE: ADMIN LIFE LESSONS ---------------------
document.querySelector('[data-user-role="ADMIN"] [data-page="LIFE_LESSONS"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang bài học của admin`); 

    const lifeLessonMainMiniCard = e.target.closest(".life-lesson");

    if (!lifeLessonMainMiniCard) return; 

    const id = (lifeLessonMainMiniCard.dataset.id); 

    await handleClickAdminLifeLessonMainMiniCard(id); 
}); 





// HÀM CLICK VÀO SIDE NAV CỦA ADMIN HOME 
document.querySelector('[data-user-role="ADMIN"] [data-page="LIFE_LESSONS"] .drawer-side').addEventListener("click", async (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang admin bài học`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    // đóng sidenav 
    document.querySelector('[data-user-role="ADMIN"] [data-page="LIFE_LESSONS"] .drawer-toggle').checked = false;

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        await navigate({name: target.dataset.route, userRole: "ADMIN"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        await handleLogOut(); 
    }

}); 












// ---------------- ROUTE: ADMIN ENTITY ----------------
document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"]').addEventListener("click", (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể của admin`); 

    const backBtn = e.target.closest(".navbar button"); 

    if (!backBtn) return; 

    e.preventDefault();
    e.stopImmediatePropagation();
    history.back(); 
}); 











document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"]').addEventListener("click", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào trang thực thể của admin`); 

    const miniActionEl = e.target.closest("[data-mini-action]"); 

    if (!miniActionEl) return; 

    const miniAction = miniActionEl.dataset.miniAction; 

    await handleUserMiniAction(miniAction); 
}); 







document.querySelector('[data-user-role="ADMIN"] [data-page="ENTITY"]').addEventListener("input", async (e) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện nhập ở trang thực thể admin`); 

    const content = e.target.closest("[contenteditable], input"); 

    if (!content) return; 

    if (content.matches("input")) {
        const context = inputDateToDate(content.value);
        const contentType = content.dataset.contentType; 

        await handleAdminInput(contentType, context); 


    } else if (content.matches("div")) {
        const context = content.innerText; 
        const contentType = content.dataset.contentType; 

        await handleAdminInput(contentType, context); 
    }

    
}); 


















































// ================== 5. INIT ===============
// Khi cần làm gì đó mặc định lúc đầu - ngang hàng với event handler và sử dụng các hàm của controller 
(async () => {
    console.log(`${INIT_LOG} vào tầng init`); 

    await initApp(); 
})();




