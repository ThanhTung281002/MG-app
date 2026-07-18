// ============== file này để giả lập giao tiếp với BE đơn giản vậy thôi =================
console.log("services/fakeServices.js loaded"); 


import { checkFullname, checkEmail, checkUsername, checkPassword, isEmailExisted, isUsernameExisted, createToken, saveToken, getUserIdFromToken } from "../utils/utils.js"; // đây là chỗ khiến code bị sai. 


const delay = 400; // 0ms - do ở giai đoạn hiện tại chưa làm loading hay gì cả nên chưa cần. Lúc làm thì sẽ set về 300ms 



// ======== FAKE DATA =========
export let fakeUsers = [
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
    }, 
    {
        id: 3, 
        fullname: "Nguyễn Thanh Tiến",
        email: "tien@gmail.com", 
        username: "tiennguyen", 
        password: "Tien123$", 
        role: "USER", 
        status: "PENDING", 
        created_at: new Date(), 
        updated_at: new Date()
    }, 
    {
        id: 4, 
        fullname: "Nguyễn Kiêm",
        email: "kiem@gmail.com", 
        username: "kiemnguyen", 
        password: "Kiem123$", 
        role: "USER", 
        status: "PENDING", 
        created_at: new Date(), 
        updated_at: new Date()
    }, 
    {
        id: 5, 
        fullname: "Đoàn Ngọc Anh Khoa",
        email: "khoa@gmail.com", 
        username: "khoadoan", 
        password: "Khoa123$", 
        role: "USER", 
        status: "REJECTED", 
        created_at: new Date(), 
        updated_at: new Date()
    }, 
    {
        id: 6, 
        fullname: "Đặng Quốc Kiệt",
        email: "kiet@gmail.com", 
        username: "kietdang", 
        password: "Kiet123$", 
        role: "USER", 
        status: "REJECTED", 
        created_at: new Date(), 
        updated_at: new Date()
    }, 
    
];



let fakeTeachingWords = [
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
    },
    {
        id: 2, 
        displayCode: "CNW26Y26", 
        title: "Hãy tìm kiếm. Hãy cầu xin. Sẽ đạt được", 
        content: `1. Chỉ có Kami mới có thể nói rằng vạn vật do Kami tạo ra có chứa đựng YM của Kami nên tốt.
Dù có YM của Kami đi chăng nữa thì con người phải tự nhận biết điều này thì mới vui mừng trong khi tận hưởng và sống.

2. Phải liên tục tìm kiếm điểm tốt thì bản thân con mới không bị thất vọng.

3. Đối với Kami, Sere, Miko, Ima cũng vậy, phải liên tục tìm kiếm những điểm tốt thì mới sống trong khi yêu thương mà không bị thất vọng do nhìn bằng sự chủ quan của mình.

4. Mỗi ngày nhất định phải tìm ra điểm tốt của Kami, Sere, Miko, Ima.
Mỗi ngày hãy thử tìm 10 điểm, dù không được thì ít nhất cũng phải tìm được 1 điểm. Dù vậy, cả đời này các con cũng không thể tìm hết được đâu. Điểm tốt của Kami, Sere, Miko, Ima có đến hơn cả triệu điểm.

5. Phải tìm thấy điểm tốt ở Kami, Sere, Miko, Ima, và NSM thì dù có chuyện gì xảy ra cũng không thất vọng, mà nhờ điểm tốt đó, TYT sẽ không thay đổi trong khi vừa vui mừng và yêu thích vừa mở tiệc mỗi ngày trong khi sống.

6. Nếu không biết người sẽ cứu mình thì người đó không thể vớt mình lên được. Người đó chỉ cứu những người có YM. YM đó chính là ‘việc biết rằng người đó chính là người cứu mình’.

7. Điểm tốt nhất của Đ Mesia chính là ‘việc Ngài savi cho thì sẽ được sống vĩnh hằng’. Nếu không phải Đ Mesia thì ai sẽ ban cho sự savi đây. Không phải cứ even thì đó là sự savi. Đ Mesia phải tha thứ sin, ban MG hoàn hảo để làm cho thoát khỏi cái chết, thông qua đó Ngài mới có thể savi khỏi sin.

8. Giống như vậy, giống như việc tìm kiếm điểm tốt của Đ Mesia Ima,
phải tìm kiếm điểm tốt của người được gửi đến trong thời đại, tìm kiếm điểm tốt của anh chị em, và chính mình phải tự tìm ra điểm tốt của bản thân thì mới bùng cháy hy vọng trong Yoksa PH.

9. Phải liên tục tìm kiếm xem ‘Yoksa 1000 năm’ này tốt đến mức nào
thì mới không bị thất vọng.

10. (Video)
Dù Kami có sáng tạo nên bản thân tốt đẹp đến mấy nhưng nếu không tìm thấy điểm tốt của mình thì sẽ sống trong sự thất vọng. Điều này giống hệt như đang leo lên vách núi cuộc đời phải tìm được chỗ đặt chân thì mới leo lên được, nhưng vì không tìm thấy chỗ đặt chân nên không thể leo lên.
Do đó Ngài bảo hãy nhanh chóng tìm kiếm. Phải nỗ lực tìm kiếm thì mới tìm thấy. Nếu tìm muộn thì sẽ không thể đặt chân và lăn nhào xuống.`, 
        updatedAt: Date.now()
    },
    {
        id: 3, 
        displayCode: "T4W26Y26", 
        title: "Người không vấp phạm vì Ta thì có phúc", 
        content: `1, Thời đại này cũng như vậy. 
Người hành động do bị dụ dỗ bởi những người nói xấu, sẽ hối hận mãi mãi. 

2. Dù trước đây đã từng vấp phạm nhưng nếu chiến thắng rồi quay trở lại 
thì Kami sẽ vừa thích thú trong khi phán: “Làm tốt lắm. Đã đến tốt.” 

3. Thiếu hiểu biết bao nhiêu thì sẽ mù lòa bấy nhiêu. 
Chuyên gia thì chỉ nhìn điểm tốt mà mua. 

4. Không được vấp phạm khi chỉ nhìn thấy một phần rất nhỏ. 

5. Con người cũng như vậy. 
Tất cả đều khó có thể hoàn hảo được. 
Phải nhìn thấy mặt tốt và thích thú. 
Những cái xấu còn lại, những điểm không tốt nếu sửa chữa và trưởng thành thì sẽ trở nên tốt hơn. 

6. Những người do Kami gửi đến vào mỗi thời đại đều hành động vì có YM của Kami, thế nhưng khi nhìn thấy điều này cũng có khi vấp phạm.

7. Kami ban cơ hội cho đến khi tỉnh táo lại, 
nhưng nếu vẫn không quay lại thì Ngài sẽ báo đúng theo hành vi. 
Lúc đó sẽ không có cơ hội để anna. 
Nếu không làm vào thời kỳ cơ hội thì sẽ trở thành Pi của cái chết. 

8. Bây giờ vô điều kiện phải làm xong những việc vì bản thân mình. 
 
9. Đừng từ bỏ mà hãy luôn hành động bên trong Nim, 
và phải hiệp một với Nim bằng suy nghĩ và tấm lòng phù hợp với MG thời đại rồi hành động. 

10. Quên Nim thì sẽ chết. 
Đây là MG của ss 
mà Kami, Sere, Miko, Ima luôn dạy cho.
`, 
        updatedAt: Date.now()
    }
]; 



let fakeLifeLessonsReflection = [
    {
        id: 1, 
        lifeLessonMainId: 1,
        reflection: `cảm nhận của mình`, 
        updatedAt: Date.now()
    },
    {
        id: 2, 
        lifeLessonMainId: 2, 
        reflection: `cảm nhận của mình`, 
        updatedAt: Date.now()
    },
    {
        id: 3, 
        lifeLessonMainId: 3, 
        reflection: `cảm nhận của mình`, 
        updatedAt: Date.now()
    },
    {
        id: 4, 
        lifeLessonMainId: 4, 
        reflection: `cảm nhận của mình`, 
        updatedAt: Date.now()
    },
    {
        id: 5, 
        lifeLessonMainId: 5, 
        reflection: `cảm nhận của mình`, 
        updatedAt: Date.now()
    },

]; 


let fakeLifeLessonsMain = [
    {
        id: 1, 
        title: "Thuyết con người", 
        mainContent: `Được biểu hiện là con người bên trong, nó tồn tại bằng hình thể có
các chi thể như mắt, mũi, tai, miệng…hình dáng và hình dạng đó
giống với BO, nhưng nó không già đi, hay bị bệnh tật, hay chết thối
rữa rồi biến mất như BO mà tồn tại mãi mãi. BO của bản thân là
nam thì YO của bản thân cũng là nam. BO là nữ thì YO cũng là nữ.`, 
        updatedAt: Date.now()
    }, 
    {
        id: 2, 
        title: "7 cấp độ luật lệ", 
        mainContent: `Thiên nhiên, con người và vũ trụ đã được tạo ra (không phải được phát minh, cũng không phải
được khám phá) bằng luật của HA. LC nói rõ bản chất của sự sáng tạo, mang đến trật tự và sự
sống. LC là biểu tượng, là luật, là chân lý và là con đường. Đó là lời hoàn hảo 100%. Lời đó không chứa đựng bất kỳ mâu thuẫn nào và bây giờ cũng vậy. HA đã tạo ra mỗi loài mang nét
độc đáo riêng. Và sự sáng tạo không hoàn thành ngay lập tức mà dần dần phát triển một cách
sáng tạo.`,
        updatedAt: Date.now()
    }, 
    {
        id: 3, 
        title: "Ê-li và chim quạ", 
        mainContent: `Nếu thật sự HA đã làm cho mang bánh và thịt tới cho Eli thì hà cớ
gì Ngài lại cho Eli ăn thông qua con quạ là con vật mang điềm báo
không lành như vậy? Và tại sao lại chỉ cho bánh và thịt trong số các
loại thức ăn? Hơn nữa Ngài lại chỉ ban cho bữa sáng và tối mà
không có bữa trưa? Tại sao phép lạ con quạ lại không diễn ra đối
với các mục sư lỗi lạc, vĩ đại trong thời đại này?`,
        updatedAt: Date.now()
    }, 
    {
        id: 4, 
        title: "Mặt trời đứng yên", 
        mainContent: ``, 
        updatedAt: Date.now()
    }, 
    {
        id: 5, 
        title: "Phê-rơ và con cá", 
        mainContent: ``, 
        updatedAt: Date.now()
    }, 
    

]; 

        




let fakePurposes = [
    {
        id: 1, 
        title: "Mình muốn làm ra app suy ngẫm LC để đọc và nghiền ngẫm LC tốt hơn", 
        hope: "HA sẽ luôn ở bên và làm cùng với mình", 
        status: "ACTIVE", 
        updatedAt: Date.now()
    }, 
    {
        id: 2, 
        title: "Mình muốn làm ra app suy ngẫm LC để đọc và nghiền ngẫm LC tốt hơn", 
        hope: "HA sẽ luôn ở bên và làm cùng với mình", 
        status: "ACTIVE", 
        updatedAt: Date.now()
    }, 
    {
        id: 3, 
        title: "Mình muốn làm ra app suy ngẫm LC để đọc và nghiền ngẫm LC tốt hơn", 
        hope: "HA sẽ luôn ở bên và làm cùng với mình", 
        status: "ACTIVE", 
        updatedAt: Date.now()
    }, 
]; 



let fakeActions = [
    {
        id: 1, 
        purposeId: 1, 
        context: "Làm UI động của web", 
        status: "INCOMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 2, 
        purposeId: 1, 
        context: "Làm UI động của web", 
        status: "INCOMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 3, 
        purposeId: 1, 
        context: "Làm UI động của web", 
        status: "INCOMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 4, 
        purposeId: 1, 
        context: "Làm UI tĩnh của web", 
        status: "COMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 5, 
        purposeId: 1, 
        context: "Thiết kế UI cho web", 
        status: "COMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 6, 
        purposeId: 2, 
        context: "Làm UI tĩnh của trang web", 
        status: "COMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 7, 
        purposeId: 2, 
        context: "Làm UI động của web", 
        status: "INCOMPLETE", 
        updatedAt: Date.now()
    }, 
    {
        id: 8, 
        purposeId: 3, 
        context: "Làm UI động của web", 
        status: "COMPLETE", 
        updatedAt: Date.now()
    }, 
    
]; 


let fakeNotes = [
    {
        id: 1, 
        displayCode: "N0001", 
        title: "NOTE TITLE 1", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce maximus ullamcorper ipsum, sit amet gravida augue pretium non. Nulla at.",
        type: "UNRESOLVED", 
        updatedAt: Date.now()
    }, 
    {
        id: 2, 
        displayCode: "N0002", 
        title: "NOTE TITLE 2", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce maximus ullamcorper ipsum, sit amet gravida augue pretium non. Nulla at.",
        type: "INSIGHT", 
        updatedAt: Date.now()
    }, 
    {
        id: 3, 
        displayCode: "N0003", 
        title: "NOTE TITLE 3", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce maximus ullamcorper ipsum, sit amet gravida augue pretium non. Nulla at.",
        type: "UNRESOLVED", 
        updatedAt: Date.now()
    }, 
    {
        id: 4, 
        displayCode: "N0004", 
        title: "NOTE TITLE 4", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce maximus ullamcorper ipsum, sit amet gravida augue pretium non. Nulla at.",
        type: "NONE", 
        updatedAt: Date.now()
    }, 
    {
        id: 5, 
        displayCode: "N0005", 
        title: "NOTE TITLE 5", 
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce maximus ullamcorper ipsum, sit amet gravida augue pretium non. Nulla at.",
        type: "UNRESOLVED", 
        updatedAt: Date.now()
    }, 
    
]; 


let fakeRelations = [
    {
        id: 1, 
        fromType: "TEACHING_WORD",
        fromId: 1,
        toType: "PURPOSE",
        toId: 1,
        createdAt: Date.now()
    }, 
    {
        id: 2, 
        fromType: "TEACHING_WORD",
        fromId: 1,
        toType: "PURPOSE",
        toId: 2,
        createdAt: Date.now()
    }, 
    {
        id: 3, 
        fromType: "TEACHING_WORD",
        fromId: 1,
        toType: "NOTE",
        toId: 1,
        createdAt: Date.now()
    }, 
    {
        id: 4, 
        fromType: "TEACHING_WORD",
        fromId: 1,
        toType: "NOTE",
        toId: 2,
        createdAt: Date.now()
    }, 
    {
        id: 5, 
        fromType: "LIFE_LESSON",
        fromId: 1,
        toType: "PURPOSE",
        toId: 3,
        createdAt: Date.now()
    }, 
    {
        id: 6, 
        fromType: "LIFE_LESSON",
        fromId: 1,
        toType: "NOTE",
        toId: 3,
        createdAt: Date.now()
    }, 
    
    
]; 






const API_LOG = "                       1.1 API"











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

    // thêm user mới vào fakeUsers
    fakeUsers.push({
        id: fakeUsers.length + 1, 
        fullname: fullname, 
        email: email, 
        username: username, 
        password: password, 
        role: "USER", 
        status: "PENDING", 
        created_at: Date.now(), 
        updated_at: Date.now()
    }); 

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

    return {
        id: user.id, 
        fullname: user.fullname, 
        email: user.email, 
        role: user.role, 
        status: user.status, 
        updatedAt: user.updated_at
    }
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

    if (!teachingWord) {
        throw new Error("Teaching Word not found"); 
    }
    // console.log(`${API_LOG} 🪛🪛🪛: teachingWord để trả lại cho api flow là: ${JSON.stringify(teachingWord, null, 2)}`); 

    return teachingWord; 
}




// HÀM LẤY ID CỦA CÁC BÀI HỌC GẦN NHẤT 
export async function getLifeLessonsReflectionReflection() {
    console.log(`${API_LOG} vào hàm giả lập lấy 3 bài học gần nhất`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 

    

    // 1. lấy 3 bài học đầu từ fakeLifeLessons và trả lại thôi 
    const lifeLessonsReflection = fakeLifeLessonsReflection.slice(0, 3).map(ll => ({
        id: ll.id
    })); 

    // console.log(`${API_LOG} 1. lifeLessons: ${JSON.stringify(lifeLessons, null, 2)}`); 

    return {lifeLessonsReflection}
}





// HÀM LẤY NỘI DUNG FULL CỦA MỘT LIFE LESSON TỪ GÓC NHÌN NGƯỜI DÙNG
export async function getLifeLessonReflection(id) {
    console.log(`${API_LOG} vào hàm lấy nội dung đầy đủ của bài học có id: ${id}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. kiểm tra id xem có trong cơ sở dữ liệu không? nếu không thì ném lỗi 
    const ll = fakeLifeLessonsReflection.find(ll => ll.id === id); 
    
    if (!ll) {
        console.log(`${API_LOG} 1. lỗi ở tầng api: không tìm thấy bài học người dùng`); 
        throw new Error("Life lesson not found"); 
    }


    // 2. điều chỉnh phù hợp 
    const newll = {...ll}; 
    const llm = fakeLifeLessonsMain.find(el => el.id === ll.lifeLessonMainId); 

    delete newll.lifeLessonMainId; 
    newll.title = llm.title; 
    newll.mainContent = llm.mainContent; 


    // 3. return phù hợp 
    return newll; 

}






// HÀM LẤY TOÀN BỘ ACTIVE PURPOSE 
export async function getActivePurposes() {
    console.log(`${API_LOG} vào hàm lấy toàn bộ mục đích active`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. lọc trong fakePurposes các purpose mà có status active thôi 
    // 2. trả lại theo format yêu cầu 
    const activePurposes = fakePurposes.filter(p => p.status === "ACTIVE").map(purpose => ({
        id: purpose.id
    })); 
    
    return {activePurposes};    
}





// HÀM LẤY PURPOSE THEO ID 
export async function getPurpose(id) {
    console.log(`${API_LOG} vào hàm lấy nội dung đầy đủ của mục đích có id: ${id}`); 
    
    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. tìm trong fakePurposes 
    // 2. trả lại theo format yêu cầu
    const purpose = fakePurposes.find(p => p.id === id); 


    if (!purpose) {
        throw new Error("Purpose not found"); 
    }

    return purpose; 
}





// HÀM LẤY HÀNH ĐỘNG CỦA MỤC ĐÍCH (ID)
export async function getActions(id) {
    console.log(`${API_LOG} vào hàm lấy hành động của mục đích: ${id}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. tìm actions trong fakeActions 
    // 2. trả lại theo format yêu cầu

    const actions = fakeActions.filter(action => action.purposeId === id); 

    return {actions}; 
}






// HÀM LẤY CÁC NOTE CHƯA ĐƯỢC GIẢI ĐÁP 
export async function getUnresolvedNotes() {
    console.log(`${API_LOG} vào hàm lấy các note chưa được giải đáp`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. tìm các note có type là UNRESOLVED
    // 2. return lại theo format
    const unresolvedNotes = fakeNotes.filter(note => note.type === "UNRESOLVED").map(note => ({
        id: note.id
    })); 

    return {unresolvedNotes}; 
}





// HÀM LẤY NOTE THEO ID
export async function getNote(id) {
    console.log(`${API_LOG} vào hàm lấy note có id: ${id}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. tìm note theo id
    // 2. return theo format
    const note = fakeNotes.find(n => n.id === id); 

    if (!note) {
        throw new Error("Note not found"); 
    }

    return note; 
}





// HÀM LẤY CÁC THỰC THỂ SINH RA TỪ THỰC THỂ ĐẦU VÀO 
export async function getBornEntities(type, id) {
    console.log(`${API_LOG} vào hàm lấy các thực thể sinh ra từ (${type}, ${id})`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // lấy toàn bộ các object mà có fromType và fromId giống với đầu vào 
    const born = fakeRelations.filter(r => r.fromType === type && r.fromId === id).map(e => ({
        id: e.toId, 
        type: e.toType
    })); 


    return {
        born
    }; 
}












// HÀM GỬI PURPOSE 
export async function purposeFreeWrite(type, id, purposeContext, hopeContext) {
    console.log(`${API_LOG} vào hàm gửi purpose mới có origin (${type}, ${id}) và purpose: ${purposeContext}, hope: ${hopeContext}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // làm gì trong này đây. 
    // 1. thêm một purpose mới vào fakePurposes, 
    // 2. thêm relation vào fakeRelations
    // 3. trả message tạo purpose thành công. 
    fakePurposes.push({
        id: fakePurposes.length + 1, 
        title: purposeContext, 
        hope: hopeContext, 
        status: "ACTIVE", 
        updatedAt: Date.now()
    }); 

    fakeRelations.push({
        id: fakeRelations.length + 1, 
        fromType: type, 
        fromId: id, 
        toType: "PURPOSE", 
        toId: fakePurposes.length, 
        createdAt: Date.now()
    }); 

    return {
        id: fakePurposes.length, 
        createdAt: Date.now()
    }; 
}





function getFirst5Words(text) {
    return text
        .trim()
        .split(/\s+/)
        .slice(0, 5)
        .join(" ");
}



function createCode(number) {
    return "N" + String(number).padStart(4, "0");
}



// HÀM GỬI NOTE
export async function noteFreeWrite(type, id, context) {
    console.log(`${API_LOG} vào hàm gửi note mới có origin (${type}, ${id}) và context: ${context}`); 


    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 

    // làm gì trong này đây. 
    // 1. thêm một note mới vào fakeNotes
    // 2. thêm relation vào fakeRelations
    // 3. trả message tạo note mới thành công
    fakeNotes.push({
        id: fakeNotes.length + 1, 
        displayCode: createCode(fakeNotes.length + 1), 
        title: getFirst5Words(context),
        content: context, 
        type: "NONE", 
        updatedAt: Date.now()
    })

    fakeRelations.push({
        id: fakeRelations.length + 1, 
        fromType: type, 
        fromId: id, 
        toType: "NOTE", 
        toId: fakeNotes.length, 
        createdAt: Date.now()
    }); 


    const thisNote = fakeNotes[fakeNotes.length - 1]; 

    return {
        id: thisNote.id, 
        displayCode: thisNote.displayCode, 
        title: thisNote.title,
        createdAt: thisNote.updatedAt
    }; 
}




// HÀM LƯU REFLECTION CỦA LIFE LESSON 
export async function updateLifeLessonReflection(id, reflection) {
    console.log(`${API_LOG} vào hàm update life lesson có id: ${id} với reflection: ${reflection}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. đầu tiên là check xem id có trong cơ sở dữ liệu không? Nếu không thì báo lỗi 
    const ll = fakeLifeLessonsReflection.find(ll => ll.id === id); 

    if (!ll) {
        throw new Error("Life lesson not found"); 
    }

    // 2. update thôi 
    ll.reflection = reflection; 

    // 3. trả lại theo yêu cầu
    return {
        updatedAt: Date.now()
    }
}




export async function updatePurpose(id, title, hope, status) {
    console.log(`${API_LOG} vào hàm cập nhập cho mục đích ${id} với title: ${title}, hope: ${hope}, status: ${status}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 



    // kiểm tra xem có nằm trong database không
    const purpose = fakePurposes.find(p => p.id === id); 

    if (!purpose) {
        throw new Error("Purpose not found"); 
    }

    // cập nhập vào thôi 
    purpose.title = title; 
    purpose.hope = hope; 
    purpose.status = status; 

    // trả theo yêu cầu
    return {
        updatedAt: Date.now()
    }

}






export async function updateAction(purposeId, actionId, context, status) {
    console.log(`${API_LOG} cập nhập cho action ${actionId} của purpose ${purposeId} với context: ${context}, status: ${status}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 


    // 1. kiểm tra purpose có tồn tại không
    const purpose = fakePurposes.find(p => p.id === purposeId); 

    if (!purpose) {
        throw new Error("Purpose not found"); 
    }

    // 2. kiểm tra action có tồn tại không
    const action = fakeActions.find(a => a.id === actionId); 

    if (!action) {
        throw new Error("Action not found"); 
    }

    // 3. kiểm tra action có thuộc đúng purpose không? 
    if (action.purposeId !== purpose.id) {
        throw new Error("Action not belong to purpose"); 
    }

    // 4. cập nhập action 
    action.context = context; 
    action.status = status; 

    // 4. trả theo yêu cầu 
    return {
        updatedAt: Date.now()
    }
}





export async function addAction(purposeId, context) {
    console.log(`${API_LOG} thêm action của purpose ${purposeId} với context: ${context}`); 

    // 0. giả lập delay BE 
    await new Promise(resolve => setTimeout(resolve, delay)); 

    // 1. kiểm tra xem purpose có tồn tại không? 
    const purpose = fakePurposes.find(p => p.id === purposeId); 

    if (!purpose) {
        throw new Error("Purpose not found"); 
    }


    // 2. thêm action vào fakeAction thôi
    const actionId = fakeActions.length + 1; 

    fakeActions.push({
        id: actionId, 
        purposeId: purposeId, 
        context: context, 
        status: "INCOMPLETE", 
        updatedAt: Date.now()
    }); 

    
    // 3. trả theo yêu cầu 
    return {
        id: actionId, 
        createdAt: Date.now()
    }
}





export async function updateNote(id, content, type) {
    console.log(`${API_LOG} vào hàm cập nhập ghi chú với nội dung: ${content}, type: ${type}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. check note có tồn tại không
    const note = fakeNotes.find(n => n.id === id); 

    if (!note) {
        throw new Error("Note not found"); 
    }

    // 2. cập nhập 
    note.content = content; 
    note.type = type; 


    // 3. trả theo yêu cầu
    return {
        title: note.title, 
        updatedAt: Date.now()
    }; 
}   




export async function deleteNote(id) {
    console.log(`${API_LOG} xóa note ${id}`);

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // 1. kiểm tra note có tồn tại không
    const note = fakeNotes.find(n => n.id === id);

    if (!note) {
        throw new Error("Note not found");
    }

    // 2. tìm toàn bộ relation mà note này sinh ra
    const bornRelations = fakeRelations.filter(r =>
        r.fromType === "NOTE" &&
        r.fromId === id
    );

    // 3. đệ quy xóa toàn bộ cây con
    for (const relation of bornRelations) {

        if (relation.toType === "NOTE") {
            await deleteNote(relation.toId);
        }

        if (relation.toType === "PURPOSE") {
            await deletePurpose(relation.toId);
        }
    }

    // 4. xóa toàn bộ relation liên quan tới note này
    fakeRelations = fakeRelations.filter(r => {

        // relation sinh ra từ note
        if (r.fromType === "NOTE" && r.fromId === id) {
            return false;
        }

        // relation mà note được sinh ra từ entity khác
        if (r.toType === "NOTE" && r.toId === id) {
            return false;
        }

        return true;
    });

    // 5. xóa chính note
    fakeNotes = fakeNotes.filter(n => n.id !== id);

    // 6. trả kết quả
    return {
        message: "Delete successfully"
    };
}




async function deletePurpose(id) {
    console.log(`${API_LOG} xóa purpose ${id}`);

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // 1. kiểm tra purpose có tồn tại không
    const purpose = fakePurposes.find(p => p.id === id);

    if (!purpose) {
        throw new Error("Purpose not found");
    }

    // 2. lấy toàn bộ thực thể sinh ra từ purpose này
    const bornRelations = fakeRelations.filter(r =>
        r.fromType === "PURPOSE" &&
        r.fromId === id
    );

    // 3. đệ quy xóa toàn bộ cây con
    for (const relation of bornRelations) {

        if (relation.toType === "NOTE") {
            await deleteNote(relation.toId);
        }

        if (relation.toType === "PURPOSE") {
            await deletePurpose(relation.toId);
        }
    }

    // 4. xóa toàn bộ action thuộc purpose này
    fakeActions = fakeActions.filter(a => a.purposeId !== id);

    // 5. xóa toàn bộ relation liên quan tới purpose
    fakeRelations = fakeRelations.filter(r => {

        // relation sinh ra từ purpose
        if (r.fromType === "PURPOSE" && r.fromId === id) {
            return false;
        }

        // relation sinh ra purpose
        if (r.toType === "PURPOSE" && r.toId === id) {
            return false;
        }

        return true;
    });

    // 6. xóa chính purpose
    fakePurposes = fakePurposes.filter(p => p.id !== id);

    // 7. trả kết quả
    return {
        message: "Delete successfully"
    };
}










export async function getAllTeachingWords() {
    console.log(`${API_LOG} lấy toàn bộ Lời Dạy`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. tạo một mảng rút gọn của Lời Dạy
    const teachingWords = fakeTeachingWords.map(tw => ({
        id: tw.id
    }))
    

    // 2. return theo yêu cầu 
    return {
        teachingWords: teachingWords
    }
}






export async function getAllLifeLessonsReflection() {
    console.log(`${API_LOG} lấy toàn bộ Bài học`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. tạo mảng rút gọn từ cơ sở dữ liệu 
    const lifeLessonsReflection = fakeLifeLessonsReflection.map(ll => ({
        id: ll.id
    })); 


    // 2. return theo yêu cầu 
    return {
        lifeLessonsReflection: lifeLessonsReflection
    }
}




export async function getPendingUsers() {
    console.log(`${API_LOG} lấy tất cả người dùng đang chờ duyệt`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));

    
    // 1. tạo một mảng mới mà phù hợp với api contract 
    const pendingUsers = fakeUsers.filter(u => u.status === "PENDING").map(u => ({
        id: u.id
    }));
    
    
    // 2. return theo yêu cầu 
    return {
        pendingUsers: pendingUsers
    }
}







export async function getRejectedUsers() {
    console.log(`${API_LOG} lấy tất cả người dùng bị từ chối`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));

    
    // 1. tạo một mảng mới mà phù hợp với api contract 
    const rejectedUsers = fakeUsers.filter(u => u.status === "REJECTED").map(u => ({
        id: u.id
    })); 


    // 2. return theo yêu cầu 
    return {
        rejectedUsers: rejectedUsers
    }
}









export async function getUser(id) {
    console.log(`${API_LOG} lấy thông tin đầy đủ của user có id: ${id}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. lấy user theo id, nếu không có thì báo lỗi 
    const user = fakeUsers.find(u => u.id === id); 

    if (!user) {
        throw new Error("User not found"); 
    }

    // 2. trả theo format 
    return {
        id: user.id, 
        fullname: user.fullname, 
        email: user.email
    }
}









export async function updateUserStatus(id, status) {
    console.log(`${API_LOG} update trạng thái ${status} của user ${id}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. kiểm tra xem user có tồn tại không? 
    const user = fakeUsers.find(u => u.id === id); 

    if (!user) {
        throw new Error("User not found"); 
    }


    // 2. cập nhập trạng thái 
    user.status = status; 


    // 3. return theo yêu cầu
    return {
        updatedAt: Date.now()
    }
}







export async function updateTeachingWord(id, title, content, date) {
    console.log(`${API_LOG} cập nhập cho lời dạy: ${id}, với title ${title}, content: ${content}, date: ${date}`);
    

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. kiểm tra có trong cơ sở dữ liệu không
    const teachingWord = fakeTeachingWords.find(tw => tw.id === id); 

    if (!teachingWord) {
        throw new Error("Teaching Word not found"); 
    }

    // 2. cập nhập 
    teachingWord.title = title; 
    teachingWord.content = content; 
    teachingWord.displayCode = dateToDisplayCode(date); 

    // 3. trả theo yêu cầu 
    return {
        updatedAt: Date.now()
    }
}





export async function getAllLifeLessonsMain() {
    console.log(`${API_LOG} lấy toàn bộ lời dạy nội dung chính`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. tạo bản rút gọn 
    const lifeLessonsMain = fakeLifeLessonsMain.map(el => ({
        id: el.id
    })); 


    // 2. return phù hợp 
    return {lifeLessonsMain}; 
}






export async function getLifeLessonMain(id) {
    console.log(`${API_LOG} lấy lời dạy nội dung chính có id: ${id}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. nếu không có thì báo lỗi 
    const llm = fakeLifeLessonsMain.find(el => el.id === id); 

    if (!llm) {
        throw new Error("Life lesson main not found"); 
    }


    // 2. trả 
    return llm; 
}







export async function updateLifeLessonMain(id, mainContent) {
    console.log(`${API_LOG} vào hàm cập nhập lời dạy chính của admin có id: ${id}, và nội dung chính cần cập nhập: ${mainContent}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // 1. nếu không có trong csdl thì báo not found
    const llm = fakeLifeLessonsMain.find(el => el.id === id); 

    if (!llm) {
        throw new Error("Life lesson main not found"); 
    }


    // 2. cập nhập 
    llm.mainContent = mainContent; 


    // 3. trả theo yêu cầu 
    return {
        updatedAt: Date.now()
    }; 

}   








export async function addTeachingWord(title, date, content) {
    console.log(`${API_LOG} vào hàm thêm lời dạy mới với chủ đề: ${title}, ngày thêm: ${date}, nội dung: ${content}`); 

    // 0. giả lập delay
    await new Promise(resolve => setTimeout(resolve, delay));


    // thêm thôi 
    fakeTeachingWords.push({
        id: fakeTeachingWords.length + 1, 
        displayCode: dateToDisplayCode(date), 
        title: title, 
        content: content, 
        updatedAt: Date.now()
    })


    return {
        id: fakeTeachingWords.length, 
        createdAt: Date.now()
    }
}








function dateToDisplayCode(date) {
    // date dạng dd/mm/yyyy
    const [dayText, monthText, yearText] = date.split("/");

    if (!dayText || !monthText || !yearText) return "";

    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);

    const jsDate = new Date(year, month - 1, day);

    if (
        jsDate.getFullYear() !== year ||
        jsDate.getMonth() !== month - 1 ||
        jsDate.getDate() !== day
    ) {
        return "";
    }

    const { weekday, week } = getTeachingWordDateParts(jsDate);

    const dayPart = weekday === 1 ? "CN" : `T${weekday}`;
    const yearPart = String(year).slice(-2);

    return `${dayPart}W${week}Y${yearPart}`;
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








