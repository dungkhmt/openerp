# Các bước chạy module Warehouse Management System Version 2 
1. Nếu chạy local lần đầu, cần chạy file schema init_schema.sql và file seed.sql để khởi tạo các tables cho việc login, permission
2. Chạy file schema init_schema.sql để khởi tạo các tables của module 
3. Đăng nhập bằng tài khoản admin/openerp@123456

4. Phân quyền trong module
- Các roles trong module gồm: Admin, Nhân viên kho, Thủ kho
- Tạo mới kho: Admin
- Xem danh sách kho: All

# Các chức năng của màn hình xem danh sách kho
1. Bảng liệt kê các kho trong hệ thống (TODO: Giới hạn số lượng kho mà 1 user có thể nhìn thấy, hiện tại user đang nhìn thấy tất cả kho trong database)
2. Khi click vào một bản ghi của kho, hệ thống hiển thị thông tin chi tiết của kho (tái sử dụng màn hình tạo mới kho -> cho phép người dùng chỉnh sửa thông tin kho luôn -> Bài toán phân quyền ở đây là ai có thể sửa thông tin kho)
3. Tạo 1 button bản đồ ở bên màn hình chính, khi click vào sẽ nhìn thấy các kho của mình trên bản đồ -> khi click vào vị trí của kho (được đánh dấu đỏ sẽ hiển thị thông tin chi tiết của kho đó)

# TODO 21-02-2023:
- Thêm table company và mapping user vào company (1 user có 1 company), mapping company với facility (1 company có thể có nhiều facility)
- Đổi tên entity giống với 07-schema
- Tăng tốc độ code
Kịch bản sử dụng cho người muốn mua hàng: Customer Vào xem sản phẩm -> Customer Tạo đơn hàng -> Hệ thống khởi tạo đơn hàng -> Saler phê duyệt đơn hàng -> Hệ thống khởi tạo đơn xuất kho -> Thủ kho phê duyệt đơn xuất kho (Hệ thống tự động tính toán và đưa ra cách lấy hàng để phù hợp với đơn hàng) -> Thành công (có thể xem xét việc assign cho tài xế giao hàng)

# Cách chạy project (Ubuntu)
Run each command in sparate terminal 
```agsl
mongod --port 27017 --dbpath /home/dinh/Documents/HUST/thesis/db/mongo27017/ --replSet rs0
```
```agsl
mongod --port 27018 --dbpath /home/dinh/Documents/HUST/thesis/db/mongo27018 --replSet rs0
```
```agsl
mongod --port 27019 --dbpath /home/dinh/Documents/HUST/thesis/db/mongo27019/ --replSet rs0
```
```agsl
mongosh --port 27017
```
```agsl
sudo docker run -d -p 6379:6379 redis
```
- Docker name dang su dung: a03 (postgre) va 2ff (redis)
