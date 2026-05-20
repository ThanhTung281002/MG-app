# LOG 








## 20.05.2026 23h17 
- [ ] Hoàn thành 

### Context
- Đang làm phần UI động. 
- Đang làm cho trang user home. 
- Đang làm cho phần load dữ liệu lên trang user home. 

### Đã làm
- Xử lí xong vấn đề tầng render cao hơn tầng api flow. Chỉnh sửa lại code. 
- Xử lí xong vấn đề error đi trước render page và render ui. Chỉnh sửa lại code. 
- Đã làm xong cho phần load dữ liệu MG tuần đó lên trang home. 
    - Tuy chỉ nói đơn giản như vậy nhưng thực sự có nhiều cái cần chỉnh lại ở đây như hàm render, phải chỉnh lại phù hợp như: 
        1. Chia nhánh cho từng route. 
        2. kiểm tra dữ liệu trong cache. 
        3. load nội dung lên DOM từ js như thế nào. 
        4. debug các lỗi xuất hiện trong fakeServices.js 
        5. Và đặc biệt nhất là làm được điều mà lúc đầu suy nghĩ nghĩ là quá nhiều và không hình dung được sẽ làm như thế nào.

> Bài học: Phải kiểm soát được suy nghĩ bằng LC (Lời dạy của HA, SERE và R). Xử lí từng điều một bằng việc tập trung làm một việc. Nghĩ là nó đơn giản hơn so với suy nghĩ lúc đầu của mình (nghĩ con hổ là con mèo thôi). Đặc biệt là phải làm hợp tấm lòng của mình đối với trình duyệt (nó làm việc tuần tự trung thực, không báo cáo dối, có lỗi thì sẽ báo lỗi, và vì tuần tự nên có thể ra lệnh cho nó để tìm ra lỗi nằm ở đâu, vị trí nào, lỗi gì) nên tấm lòng của bản thân phải làm dịu lại và nhìn kĩ hơn các điểm mạnh của trình duyệt mà tấm lòng phải làm hợp theo để tiếp tục làm. Chứ cáu gắt và bực bội vì trình duyệt không làm hợp với tấm lòng gấp gáp của mình thì chắc mãi sẽ không làm được. Đúng là LC của HA. 


### Đang kẹt / dở
- Không có điều gì, vì gỡ hết lỗi tiềm tàng và điểm xấu trong code cả rồi. 

### Hướng làm tiếp
Việc cần làm: 
1. load dữ liệu Bài giảng, mục đích, note. 

----------------






## 18.05.2026 22h22 
- [x] Hoàn thành 

### Context
- Đang làm phần UI động. 
- Đang làm cho trang user home. 
- Đang làm cho sự kiện đăng xuất và sự kiện quay lại các trang sao cho hợp logic. 

### Đã làm
- Đã làm xong vấn đề khi reload thì mất token bên fake server, lưu trữ trong localStorage để browser có thể check khi gọi getMe. 
- Đã làm xong việc tạo sự kiện di chuyển giữa các trang khi ở trong trang home. 
- Đã làm xong sự kiện đăng xuất khi click vào nút đăng xuất. 





### Đang kẹt / dở
- Khi đăng xuất thì khi quay lại thì đáng lẽ không vào được trang home từ login nhưng vẫn vào lại được. Cảm giác là nó không cần lắm hay sao á

### Hướng làm tiếp
Việc cần làm: 
1. Xử lí lỗi trên. 
2. load các dữ liệu như MG, BG, mục đích, note. 

----------------






## 13.05.2026 14h04 
- [x] Hoàn thành 

### Context
- Đang làm UI động. 
- Hiện tại đã xong cho trang signup và login. 
- Đang làm ở file `frontend/app/main.js`

### Đã làm
- Đã làm xong toàn bộ sự kiện cần thiết ở trang Login và signup. 

### Đang kẹt / dở
- Hơi đọc lại hệ thống để hiểu cách nó hoạt động. 
- vì còn lỗi đó là login vào rồi thì khi reload lại thì nó quay về login vì mất token lưu bên fakeServices. 

### Hướng làm tiếp
- Làm cho trang role user, home. 

----------------




## 12.05.2026
- [x] Hoàn thành 

### Context
- Làm UI động + fake API. 
- Đang làm tại `frontend/app/main.js`


### Đã làm
> note: làm lâu rồi mà mình quên log lại nên o|^. Nên giờ không nhớ là đã làm xong cái gì, nhưng mình nhớ là khá nhiều sẽ note ra theo thứ tự. 

Các phần việc đã làm xong: 
1. Ứng dụng history vào app. 
2. Sử dụng và hiểu url, route. 
3. Thay đổi page trong state thành route, hợp lí hơn. 
4. Đổi từ việc chạy frontend bằng live server thành chạy bằng express.js nhằm khi tạo url thì không phải là vào một đường dẫn nào đó theo url (vì đường dẫn đó thực sự không có). Và chỉnh sao cho mọi đường dẫn vào `frontend/app/index.html`. 
5. Làm cái sự kiện popstate (sự kiện mà quay lại và loại bỏ một entry mới nhất ra khỏi history và render lại nó)


### Đang kẹt / dở

### Hướng làm tiếp 
- Làm các sự kiện tương tác của trang signup 

----------------




## 24/04/2026 14h50 
- [x] Hoàn thành 

### Context
- Làm UI động + fake API. 
- Đang làm tại `frontend/app/main.js`

### Đã làm
- Đã code xong cho hàm `handleLogin` 
- Học thêm về token và cách sử dụng, cũng như ôn lại cách code các tầng với nhau cũng như vai trò từng tầng. Đặc biệt ôn lại về tầng api flow. 

### Đang kẹt / dở

### Hướng làm tiếp
- Code xuống các tầng dưới như render, api flow và cả cho thư mục services để làm fake api và api thật (sau này). Cũng cho hàm `handleLogin`. 

----------------



## 22.04.2026 9h01 
- [x] Hoàn thành 

### Context
- Chuyển qua phần UI động + fake API. Tức là sự tương tác và code chính thức JS. 
- Đang làm ở file `frontend/app/index.html` và `frontend/app/main.js`


### Đã làm
- Đã hoàn thành xong phần UI HTML tĩnh. 


### Đang kẹt / dở


### Hướng làm tiếp
- Suy nghĩ thứ tự các bước nhỏ hơn trong làm UI động. Đặc biệt là cách làm state driven UI. 


----------------







## 20.04.2026
- [x] Hoàn thành 

### Context
- Đang làm cho phần hoàn thiện cho phần UI Tĩnh HTML (tất cả những gì nhìn thấy ngay, khi chưa tương tác, cũng như các trạng thái)
- Đang làm ở file `frontend/app/index.html`


### Đã làm
- Đã làm xong phần fab. 

### Đang kẹt / dở
- Mình đang kẹt ở chỗ là không biết tập trung vào đâu, suy nghĩ chạy lung tung. Thấy cái này cũng cần sửa. Cái kia cũng cần sửa. Nên cảm giác nhiều và rối chạy đến. 


### Hướng làm tiếp
- Nhớ đến những điều HA đã dạy. Nhớ lại và trung tâm vào những điều đó và làm. 

> Note: HA dạy: làm ở mức vận hành được, chạy được, sử dụng được. Không phải mục đích là làm cho đẹp, hay cho ai đó coi và chờ khen. 

----------------





## 19.04.2026 21h51
- [x] Hoàn thành 

### Context
- Mình đang làm frontend/UI tĩnh cho thành phần fab. 
- Làm ở `frontend/app/index.html`


### Đã làm
- Đã làm side navigation. 

### Đang kẹt / dở

### Hướng làm tiếp
- Làm phần UI Tĩnh cho phần fab. 

> note: điểm yếu là suy nghĩ không tập trung vào cái cần làm mà chạy lung tung, nghĩ trước cho cái chưa làm nên loạn não. Nó muốn nhìn hình dung được thì nó làm từ từ từ dưới lên. Khi làm nhiều thì dần dần sẽ nhìn ra. Mình nhớ hồi xưa, HA dạy như vậy. Có gì ino hỏi HA thêm. 

----------------





## 22.03.2026 21h57
- [x] Hoàn thành 

### Context
- Đang làm vẽ ra các thành phần đầy đủ của ui hệ thống như fab, sidebar menu. 
- Đang làm ở file `frontend/app/index.html 

### Đã làm
- Đã hoàn thiện giao diện tĩnh cơ bản. 

### Đang kẹt / dở


### Hướng làm tiếp
- Làm và vẽ ra các thành phần tĩnh khác của hệ thống như fab, sidebar menu. 

----------------


## 20/03/2026
- [ ] Hoàn thành 

### Context
- Đang làm vẽ ra giao diện tĩnh cho hệ thống bằng html. 

### Đã làm
- Đã làm xong các phần giao diện tĩnh, nhìn thấy được ngay của guest, user. 

### Đang kẹt / dở


### Hướng làm tiếp
- Làm cho các trang của bên phía admin. 

----------------



## Ngày giờ
- [ ] Hoàn thành 

### Context
- Đang làm: thiết kế figma cho hệ thống. 

### Đã làm
- Thiết kế figma cho trang login, register, home, teaching-word, life-lesson, purpose, note. 


### Đang kẹt / dở
- Có nhiều cái chưa rõ do thiếu kinh nghiệm như sidebar, navbar trên điện thoại và thành phần UI khác. 
- Không có kiến thức nền của UI và UX để có thể tranh luận với các đề xuất của Chatgpt. Mà cũng không biết hướng làm từ đầu, chỉ làm theo cảm giác. 

### Hướng làm tiếp
- Tìm hiểu cơ bản về UI và UX và tiếp tục thiết kế figma cho các trang chưa làm như trang teaching-words và trang life-lessons.
- Thiết kế sidebar. 

----------------


## 24.02.2026 7h45
- [x] Hoàn thành 

### Context
- Mục tiêu đang làm: Chỉnh sửa api contract cho hệ thống. 

### Đã làm
- Đã hoàn thành cơ bản BE v1. 


### Đang kẹt / dở

### Hướng làm tiếp
- Chỉnh sửa api contract cho hệ thống rồi quay qua thiết kế figma cho hệ thống (cái này vui)

----------------



## 06/02/2026
- [x] Hoàn thành 

### Context
- Mục tiêu hiện tại: Lập trình api cho các domain. 
- file đang làm là api.py trong domain teaching_word


### Đã làm
- Đã hoàn thành việc thêm message và chuẩn hóa lỗi ở BE. 

### Đang kẹt / dở
- Chưa ghép nối cơ sở dữ liệu thật cho BE. 
- Chưa nắm cách phối hợp với chatGPT và codex như thế nào? 

### Hướng làm tiếp
- Ghép nối cơ sở dữ liệu thật cho BE. 
- Làm thử một dự án phối hợp nhanh với codex nhưng vẫn giữ những điều đã đặt ra lúc đầu: Mình là người làm chính và tư duy chính, AI là hỗ trợ 2 phần kiến trúc tổng thể và low level pair programmer. 

----------------



## Ngày giờ
- [x] Hoàn thành 

### Context
- Mục đích: làm ra hệ thống đọc và suy ngẫm LC. 
- Mục tiêu hiện tại: làm Backend, làm domain teaching words
- Đang làm tại file [api.py](./backend/app/domains/teaching_word/api.py)

### Đã làm
- Đã hoàn thành các api với các tầng hoàn chỉnh cho domain teaching-words với dữ liệu lưu ở mức server chạy, chưa phải lưu ở cơ sở dữ liệu dài hạn.  

### Đang kẹt / dở
- Chưa chuẩn hóa được cho raise lỗi http và http status code hoàn chỉnh để BE báo lại cho FE một cách rõ ràng. 


### Hướng làm tiếp
- Chuẩn hóa lỗi (message và status code) cho domain teaching words. 

----------------



## 4/2/2026 13h06 
- [x] Hoàn thành 

### Context
- Mục đích: hành động là mục đích. Hành động là làm ra được app MG App để sử dụng cá nhân, để suy ngẫm và đọc LC. 
- Mục tiêu hiện tại: Điều chỉnh lại url cho phù hợp. 


### Đã làm
- Đã xử lí được url api cho phù hợp với nguyên tắc đọc của backend. 


### Đang kẹt / dở
- Chưa Chỉnh lại ở luồng người dùng mà mô tả bằng api. 

### Hướng làm tiếp
- Làm backend cho teaching word domain. 

----------------








------------------------------



## Ngày giờ
- [ ] Hoàn thành 

### Context

### Đã làm

### Đang kẹt / dở

### Hướng làm tiếp

----------------