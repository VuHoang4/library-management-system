# THIẾT KẾ CƠ SỞ DỮ LIỆU
(Database Design)

Hệ thống sử dụng cơ sở dữ liệu quan hệ để quản lý thông tin sách, người dùng và lịch sử mượn sách.

---

# 1. Danh sách bảng

## 1. users

Lưu thông tin người dùng hệ thống.

Columns

id (PK)
name
email
password
role
created_at

Role values

ADMIN
LIBRARIAN
READER

---

## 2. books

Lưu thông tin sách.

id (PK)
title
author_id
category_id
publisher_id
isbn
quantity
available_quantity

---

## 3. authors

id (PK)
name
bio

---

## 4. categories

id (PK)
name
description

---

## 5. publishers

id (PK)
name

---

## 6. borrow_records

Lưu thông tin mượn sách.

id (PK)
user_id (FK)
book_id (FK)
borrow_date
due_date
return_date
status

status values

BORROWED
RETURNED
OVERDUE

---

## 7. reservations

Lưu thông tin đặt trước sách.

id (PK)
user_id
book_id
reservation_date
status

status values

PENDING
APPROVED
CANCELLED

---

## 8. fines

Lưu thông tin phí phạt.

id (PK)
borrow_id
amount
status
paid_at

status values

UNPAID
PAID

---

## 9. notifications

Lưu thông báo hệ thống.

id (PK)
user_id
message
is_read
created_at

---

# 2. Quan hệ giữa các bảng

users
1 - n borrow_records

books
1 - n borrow_records

users
1 - n reservations

books
1 - n reservations

borrow_records
1 - 1 fines

authors
1 - n books

categories
1 - n books

publishers
1 - n books
