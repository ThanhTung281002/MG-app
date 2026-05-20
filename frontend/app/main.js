console.log("main.js loaded")
// 1. HA HƯỚNG DẪN LÀ ĐỂ ÔN LẠI THÌ LÀM ĐÓ LÀ CLICK THÌ ĐỔI TRẠNG THÁI STATE PAGE 
// 2. HA hướng dẫn là để viết tốt hàm render thì hãy thử với nhiều giá trị state khác nhau và chạy thử trong tầng 5 init

import {login, getMe, signup} from "./services/fakeServices.js"


const DOM_LOG = "               0. DOM:"; 
const RENDER_LOG = "            1. RENDER:"; 
const API_FLOW_LOG = "           2. API FLOW:"; 
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

}


























// ============== 1. RENDER ===============
// hàm mà render toàn bộ trang web từ nguồn sự thật, mình nghĩ là mình sẽ viết pseudo code trước 
function render() {
    console.log(`${RENDER_LOG} vào hàm lớn render`); 


    // 1. render page phù hợp
    renderRoute(); 

    // 2. render ui state như loading, disabled, fabOpen. 
    renderUIState(); 

    // câu hỏi đặt ra là render page trước hay render ui state trước? Vì phải có gì đó thì mới có trạng thái của cái đó nên là render page trước. 
}



// hiển thị trang phù hợp theo route trong state 
// function renderRoute() {
//     console.log(`${RENDER_LOG} 1. vào hàm renderRoute với state.route: ${JSON.stringify(state.route, null, 2)}`); 

//     // 1. ẩn tất cả các trang 
//     document.querySelectorAll("[data-page]").forEach(el => el.classList.add("hidden")); 

//     // 2. nếu không có user, thì nếu là login hay signup thì hiển thị trang tương ứng lên. 
//     // nếu có user thì hiển thị tương ứng page theo role, ngoại trừ ENTITY LÀM THÊM BƯỚC PHỤ LÀ MỞ data-entity-type nữa. 
//     if (!state.route.userRole) {
//         document.querySelector(`[data-page="${state.route.name}"`).classList.remove("hidden"); 
//     } else {
//         document.querySelector(`[data-user-role="${state.route.userRole}"] [data-page="${state.route.name}"]`).classList.remove("hidden"); 

//         if (state.route.name === "ENTITY") { 
//             // hide all entity-type 
//             document.querySelectorAll("[data-entity-type]").forEach(el => el.classList.add("hidden")); 
//             document.querySelector(`[data-user-role="${state.route.userRole}"] [data-page="ENTITY"] [data-entity-type="${state.route.currentEntity.type}"]`).classList.remove("hidden"); 
//         }
//     }
// }


function renderRoute() {
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
                renderReflectionTeachingWord(); 
                // renderlatestLifeLessons(); 
                // renderPurposes(); 
                // renderUnresolvedNotes(); 



            } else if (state.route.name === "TEACHING_WORDS") {
                showUserTeachingWordsPage(); 


            } else if (state.route.name === "LIFE_LESSONS") {
                showUserLifeLessonsPage(); 


            } else {
                showUserEntityPage(); 


            }



        } else {
            if (state.route.name === "HOME") {
                showAdminHomePage(); 
            } else if (state.route.name === "TEACHING_WORDS") {
                showAdminTeachingWordsPage(); 
            } else if (state.route.name === "LIFE_LESSONS") {
                showAdminLifeLessonsPage(); 
            } else {
                showAdminEntityPage(); 
            }
        }
    }



}





// hiển thị các trạng thái ui của trang web như loading, error mà trước mắt thì mình sẽ làm với error
function renderUIState() {
    console.log(`${RENDER_LOG}  2. vào hàm render UI state với state.ui: ${JSON.stringify(state.ui, null, 2)}`); 

    if (state.ui.error) {
        alert(state.ui.error); 
    }
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







function renderReflectionTeachingWords() {
    console.log(`${RENDER_LOG}      1.3 render nội dung của Lời Dạy mới nhất`); 

    // 1. lấy dữ liệu teaching word 
    // 1.1 lấy id từ server 
    // 1.2 check trong cache, 
    // 1.2.1 nếu không có sẵn thì lấy từ server
    // 1.2.2 nếu có rồi thì lấy từ cache
    const {teachingWord} = getTeachingWordReflectionFlow(); 

    if (ExistsInCache(teachingWord.id, "TEACHING_WORD")) {
        const {tw} = getTeachingWordFlow(teachingWord.id); 
        // lưu vào cache 
    } else {
        // lấy từ cache 
    }

    // 2. render ra trang web. 

    
}


  

































// ================== 2. API FLOW ================
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
        console.log(`${API_FLOW_LOG} 1. lỗi ở signupFlow: ${err.message}`); 

        throw err; 
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
            } 
        } else if (route.userRole === "ADMIN") {
            if (route.name === "HOME") {
                return "/admin/home"; 
            } else if (route.name === "TEACHING_WORDS") {
                return "/admin/teaching-words"; 
            } else if (route.name === "LIFE_LESSONS") {
                return "/admin/life-lessons"; 
            } 
        }
    }
}




// ------- hàm điều hướng 
function navigate(route) {
    console.log(`${CONTROLLER_LOG}  1. hàm người dùng điều hướng tới route: ${JSON.stringify(route, null, 2)}`)

    // 1. update state
    state.route = route; 

    // 2. convert route to url 
    const url = toURL(route); 

    // 3. replace trong history 
    history.pushState(route, "", url); 

    // 4. render 
    render(); 
}

function redirect(route) {
    console.log(`${CONTROLLER_LOG}  1. hàm hệ thống tự điều hướng về route: ${JSON.stringify(route, null, 2)}`); 

    // 1. update state
    state.route = route; 

    // 2. convert route to url 
    const url = toURL(route); 

    // 3. replace trong history 
    history.replaceState(route, "", url); 

    // 4. render 
    render(); 
}


// ------- hàm khởi tạo app ---------------------------
// là những gì cần làm lúc reload lại page, mình hiểu như vậy
async function initApp() {
    console.log(`${CONTROLLER_LOG} vào hàm khởi tạo app`); 


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

            redirect({name: "LOG_IN"}); 
        } else {
            console.log(`${CONTROLLER_LOG}      1.1 route.name là login hoặc signup, route.name: ${route.name}`)

            redirect(route); 
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

            if (route.name === "HOME" || route.name === "TEACHING_WORDS" || route.name === "LIFE_LESSONS" || route.name === "ENTITY") {
                console.log(`${CONTROLLER_LOG}          1.1.1 route thuộc home hoặc teaching words, life lessons hoặc entity`); 

                redirect(route); 
            } else {
                console.log(`${CONTROLLER_LOG}          1.1.1 route không thuộc home hoặc teaching words, life lessons hoặc entity`); 

                redirect({name: "HOME", userRole: "USER"}); 
            }


        } catch {
            console.log(`${CONTROLLER_LOG}      1.1 user không hợp lệ`)

            localStorage.removeItem("accessToken"); 
            redirect({name: "LOG_IN"}); 
        }
    }

}



// ----- hàm để xử lí sự kiện popState
function handlePopState(currRoute) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí pop state với currRoute: ${JSON.stringify(currRoute, null, 2)}`); 

    // 1. kiểm tra xem còn token không? 
    // 1.1 nếu không có token thì kiểm tra currRoute có userRole không? 
    // 1.1.1 nếu không có thì ok, nếu có thì quay về login 

    const token = localStorage.getItem("accessToken"); 

    if (!token) {
        if (currRoute.userRole)  {
            redirect({name: "LOG_IN"}); 
        } else {
            state.route = currRoute;
            render(); 
        }
    } else {
        state.route = currRoute; 
        render(); 
    }

    // nói chung là nó đơn giản hơn cả cái initAPP nhưng tương tự

}










// ======= ROUTE: LOGIN ======
// --------- Hàm xử lí thao tác login -----------
async function handleLogin(username, password) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí login với username: ${username}, password: ${password}`); 

    state.ui.error = null; 

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
        redirect({name: "HOME", userRole: user.role}); 

    } catch(err) {
        state.ui.error = err.message; 

        console.log(`${CONTROLLER_LOG} lỗi ở handleLogin: ${err.message}`); 

        render(); 
    }

}


// ------ hàm xử lí chuyển hướng sang trang đăng kí ----
function handleRedirectToSignUpPage() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí chuyển hướng đăng kí trong trang đăng nhập`); 

    state.ui.error = null; 
    navigate({name: "SIGN_UP"}); 
}












// ======= ROUTE: SIGNUP =======


// ------ hàm xử lí chuyển hướng sang trang đăng nhập ------
function handleRedirectToLogInPage() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí chuyển hướng đăng nhập trong trang đăng kí`); 

    state.ui.error = null; 
    navigate({name: "LOG_IN"}); 
}




// ------ hàm xử lí đăng kí ---------
async function handleSignup(fullname, email, username, password) {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí đăng kí với họ tên: ${fullname}, email: ${email}, username: ${username}, password: ${password}`); 

    // logic chính của nó là gì? Mình muốn nó làm gì? 

    // 1. gửi cho server, chờ nhận trả lời từ server. Server trả về cái gì nhỉ? là message báo đăng kí thành công. 
    // 2. vậy không làm gì cả mà tự động chuyển qua trang login 
    state.ui.error = null; 

    try {
        const {message} = await signupFlow(fullname, email, username, password); 

        navigate({name: "LOG_IN"}); 
    } catch (err) {
        state.ui.error = err.message; 

        console.log(`${CONTROLLER_LOG} 1. lỗi ở handleSignup: ${err.message}`); 

        render(); 
    }
}




// ======= ROUTE: HOME USER ========
function handleLogOut() {
    console.log(`${CONTROLLER_LOG} vào hàm xử lí đăng xuất`); 

    // 1. xóa token 
    localStorage.removeItem("accessToken"); 
    state.user = null; 

    // 2. điều hướng về login 
    redirect({name: "LOG_IN"}); 

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
document.getElementById("sign-up-helper").addEventListener("click", () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút chuyển hướng đăng kí trong trang đăng nhập`); 

    handleRedirectToSignUpPage(); 
});













// ========== ROUTE: SIGN_UP ==========
// ----- sự kiện click vào nút đăng nhập ----------
document.getElementById("log-in-helper").addEventListener("click", () => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào nút chuyển hướng đăng nhập trong trang đăng kí`); 

    handleRedirectToLogInPage(); 
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
document.querySelector('[data-user-role="USER"] [data-page="HOME"] .drawer-side').addEventListener("click", (event) => {
    console.log(`${EVENT_HANDLER_LOG} sự kiện click vào side navigation của trang user home`); 

    const target = event.target.closest("li, button"); 
    

    if (!target) return; 

    if (target.matches("li")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử li`); 
        console.log(`${EVENT_HANDLER_LOG}   1.2 phần tử li có data.route là: ${target.dataset.route}`); 

        navigate({name: target.dataset.route, userRole: "USER"}); 
    }

    if (target.matches("button")) {
        console.log(`${EVENT_HANDLER_LOG}   1.1 click vào phần tử button`)

        handleLogOut(); 
    }

}); 























// ================== 5. INIT ===============
// Khi cần làm gì đó mặc định lúc đầu - ngang hàng với event handler và sử dụng các hàm của controller 
(async () => {
    console.log(`${INIT_LOG} vào tầng init`); 

    await initApp(); 
})();




