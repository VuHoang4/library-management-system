# Báo Cáo Tiến Độ - Tuần 2

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ
* Trần Phạm Nhất Trung

---

# 1. Công việc đã hoàn thành

| Thành viên           | MSSV       | Công việc                                                                                                                                                                                                                                                                                | Link Commit/PR                                       |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Hoàng Công Vũ        | 2251012108 | Thiết lập project **Spring Boot** cho backend. Thiết kế **Entity classes** (User, Book, BorrowRecord, Reservation, Fine...). Xây dựng **Repository layer**, **Service layer**, và **REST API Controllers**. Cài đặt **logic nghiệp vụ mượn sách, trả sách, đặt trước và tính phí phạt**. | [fe043a3ae9da9d37ecc65bd6cfc6d0087ecf641f](https://github.com/VuHoang4/library-management-system/commit/fe043a3ae9da9d37ecc65bd6cfc6d0087ecf641f) |
| Trần Phạm Nhất Trung | 2251012109 | Tham gia thảo luận thiết kế **API structure** và **database schema**. Kiểm thử các **REST API** đã xây dựng. Chuẩn bị **sample data cho database** và kiểm tra hoạt động của hệ thống. Vẽ ERD                                                                                    |(36de0344ecac0685dad3fd703169e285bfec7978](https://github.com/VuHoang4/library-management-system/commit/36de0344ecac0685dad3fd703169e285bfec7978)|

---

# 2. Nội dung đã triển khai

Trong tuần 2, nhóm tập trung phát triển **backend cho hệ thống Library Management System**.

Các công việc chính đã thực hiện:

### 2.1 Thiết lập Backend

* Tạo project **Spring Boot** sử dụng Maven.
* Cấu hình các dependencies cần thiết:

  * Spring Web
  * Spring Data JPA
  * MySQL Driver
  * Lombok

### 2.2 Thiết kế Entity Classes

Các entity chính đã được xây dựng dựa trên database design:

* User
* Role
* Book
* Author
* Category
* Publisher
* BorrowRecord
* Reservation
* Fine
* SystemSetting
* Notification

### 2.3 Xây dựng Repository Layer

Sử dụng **Spring Data JPA** để tạo các repository cho từng entity:

* UserRepository
* BookRepository
* BorrowRecordRepository
* ReservationRepository
* FineRepository
* AuthorRepository
* CategoryRepository
* PublisherRepository

### 2.4 Xây dựng Service Layer

Triển khai các service để xử lý logic nghiệp vụ của hệ thống ở mức cơ bản:

* UserService
* BookService
* BorrowRecordService
* ReservationService
* FineService
* CategoryService
* AuthorService
* PublisherService

### 2.5 Xây dựng REST API

Xây dựng các REST API cho các chức năng chính:

#### Quản lý người dùng

```
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

#### Quản lý sách

```
GET    /api/books
GET    /api/books/{id}
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
GET    /api/books/search
```

#### Mượn sách

```
POST   /api/borrow
PUT    /api/borrow/return/{id}
GET    /api/borrow
GET    /api/borrow/user/{id}
```

#### Đặt trước sách

```
POST   /api/reservations
GET    /api/reservations
GET    /api/reservations/user/{id}
PUT    /api/reservations/{id}/approve
DELETE /api/reservations/{id}
```

#### Phí phạt

```
GET    /api/fines
POST   /api/fines
PUT    /api/fines/pay/{id}
```

### 2.6 Logic nghiệp vụ hệ thống

Đã triển khai các logic quan trọng của hệ thống thư viện:

* Khi **mượn sách** → giảm `availableQuantity`
* Khi **trả sách** → tăng `availableQuantity`
* Nếu **trả trễ hạn** → hệ thống tự động tạo **fine**
* Nếu sách **hết** → người dùng có thể **đặt trước**

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Thiết lập backend Spring Boot
* Thiết kế và triển khai Entity classes
* Xây dựng Repository layer
* Xây dựng Service layer cơ bản
* Xây dựng REST API cơ bản
* Chuẩn bị sample data cho database

**Ước tính tiến độ hiện tại: ~60%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ thực hiện:

* Kiểm thử toàn bộ **REST API**
* Hoàn thiện **sample data cho database**
* Tinh chỉnh, hoàn thiện các API
* Cài đặt logic nghiệp vụ chính của hệ thống

---

# 5. Tổng quan tiến độ dự án

| Tuần              | Nội dung                                           | Tiến độ |
| ----------------- | -------------------------------------------------- | ------- |
| Tuần 1            | Phân tích yêu cầu, thiết kế database, thiết kế API | 20%     |
| Tuần 2            | Phát triển backend và business logic  ( cơ bản)          | 40%     |
---
