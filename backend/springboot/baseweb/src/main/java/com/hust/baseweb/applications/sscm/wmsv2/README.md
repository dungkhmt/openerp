# Các bước chạy module Warehouse Management System Version 2 
1. Nếu chạy local lần đầu, cần chạy file schema init_schema.sql và file seed.sql để khởi tạo các tables cho việc login, permission
2. Chạy file schema init_schema.sql để khởi tạo các tables của module 
3. Đăng nhập bằng tài khoản admin/openerp@123456

4. Phân quyền trong module
- Các roles trong module gồm: Admin, Nhân viên kho, Thủ kho
- Tạo mới kho: Admin
- Xem danh sách kho: All
TODO:

Thêm table company và mapping user vào company (1 user có 1 company), mapping company với facility (1 company có thể có nhiều facility)

