// HA hướng dẫn là cách học cách viết hàm render là thử với các giá trị của hàm state khác nhau. 
// Quá tuyệt vời. Cách HA chỉ quá tuyệt vời. Nỗ lực thì đạt được theo như nỗ lực đó. Khác với việc làm không thuận lí, dù có nỗ lực cũng không đạt được theo như nỗ lực bỏ r

console.log("test.js loaded")



// 0. STATE
const VALID_PAGES = ["LOG_IN", "SIGN_UP", "HOME", "TEACHING_WORDS", "LIFE_LESSONS", "ENTITY"]; 


const state = {
    user: {
        id: 1, 
        fullname: "HA va Tung", 
        email: "exampleEmail", 
        username: "havatung", 
        role: "USER",
        updatedAt: new Date()
    }, 

    page: "ENTITY",
    currentEntity: {
        type: "LIFE_LESSON", 
        id: 1
    }, 


    newEntityType: null, 

    cache: {
        teachingWords: {}, 
        lifeLessons: {}, 
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
        error: null, 
        fabOpen: false
    }

};


const RENDER_LOG = "            1. RENDER"; 
const INIT_LOG = "5. INIT"; 


function isValidPage(page) {
    return VALID_PAGES.includes(page); 
}


// ============== 1. RENDER ===============
// hàm mà render toàn bộ trang web từ nguồn sự thật, mình nghĩ là mình sẽ viết pseudo code trước 
function render() {
    console.log(`${RENDER_LOG} vào hàm lớn render`); 
    
    // Mình nghĩ phần này sẽ là hiệu chỉnh logic tự thân của state, ví dụ ở dưới 
    // 1. có user chưa? Nếu có thì check page, nếu là signup hay login thì chuyển hướng sang home. Còn không thì vào đúng chỗ. Nếu không thì check có phải là login hoặc signup không? nếu không thì tự động chuyển sang login 
    // bước này hơi giống tự check logic của chính nó trước rồi mới render. 
    // kiểm tra các giá trị hợp lệ, nếu không thì ghi là LOG_IN 
    if (!isValidPage(state.page)) {
        state.page = "LOG_IN"; 
    }

    if (state.user) {
        if (state.page === "LOG_IN" || state.page === "SIGN_UP") {
            state.page = "HOME"; 
        }
    } else {
        if (state.page !== "LOG_IN" && state.page !== "SIGN_UP") {
            state.page = "LOG_IN"; 
        }
    }



    // 2. render page phù hợp
    renderPage(); 

    // 3. render ui state như loading, disabled, fabOpen. 


    // câu hỏi đặt ra là render page trước hay render ui state trước? Vì phải có gì đó thì mới có trạng thái của cái đó nên là render page trước. 
}



// hiển thị và tạo nội dung trang phù hợp
function renderPage() {
    console.log(`${RENDER_LOG} 1. vào hàm renderPage`); 

    // 1. ẩn tất cả các trang 
    document.querySelectorAll("[data-page]").forEach(el => el.classList.add("hidden")); 

    // 2. nếu không có user, thì nếu là login hay signup thì hiển thị trang tương ứng lên. 
    // nếu có user thì hiển thị tương ứng page theo role, ngoại trừ ENTITY LÀM THÊM BƯỚC PHỤ LÀ MỞ data-entity-type nữa. 
    if (!state.user) {
        document.querySelector(`[data-page="${state.page}"`).classList.remove("hidden"); 
    } else {
        document.querySelector(`[data-user-role="${state.user.role}"] [data-page="${state.page}"]`).classList.remove("hidden"); 

        if (state.page === "ENTITY") { 
            // hide all entity-type 
            document.querySelectorAll("[data-entity-type]").forEach(el => el.classList.add("hidden")); 
            document.querySelector(`[data-user-role="${state.user.role}"] [data-page="ENTITY"] [data-entity-type="${state.currentEntity.type}"]`).classList.remove("hidden"); 
        }
    }
}





// ============== 5. INIT =================
(() => {
    console.log(`${INIT_LOG} vào tầng init, chạy mặc định ban đầu với biến state: ${state}`);
    render(); 
})();