# HỆ THỐNG QUẢN LÝ THƯ VIỆN
(Library Management System)

## 1. Giới thiệu

Hiện nay nhiều thư viện vẫn quản lý sách bằng phương pháp thủ công, gây khó khăn trong việc theo dõi mượn/trả sách và dễ xảy ra thất lạc.

Hệ thống Quản Lý Thư Viện được xây dựng nhằm số hóa quá trình quản lý thư viện, giúp người dùng có thể tìm kiếm sách, đặt trước sách, theo dõi lịch sử mượn và thanh toán phí phạt trực tuyến.

Hệ thống cũng hỗ trợ thủ thư quản lý sách và độc giả, đồng thời cung cấp các báo cáo thống kê cho quản trị viên.

---

# 2. Công nghệ sử dụng

Backend
- Spring Boot
- Spring Security
- RESTful API

Frontend
- ReactJS

Database 
- MySQL


Version Control
- Git
- GitHub

---

# 3. Vai trò trong hệ thống

Hệ thống có 3 vai trò chính:

1. Độc giả (Reader / End User)
2. Thủ thư (Librarian / Business User)
3. Quản trị viên (Admin)

---

# 4. Chức năng hệ thống

## 4.1 Độc giả (Reader)

1. Tìm kiếm sách theo:
   - tên sách
   - tác giả
   - danh mục

2. Xem thông tin chi tiết sách
   - tên sách
   - tác giả
   - nhà xuất bản
   - tình trạng sách

3. Mượn sách

4. Gia hạn sách

5. Xem lịch sử mượn sách

6. Thanh toán phí phạt

Option thanh toán:


Phương án 1
- VNPay

Phương án 2
- Momo

---

## 4.2 Thủ thư (Librarian)

1. Cho độc giả mượn sách (Check-out)

2. Nhận trả sách (Check-in)

3. Quản lý độc giả
   - thêm
   - sửa
   - xóa

4. Thêm sách mới vào hệ thống

5. Xử lý đặt trước sách

6. Thu phí phạt

---

## 4.3 Quản trị viên (Admin)

1. Quản lý danh mục sách

2. Quản lý tác giả

3. Quản lý nhà xuất bản

4. Quản lý tài khoản thủ thư

5. Xem báo cáo thống kê

6. Quản lý thông báo hệ thống

---

# 5. Yêu cầu hệ thống

## 5.1 Authentication

- Đăng ký
- Đăng nhập
- Phân quyền theo role

## 5.2 CRUD

Ít nhất 3 entity phải có CRUD đầy đủ:

- Books
- Users
- Categories

---

# 6. Tổng quan tính năng

Số role: 3

Số tính năng mỗi role: 6

Tổng tính năng: 18

---

# 7. Các chức năng mở rộng (Optional)

Phương án 1
- Thống kê sách được mượn nhiều

Phương án 2
- Gửi email nhắc trả sách

Phương án 3
- Upload ảnh bìa sách

Option 4
- Dashboard biểu đồ thống kê
