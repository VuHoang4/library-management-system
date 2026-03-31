#  Báo Cáo Tiến Độ - Tuần 4

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ
* Trần Phạm Nhất Trung

---

# 1. Công việc đã hoàn thành

| Thành viên            | MSSV       | Công việc                                                                                                                                                                                                 | Link Commit/PR |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Hoàng Công Vũ       | 2251050081 | Hoàn thiện thêm các API còn thiếu. Fix bug hệ thống backend. Tối ưu xử lý nghiệp vụ và cải thiện hiệu năng. Hoàn chỉnh luồng xử lý liên quan đến payment và borrow/return. | [79073506](https://github.com/VuHoang4/library-management-system/commit/79073506ddacccc0edea6fcc1822825f9eaa4feb) |
| Trần Phạm Nhất Trung | 2251050078 | Thiết kế giao diện Frontend (UI/UX) cho hệ thống. Xây dựng layout và các màn hình chính. Chuẩn bị cấu trúc cho frontend phía độc giả (reader side). | — |

---

# 2. Nội dung đã triển khai

Trong tuần 4, nhóm tập trung **hoàn thiện backend và bắt đầu phát triển frontend**, chuyển sang giai đoạn tích hợp hệ thống.

---

## 2.1 Hoàn thiện backend và tối ưu hệ thống

Đã thực hiện:

* Hoàn thiện các API còn lại trong hệ thống
* Fix các bug phát sinh trong quá trình test
* Tối ưu hiệu năng xử lý nghiệp vụ
* Đồng bộ lại toàn bộ luồng xử lý giữa các module

Cải tiến:

* Luồng borrow – return – payment hoạt động ổn định hơn
* Giảm trùng lặp logic trong service
* Cải thiện khả năng mở rộng hệ thống

---

## 2.2 Thiết kế giao diện frontend

Đã triển khai:

* Xây dựng UI tổng thể cho hệ thống
* Thiết kế các màn hình chính:
    * Trang đăng nhập
    * Trang danh sách sách
    * Trang chi tiết sách
    * Trang quản lý mượn/trả

Đặc điểm:

* Giao diện hướng đến người dùng (reader-friendly)
* Bố cục rõ ràng, dễ sử dụng
* Chuẩn bị sẵn cho việc tích hợp API backend

---

## 2.3 Chuẩn bị phát triển frontend phía độc giả

Đã thực hiện:

* Xây dựng cấu trúc project frontend
* Phân chia component hợp lý
* Định hướng luồng dữ liệu và gọi API

Kế hoạch tiếp theo:

* Kết nối API backend
* Xây dựng chức năng:
    * Mượn sách
    * Gia hạn sách
    * Xem lịch sử mượn
    * Thanh toán tiền phạt

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Backend gần như hoàn thiện (API + nghiệp vụ)
* Fix bug và tối ưu hệ thống
* Thiết kế UI frontend
* Chuẩn bị cấu trúc frontend

**Ước tính tiến độ hiện tại: ~90%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ:

* Hoàn thiện frontend phía độc giả
* Kết nối frontend với backend (API integration)
* Test toàn bộ hệ thống (end-to-end)
* Fix bug và tối ưu trải nghiệm người dùng

---

# 5. Tổng quan tiến độ dự án

| Tuần | Nội dung | Tiến độ |
|------|---------|--------|
| Tuần 1 | Phân tích yêu cầu, thiết kế hệ thống | 20% |
| Tuần 2 | Xây dựng backend cơ bản | 40% |
| Tuần 3 | Hoàn thiện nghiệp vụ + nâng cao | 20% |
| Tuần 4 | Hoàn thiện backend + bắt đầu frontend | 10% |

**Tổng tiến độ: ~80%**
