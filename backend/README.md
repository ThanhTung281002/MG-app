# BACKEND OF MG APP 

Các tầng của backend có những quy ước và mối quan tâm riêng. 

## Tầng API ENDPOINTS
- Chỉ quan tâm tới api request: path, query và method. 
- Sử dụng tầng DOMAIN
- Có thể báo lỗi và trạng thái HTTP. 


## Tầng DOMAIN LOGIC 
- chỉ quan tâm tới request dict, response dict và raise lỗi domain. 
- Sử dụng tầng DATABASE 



## Tầng DATABASE LOGIC 
- Chỉ quan tâm tới dữ liệu. Không check nghiệp vụ. 
- 4 điều cơ bản là CRUD. 
- Đối với create thì trả lại thông số tạo hoặc trả lại trạng thái tạo (thành công hay không?)
- Đối với read thì trả lại item (hoặc None) hoặc collection (có thể rỗng)
- Đối với cập nhập thì trả lại thông số updated_at hoặc trạng thái cập nhập hoặc số thông tin đã thay đổi. 
- Đối với xóa thì trả lại trạng thái xóa (thành công hay không)
