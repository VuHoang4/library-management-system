#  Báo Cáo Tiến Độ - Tuần 7

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ  
* Trần Phạm Nhất Trung  

---

# 1. Công việc đã hoàn thành

| Thành viên            | MSSV       | Công việc                                                                                                                                                                                                 | Link Commit/PR |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Hoàng Công Vũ       | 2251050081 | Tối ưu và sửa lỗi backend. Điều chỉnh lại các query liên quan đến dashboard (due soon, overdue, thống kê). Chuẩn hóa API và xử lý các trường hợp biên trong nghiệp vụ (edge cases). Cải thiện hiệu năng truy vấn database. | — |
| Trần Phạm Nhất Trung | 2251050078 | Hoàn thiện tích hợp frontend-backend. Fix lỗi UI và state management. Tối ưu trải nghiệm người dùng (UX), xử lý loading, error và đồng bộ dữ liệu giữa các màn hình. | — |

---

# 2. Nội dung đã triển khai

Trong tuần 7, nhóm tập trung vào **tích hợp hoàn chỉnh hệ thống frontend và backend**, đồng thời tiến hành **fix bug, tối ưu hiệu năng và cải thiện trải nghiệm người dùng**, nhằm đảm bảo hệ thống hoạt động ổn định trước khi hoàn thiện.

---

## 2.1 Hoàn thiện tích hợp Frontend - Backend

Đã thực hiện:

* Kết nối toàn bộ các module frontend với backend:
  * Reader
  * Librarian
  * Admin  

* Đồng bộ dữ liệu giữa các màn hình:
  * Dashboard
  * Quản lý sách
  * Quản lý người dùng
  * Notification  

Kết quả:

* Hệ thống hoạt động xuyên suốt (end-to-end)
* Dữ liệu được cập nhật theo thời gian thực sau mỗi thao tác

---

## 2.2 Fix bug hệ thống

Đã xử lý:

* Lỗi logic nghiệp vụ:
  * Phân biệt sai giữa “sắp đến hạn” và “quá hạn”
  * Trạng thái borrow/return chưa đồng bộ
* Lỗi hiển thị frontend:
  * UI không cập nhật sau khi gọi API
  * Sai trạng thái notification (đã đọc / chưa đọc)
* Lỗi dữ liệu:
  * API trả về thiếu hoặc không nhất quán

Kết quả:

* Hệ thống ổn định hơn
* Giảm lỗi phát sinh khi thao tác thực tế

---

## 2.3 Tối ưu hiệu năng backend

Đã thực hiện:

* Tối ưu các query:
  * Dashboard thống kê
  * Overdue / Due soon
* Giảm số lượng query không cần thiết
* Tối ưu xử lý trong service layer

Cải tiến:

* Giảm thời gian phản hồi API
* Tăng hiệu suất xử lý khi dữ liệu lớn

---

## 2.4 Tối ưu Frontend và UX

Đã thực hiện:

* Thêm trạng thái loading khi gọi API
* Xử lý lỗi hiển thị bằng toast notification
* Cập nhật UI ngay sau khi thao tác (optimistic update)
* Cải thiện trải nghiệm:
  * Notification dropdown
  * Dashboard hiển thị rõ ràng hơn
  * Form validation

Kết quả:

* Giao diện mượt hơn
* Trải nghiệm người dùng tốt hơn

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Hoàn thiện toàn bộ frontend (Reader, Librarian, Admin)  
* Kết nối hoàn chỉnh với backend  
* Fix bug và tối ưu hệ thống  
* Đảm bảo hệ thống hoạt động ổn định  

**Ước tính tiến độ hiện tại: ~98%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ:

* Kiểm thử toàn bộ hệ thống (end-to-end testing)  
* Hoàn thiện giao diện và trải nghiệm người dùng  
* Tối ưu hiệu năng cuối cùng  
* Chuẩn bị demo và báo cáo cuối kỳ  

---

# 5. Tổng quan tiến độ dự án

| Tuần | Nội dung | Tiến độ |
|------|---------|--------|
| Tuần 1 | Phân tích yêu cầu, thiết kế hệ thống | 20% |
| Tuần 2 | Xây dựng backend cơ bản | 40% |
| Tuần 3 | Hoàn thiện nghiệp vụ | 20% |
| Tuần 4 | Hoàn thiện backend + UI cơ bản | 10% |
| Tuần 5 | Frontend Reader + tích hợp API | 5% |
| Tuần 6 | Admin & Librarian + CRUD | 3% |
| Tuần 7 | Integration + Fix bug + Optimize | 2% |

**Tổng tiến độ: ~100%**
