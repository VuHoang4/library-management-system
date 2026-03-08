# TÀI LIỆU API
(API Documentation)

Hệ thống sử dụng RESTful API để giao tiếp giữa frontend và backend.

---

# 1. Authentication API

POST /auth/register

Đăng ký tài khoản

POST /auth/login

Đăng nhập

GET /auth/profile

Lấy thông tin người dùng

---

# 2. Books API

GET /books

Lấy danh sách sách

GET /books/{id}

Xem chi tiết sách

POST /books

Thêm sách mới

PUT /books/{id}

Cập nhật sách

DELETE /books/{id}

Xóa sách

---

# 3. Categories API

GET /categories

POST /categories

PUT /categories/{id}

DELETE /categories/{id}

---

# 4. Borrow API

POST /borrow

Mượn sách

POST /return

Trả sách

GET /borrow/history

Xem lịch sử mượn

POST /borrow/extend

Gia hạn mượn

---

# 5. Reservation API

POST /reservations

Đặt trước sách

GET /reservations

Danh sách đặt trước

POST /reservations/{id}/approve

Xử lý đặt trước

---

# 6. Fines API

GET /fines

Xem phí phạt

POST /fines/pay

Thanh toán phí phạt

---

# 7. Reports API

GET /reports/overdue

Danh sách sách quá hạn

GET /reports/popular-books

Danh sách sách được mượn nhiều
