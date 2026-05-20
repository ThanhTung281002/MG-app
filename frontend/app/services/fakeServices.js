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



const fakeTeachingWords = [
    {
        id: 1, 
        displayCode: "T4W23Y26", 
        title: "Hãy làm hợp tấm lòng với đối tượng hoặc vật tồn tại đối tượng", 
        content: `Đừng làm hợp tấm lòng mình,

mà phải vừa làm hợp tấm lòng bản thân với hình dáng và hình tượng thực tế đang tồn tại,

vừa phải vui mừng và thích nó.

Nếu có ý định đạt được đá cảnh, bảo vật hay con người bằng cách làm hợp tấm lòng mình

thì có khi cả đời cũng không đạt được.`, 
        updatedAt: Date.now()
    }
]; 


const API_LOG = "                       1.1 API"
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

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 

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

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


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





// hàm lấy id của lời dạy hiện tại
export async function getTeachingWordReflection() {
    console.log(`${API_LOG} vào hàm lấy lời dạy hiện tại`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 

    // nhưng hiện tại mình sẽ lấy lời dạy đầu thôi, không có thuật toán nhiều 
    const tw = fakeTeachingWords[0]; 

    return {
        teachingWord: {
            id: tw.id
        }
    }
}





// hàm lấy nội dung đầy đủ của một lời dạy từ id 
export async function getTeachingWord(id) {
    console.log(`${API_LOG} vào hàm lấy nội dung đầy đủ của lời dạy có id: ${id}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. từ id lọc trong cơ sở dữ liệu thôi
    const teachingWord = fakeTeachingWords.find(tw => tw.id === id); 

    return teachingWord; 
}