# THIẾT KẾ CƠ SỞ DỮ LIỆU
(Database Design)

## 1. Giới thiệu

Hệ thống **Library Management System** sử dụng cơ sở dữ liệu quan hệ (Relational Database) 
để quản lý thông tin:

- Người dùng hệ thống
- Sách và thông tin xuất bản
- Hoạt động mượn/trả sách
- Đặt trước sách
- Phí phạt
- Cấu hình hệ thống thư viện

Database được thiết kế nhằm đảm bảo:

- Tính toàn vẹn dữ liệu
- Khả năng mở rộng
- Dễ dàng truy vấn thống kê

---

# 2. Tổng quan các bảng

Hệ thống gồm **11 bảng chính**

## Nhóm quản lý người dùng

| Bảng | Mô tả |
|-----|------|
roles | Danh sách vai trò trong hệ thống |
users | Thông tin người dùng |

---

## Nhóm quản lý sách

| Bảng | Mô tả |
|-----|------|
authors | Thông tin tác giả |
categories | Danh mục sách |
publishers | Nhà xuất bản |
books | Thông tin sách |

---

## Nhóm nghiệp vụ thư viện

| Bảng | Mô tả |
|-----|------|
borrow_records | Lịch sử mượn và trả sách |
reservations | Đặt trước sách |
fines | Phí phạt |

---

## Nhóm cấu hình hệ thống

| Bảng | Mô tả |
|-----|------|
system_settings | Cấu hình quy định thư viện |
notifications | Thông báo hệ thống |

---

# 3. Chi tiết các bảng

---

# 3.1 Table: roles

Lưu các vai trò của người dùng.

| Column | Description |
|------|-------------|
id (PK) | ID vai trò |
name | Tên vai trò |

### Giá trị của name
ADMIN
LIBRARIAN
READER

---

# 3.2 Table: users

Lưu thông tin người dùng.

| Column | Description |
|------|-------------|
id (PK) | ID người dùng |
name | Tên người dùng |
email | Email đăng nhập |
password | Mật khẩu |
role_id (FK) | Vai trò |
created_at | Thời gian tạo |
updated_at | Thời gian cập nhật |

---

# 3.3 Table: authors

Lưu thông tin tác giả.

| Column | Description |
|------|-------------|
id (PK) | ID tác giả |
name | Tên tác giả |
bio | Tiểu sử |

---

# 3.4 Table: categories

Danh mục phân loại sách.

| Column | Description |
|------|-------------|
id (PK) | ID danh mục |
name | Tên danh mục |
description | Mô tả |

---

# 3.5 Table: publishers

Thông tin nhà xuất bản.

| Column | Description |
|------|-------------|
id (PK) | ID nhà xuất bản |
name | Tên nhà xuất bản |

---

# 3.6 Table: books

Lưu thông tin các cuốn sách trong thư viện.

| Column | Description |
|------|-------------|
id (PK) | ID sách |
title | Tên sách |
isbn | Mã ISBN |
author_id (FK) | Tác giả |
category_id (FK) | Danh mục |
publisher_id (FK) | Nhà xuất bản |
quantity | Tổng số sách |
available_quantity | Số sách còn có thể mượn |
created_at | Thời gian tạo |
updated_at | Thời gian cập nhật |

---

# 3.7 Table: borrow_records

Lưu lịch sử mượn và trả sách.

| Column | Description |
|------|-------------|
id (PK) | ID bản ghi |
user_id (FK) | Người mượn |
book_id (FK) | Sách |
borrow_date | Ngày mượn |
due_date | Hạn trả |
return_date | Ngày trả |
renew_count | Số lần gia hạn |
status | Trạng thái |

### Giá trị status
BORROWED
RETURNED
OVERDUE

---

# 3.8 Table: reservations

Lưu thông tin đặt trước sách.

| Column | Description |
|------|-------------|
id (PK) | ID đặt trước |
user_id (FK) | Người đặt |
book_id (FK) | Sách |
reservation_date | Ngày đặt |
status | Trạng thái |

### Giá trị status
PENDING
APPROVED
CANCELLED

---

# 3.9 Table: fines

Lưu thông tin phí phạt do trả sách trễ.

| Column | Description |
|------|-------------|
id (PK) | ID phí phạt |
borrow_id (FK) | Bản ghi mượn |
amount | Số tiền phạt |
status | Trạng thái thanh toán |
paid_at | Thời gian thanh toán |

### Giá trị status
UNPAID
PAID

---

# 3.10 Table: system_settings

Lưu cấu hình quy định thư viện.

| Column | Description |
|------|-------------|
id (PK) | ID |
borrow_days | Số ngày mượn tối đa |
fine_per_day | Phí phạt mỗi ngày |
max_renew | Số lần gia hạn tối đa |

---

# 3.11 Table: notifications

Thông báo hệ thống.

| Column | Description |
|------|-------------|
id (PK) | ID |
title | Tiêu đề |
content | Nội dung |
created_at | Thời gian tạo |

---

# 4. Quan hệ giữa các bảng

Các quan hệ chính trong hệ thống:

roles 1 --- n users

users 1 --- n borrow_records
users 1 --- n reservations

books 1 --- n borrow_records
books 1 --- n reservations

borrow_records 1 --- 1 fines

authors 1 --- n books
categories 1 --- n books
publishers 1 --- n books

---

# 5. Tổng kết

| Nhóm | Bảng |
|----|----|
Quản lý người dùng | roles, users |
Quản lý sách | books, authors, categories, publishers |
Nghiệp vụ thư viện | borrow_records, reservations, fines |
Cấu hình hệ thống | system_settings, notifications |

Tổng số bảng: **11**

---

# 6. Hướng mở rộng

Trong tương lai có thể mở rộng thêm:

- Online payment gateway
- Email notification
- Book recommendation system
- Advanced analytics
