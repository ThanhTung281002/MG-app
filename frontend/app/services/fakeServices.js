// ============== file này để giả lập giao tiếp với BE đơn giản vậy thôi =================
console.log("services/fakeServices.js loaded"); 


import { checkFullname, checkEmail, checkUsername, checkPassword, isEmailExisted, isUsernameExisted, createToken, saveToken, getUserIdFromToken } from "../utils/utils.js"; // đây là chỗ khiến code bị sai. 


// ======== FAKE DATA =========
export const fakeUsers = [
    {
        id: 1, 
        fullname: "Nguyễn Thanh Tùng",
        email: "tung@gmail.com", 
        username: "tungnguyen", 
        password: "Tung123$", 
        role: "USER", 
        status: "APPROVED", 
        created_at: new Date(), 
        updated_at: new Date()
    }, 
    {
        id: 2, 
        fullname: "Trần Huy Khiêm",
        email: "khiem@gmail.com", 
        username: "khiemtran", 
        password: "Khiem123$", 
        role: "ADMIN", 
        status: "APPROVED", 
        created_at: new Date(), 
        updated_at: new Date()
    }
];

const API_LOG = "               2.1 API"
const delay = 0; // 300ms 









// ------- giả lập login ----------
export async function login(username, password) {
    console.log(`${API_LOG} vào login với username: ${username}, password: ${password}`); 



    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. check hợp lệ username và password
    // username phải có ít nhất 5 kí tự và password phải có ít nhất 1 kí tự thường, 1 kí tự hoa, 1 kí tự số và 1 kí tự đặc biệt
    if (!checkUsername(username)) {
        throw new Error("Username must have at least 5 characters"); 
    } else if (!checkPassword(password)) {
        throw new Error("Password must have at least 1 lower character, 1 upper character, 1 number and 1 special character"); 
    }

    // 2. kiểm tra xem có user nào với username và password ở trên hay không? 
    const user = fakeUsers.find(u => u.username === username && u.password === password); 

    if (!user) {
        throw new Error("Invalid username or password"); 
    }

    
    // 3. tạo token 
    const token = createToken(); 
    console.log(`${API_LOG} 1. đã tạo token: ${token}`); 

    saveToken(token, user.id); 

    const data = {
        accessToken: token, 
        tokenType: "bearer"
    }


    // 4. trả về theo api contract
    return {
        data,
        message: "Login successfully"
    }
}




export async function signup(fullname, email, username, password) {
    console.log(`${API_LOG} vào signup với họ tên: ${fullname}, email: ${email}, username: ${username}, password: ${password}`); 

    // logic chính ở đây là check từng cái hợp lệ hay chưa
    // check email đã có ai xài rồi chưa
    // check username đã có ai xài rồi chưa 

    if (!checkFullname(fullname)) {
        throw new Error("Fullname must have at least 2 word with each word must have at least 2 characters"); 
    } else if (!checkEmail(email)) {
        throw new Error("Invalid input email"); 
    } else if (!checkUsername(username)) {
        throw new Error("Username must have at least 5 characters"); 
    } else if (!checkPassword(password)) {
        throw new Error("Password must have at least 1 lower character, 1 upper character, 1 number and 1 special character"); 
    }


    if (isEmailExisted(email)) { 
        throw new Error("Email's already existed!"); 
    } 

    if (isUsernameExisted(username)) {
        throw new Error("Username's already existed!"); 
    }

    return {
        message: "Signup successfully"
    }
}





// nó so sánh với token đã lưu trong db để xác định user, và trả lại user 
export async function getMe(token) {
    console.log(`${API_LOG} vào getMe với token: ${token}`); 

    // 1. so sánh với fakeToken để xác định người dùng 
    const userId = getUserIdFromToken(token); 

    console.log(`${API_LOG} 1. userId lấy từ token là: ${userId}`); 

    if (!userId) {
        throw new Error("Unauthorized - người dùng chưa xác thực"); 
    }

    // 2. lấy user và trả về
    const user = fakeUsers.find(u => u.id === userId); 

    return user; 
}

