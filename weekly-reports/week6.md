#  Báo Cáo Tiến Độ - Tuần 6

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ  
* Trần Phạm Nhất Trung  

---

# 1. Công việc đã hoàn thành

| Thành viên            | MSSV       | Công việc                                                                                                                                                                                                 | Link Commit/PR |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Hoàng Công Vũ       | 2251050081 | Xây dựng và hoàn thiện các API phục vụ chức năng quản lý (Admin & Librarian). Triển khai các API CRUD cho Category, Author, Publisher và User. Xây dựng các API thống kê cho dashboard quản trị. | — |
| Trần Phạm Nhất Trung | 2251050078 | Phát triển giao diện Frontend cho Librarian và Admin. Xây dựng các màn hình quản lý (CRUD) và dashboard quản trị. Tối ưu UI/UX và tạo các component tái sử dụng (table, modal, form). | — |

---

# 2. Nội dung đã triển khai

Trong tuần 6, nhóm tập trung vào **phát triển hệ thống quản lý dành cho Librarian và Admin**, bao gồm các chức năng CRUD và dashboard thống kê, đồng thời đảm bảo khả năng mở rộng và tái sử dụng của hệ thống.

---

## 2.1 Xây dựng chức năng quản lý (CRUD)

Đã triển khai:

* Quản lý danh mục sách (Category)
* Quản lý tác giả (Author)
* Quản lý nhà xuất bản (Publisher)
* Quản lý người dùng (User)

Các chức năng chính:

* Thêm mới (Create)
* Cập nhật (Update)
* Xóa (Delete)
* Tìm kiếm và lọc dữ liệu

Đặc điểm:

* Sử dụng component tái sử dụng cho nhiều module
* Giao diện thống nhất, dễ sử dụng
* Tích hợp trực tiếp với API backend

---

## 2.2 Xây dựng Dashboard cho Librarian và Admin

Đã triển khai:

* Dashboard hiển thị các thông tin tổng quan:
  * Tổng số đầu sách
  * Số lượng sách đang được mượn
  * Số sách quá hạn
  * Số lượng người dùng

* Hiển thị danh sách:
  * Hoạt động mượn sách gần đây
  * Người dùng có nợ phí cao (Bad Debtors)

Cải tiến:

* Tối ưu truy vấn backend cho các thống kê
* Giảm số lần gọi API bằng cách gom dữ liệu

---

## 2.3 Tối ưu Backend cho hệ thống quản lý

Đã thực hiện:

* Xây dựng các API CRUD:
  * Category
  * Author
  * Publisher
  * User

* Triển khai các query thống kê:
  * Sách quá hạn
  * Người dùng nợ nhiều
  * Hoạt động mượn gần đây

* Chuẩn hóa cấu trúc dữ liệu trả về

Cải tiến:

* Tối ưu hiệu năng truy vấn database
* Giảm trùng lặp logic trong service
* Đảm bảo tính nhất quán dữ liệu giữa các module

---

## 2.4 Xây dựng hệ thống component tái sử dụng (Frontend)

Đã triển khai:

* Table component dùng chung
* Modal form dùng chung cho Create/Update
* Form validation cơ bản

Kết quả:

* Giảm trùng lặp code
* Dễ mở rộng và bảo trì
* Tăng tốc độ phát triển frontend

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Hoàn thiện frontend phía Reader  
* Xây dựng giao diện Librarian và Admin  
* Hoàn thiện hệ thống CRUD  
* Xây dựng dashboard quản trị  

**Ước tính tiến độ hiện tại: ~95%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ:

* Hoàn thiện tích hợp giữa frontend và backend  
* Kiểm tra toàn bộ luồng nghiệp vụ (end-to-end)  
* Fix bug và tối ưu hiệu năng hệ thống  
* Cải thiện trải nghiệm người dùng (UX/UI)  

---

# 5. Tổng quan tiến độ dự án

| Tuần | Nội dung | Tiến độ |
|------|---------|--------|
| Tuần 1 | Phân tích yêu cầu, thiết kế hệ thống | 20% |
| Tuần 2 | Xây dựng backend cơ bản | 40% |
| Tuần 3 | Hoàn thiện nghiệp vụ | 20% |
| Tuần 4 | Hoàn thiện backend + UI cơ bản | 10% |
| Tuần 5 | Phát triển frontend Reader + tích hợp API | 5% |
| Tuần 6 | Xây dựng hệ thống quản lý Admin & Librarian | 5% |

**Tổng tiến độ: ~100%**
