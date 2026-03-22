# THIẾT KẾ CƠ SỞ DỮ LIỆU

(Database Design)

---

# 1. Giới thiệu

Hệ thống **Library Management System** sử dụng cơ sở dữ liệu quan hệ (Relational Database)
để quản lý:

* Người dùng và phân quyền
* Sách và thông tin xuất bản
* Hoạt động mượn / trả / gia hạn
* Đặt trước sách (Reservation Queue)
* Phí phạt và thanh toán
* Thông báo hệ thống
* Cấu hình thư viện

Database được thiết kế nhằm đảm bảo:

* Tính toàn vẹn dữ liệu (Data Integrity)
* Khả năng mở rộng (Scalability)
* Tối ưu truy vấn (Indexing + Query design)

---

# 2. Tổng quan các bảng

Hệ thống gồm **12 bảng chính**

---

## Nhóm quản lý người dùng

| Bảng  | Mô tả            |
| ----- | ---------------- |
| roles | Vai trò hệ thống |
| users | Người dùng       |

---

## Nhóm quản lý sách

| Bảng       | Mô tả        |
| ---------- | ------------ |
| authors    | Tác giả      |
| categories | Danh mục     |
| publishers | Nhà xuất bản |
| books      | Sách         |

---

## Nhóm nghiệp vụ

| Bảng           | Mô tả             |
| -------------- | ----------------- |
| borrow_records | Mượn / trả sách   |
| reservations   | Đặt trước (queue) |
| fines          | Phí phạt          |
| payments       | Thanh toán        |

---

## Nhóm hệ thống

| Bảng            | Mô tả     |
| --------------- | --------- |
| system_settings | Cấu hình  |
| notifications   | Thông báo |

---

# 3. Chi tiết các bảng

---

# 3.1 Table: roles

| Column  | Description                |
| ------- | -------------------------- |
| id (PK) | ID                         |
| name    | ADMIN / LIBRARIAN / READER |

---

# 3.2 Table: users

| Column       | Description             |
| ------------ | ----------------------- |
| id (PK)      | ID                      |
| name         | Tên                     |
| email        | Email (unique, indexed) |
| password     | Password (BCrypt hash)  |
| role_id (FK) | Vai trò                 |
| created_at   | Thời gian tạo           |
| updated_at   | Thời gian cập nhật      |

---

# 3.3 Table: authors

| Column | Description |
| ------ | ----------- |
| id     | ID          |
| name   | Tên         |
| bio    | Tiểu sử     |

---

# 3.4 Table: categories

| Column      | Description |
| ----------- | ----------- |
| id          | ID          |
| name        | Tên         |
| description | Mô tả       |

---

# 3.5 Table: publishers

| Column | Description |
| ------ | ----------- |
| id     | ID          |
| name   | Tên         |

---

# 3.6 Table: books

| Column             | Description        |
| ------------------ | ------------------ |
| id                 | ID                 |
| title              | Tên sách           |
| isbn               | ISBN               |
| author_id (FK)     | Tác giả            |
| category_id (FK)   | Danh mục           |
| publisher_id (FK)  | NXB                |
| quantity           | Tổng               |
| available_quantity | Có thể mượn        |
| created_at         | Thời gian tạo      |
| updated_at         | Thời gian cập nhật |

---

# 3.7 Table: borrow_records

| Column       | Description    |
| ------------ | -------------- |
| id           | ID             |
| user_id (FK) | Người mượn     |
| book_id (FK) | Sách           |
| borrow_date  | Ngày mượn      |
| due_date     | Hạn trả        |
| return_date  | Ngày trả       |
| renew_count  | Số lần gia hạn |
| status       | Trạng thái     |
| created_at   | Thời gian tạo  |

### Status:

* BORROWED
* RETURNED

---

# 3.8 Table: reservations

| Column           | Description |
| ---------------- | ----------- |
| id               | ID          |
| user_id (FK)     | Người đặt   |
| book_id (FK)     | Sách        |
| reservation_date | Ngày đặt    |
| expire_date      | Hạn nhận    |
| status           | Trạng thái  |

### Status:

* PENDING
* READY
* COMPLETED
* EXPIRED

Hỗ trợ **queue FIFO**

---

# 3.9 Table: fines

| Column         | Description  |
| -------------- | ------------ |
| id             | ID           |
| borrow_id (FK) | BorrowRecord |
| user_id (FK)   | Người dùng   |
| amount         | Tiền phạt    |
| status         | Trạng thái   |

### Status:

* UNPAID
* PAID

 Không còn `paid_at` (đã tách sang Payment)

---

# 3.10 Table: payments

| Column       | Description                  |
| ------------ | ---------------------------- |
| id           | ID                           |
| user_id (FK) | Người thanh toán             |
| fine_id (FK) | Phí phạt                     |
| amount       | Số tiền                      |
| method       | Phương thức (VNPAY, CASH...) |
| status       | Trạng thái                   |
| created_at   | Thời gian                    |

### Status:

* SUCCESS
* FAILED

---

# 3.11 Table: system_settings

| Column       | Description    |
| ------------ | -------------- |
| id           | ID             |
| borrow_days  | Số ngày mượn   |
| fine_per_day | Phí/ngày       |
| max_renew    | Số lần gia hạn |

---

# 3.12 Table: notifications

| Column       | Description |
| ------------ | ----------- |
| id           | ID          |
| user_id (FK) | Người nhận  |
| title        | Tiêu đề     |
| content      | Nội dung    |
| created_at   | Thời gian   |

---

# 4. Quan hệ giữa các bảng

roles 1 --- n users

users 1 --- n borrow_records
users 1 --- n reservations
users 1 --- n payments
users 1 --- n notifications

books 1 --- n borrow_records
books 1 --- n reservations

borrow_records 1 --- 1 fines
fines 1 --- n payments

authors 1 --- n books
categories 1 --- n books
publishers 1 --- n books

---

# 5. Các cải tiến trong thiết kế

## ✔️ Tách Payment khỏi Fine

* Cho phép nhiều lần thanh toán
* Hỗ trợ tích hợp VNPay

## ✔️ Reservation Queue

* FIFO
* expire_date

## ✔️ Notification System

* event-driven
* có thể mở rộng Firebase / Email

## ✔️ Password Security

* BCrypt hash

## ✔️ Indexing (tối ưu hiệu năng)

* users.email
* borrow_records.user_id
* reservations(book_id, status)
* notifications.user_id

---

# 6. Tổng kết

| Nhóm     | Bảng                                          |
| -------- | --------------------------------------------- |
| User     | roles, users                                  |
| Book     | books, authors, categories, publishers        |
| Business | borrow_records, reservations, fines, payments |
| System   | system_settings, notifications                |

 Tổng: **12 bảng**

---

# 7. Hướng mở rộng

* JWT Authentication
* Firebase Notification
* Email Service
* Recommendation System
* Dashboard Analytics
