# THIẾT KẾ CƠ SỞ DỮ LIỆU
(Database Design)

Hệ thống sử dụng **cơ sở dữ liệu quan hệ** để quản lý thông tin người dùng, sách và các hoạt động mượn trả trong thư viện.

---

# 1. Danh sách các bảng

## 1. Bảng roles
Lưu các vai trò của người dùng trong hệ thống.

| Cột | Mô tả |
|----|----|
| id (PK) | ID vai trò |
| name | Tên vai trò |

### Giá trị của name

- ADMIN (Quản trị viên)
- LIBRARIAN (Thủ thư)
- READER (Độc giả)

---

## 2. Bảng users
Lưu thông tin người dùng trong hệ thống.

| Cột | Mô tả |
|----|----|
| id (PK) | ID người dùng |
| name | Tên người dùng |
| email | Email đăng nhập |
| password | Mật khẩu |
| role_id (FK) | ID vai trò |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

---

## 3. Bảng authors
Lưu thông tin tác giả.

| Cột | Mô tả |
|----|----|
| id (PK) | ID tác giả |
| name | Tên tác giả |
| bio | Tiểu sử |

---

## 4. Bảng categories
Lưu danh mục sách.

| Cột | Mô tả |
|----|----|
| id (PK) | ID danh mục |
| name | Tên danh mục |
| description | Mô tả |

---

## 5. Bảng publishers
Lưu thông tin nhà xuất bản.

| Cột | Mô tả |
|----|----|
| id (PK) | ID nhà xuất bản |
| name | Tên nhà xuất bản |

---

## 6. Bảng books
Lưu thông tin các cuốn sách trong thư viện.

| Cột | Mô tả |
|----|----|
| id (PK) | ID sách |
| title | Tên sách |
| author_id (FK) | ID tác giả |
| category_id (FK) | ID danh mục |
| publisher_id (FK) | ID nhà xuất bản |
| isbn | Mã ISBN của sách |
| quantity | Tổng số sách |
| available_quantity | Số lượng sách còn có thể mượn |
| created_at | Thời gian tạo |
| updated_at | Thời gian cập nhật |

---

## 7. Bảng borrow_records
Lưu thông tin mượn và trả sách.

| Cột | Mô tả |
|----|----|
| id (PK) | ID bản ghi mượn |
| user_id (FK) | ID người mượn |
| book_id (FK) | ID sách |
| borrow_date | Ngày mượn |
| due_date | Hạn trả |
| return_date | Ngày trả |
| status | Trạng thái mượn |
| created_at | Thời gian tạo |

### Giá trị của status

- BORROWED (Đang mượn)
- RETURNED (Đã trả)
- OVERDUE (Quá hạn)

---

## 8. Bảng reservations
Lưu thông tin đặt trước sách.

| Cột | Mô tả |
|----|----|
| id (PK) | ID đặt trước |
| user_id (FK) | ID người đặt |
| book_id (FK) | ID sách |
| reservation_date | Ngày đặt |
| status | Trạng thái |

### Giá trị của status

- PENDING (Đang chờ xử lý)
- APPROVED (Đã duyệt)
- CANCELLED (Đã hủy)

---

## 9. Bảng fines
Lưu thông tin phí phạt do trả sách trễ.

| Cột | Mô tả |
|----|----|
| id (PK) | ID phí phạt |
| borrow_id (FK) | ID bản ghi mượn |
| amount | Số tiền phạt |
| status | Trạng thái thanh toán |
| paid_at | Thời gian thanh toán |

### Giá trị của status

- UNPAID (Chưa thanh toán)
- PAID (Đã thanh toán)

---

# 2. Quan hệ giữa các bảng

Quan hệ giữa các bảng trong hệ thống:

- roles **1 - n** users  
  → Một vai trò có thể có nhiều người dùng.

- users **1 - n** borrow_records  
  → Một người dùng có thể mượn nhiều sách.

- books **1 - n** borrow_records  
  → Một cuốn sách có thể được mượn nhiều lần.

- users **1 - n** reservations  
  → Một người dùng có thể đặt trước nhiều sách.

- books **1 - n** reservations  
  → Một cuốn sách có thể có nhiều lượt đặt trước.

- borrow_records **1 - 1** fines  
  → Một lần mượn có thể phát sinh một phí phạt.

- authors **1 - n** books  
  → Một tác giả có thể viết nhiều sách.

- categories **1 - n** books  
  → Một danh mục có thể chứa nhiều sách.

- publishers **1 - n** books  
  → Một nhà xuất bản có thể xuất bản nhiều sách.

---

# 3. Tổng số bảng

| Nhóm | Bảng |
|----|----|
| Quản lý người dùng | roles, users |
| Quản lý sách | books, authors, categories, publishers |
| Nghiệp vụ thư viện | borrow_records, reservations, fines |

Tổng số bảng: **9 bảng**

