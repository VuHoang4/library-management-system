#  Báo Cáo Tiến Độ - Tuần 5

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ  
* Trần Phạm Nhất Trung  

---

# 1. Công việc đã hoàn thành

| Thành viên            | MSSV       | Công việc                                                                                                                                                                                                 | Link Commit/PR |
|---------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Hoàng Công Vũ       | 2251050081 | Điều chỉnh và hoàn thiện các API phục vụ phía Frontend (Reader). Tối ưu dữ liệu trả về (DTO), chuẩn hóa response cho dashboard, borrow, reservation và payment. Fix bug liên quan đến luồng mượn và trạng thái sách. | — |
| Trần Phạm Nhất Trung | 2251050078 | Xây dựng giao diện Frontend cho phía người dùng (Reader). Hoàn thiện các màn hình chính và tích hợp API backend vào hệ thống. Triển khai luồng mượn sách và hiển thị dữ liệu thực tế. | — |

---

# 2. Nội dung đã triển khai

Trong tuần 5, nhóm tập trung vào **phát triển hoàn chỉnh frontend cho phía người dùng (Reader)** và **kết nối trực tiếp với hệ thống backend**, đánh dấu bước chuyển từ giao diện mô phỏng sang hệ thống hoạt động thực tế.

---

## 2.1 Hoàn thiện luồng Reader (Frontend + Backend)

Đã thực hiện:

* Kết nối frontend với backend thông qua API thực  
* Thay thế toàn bộ dữ liệu mock bằng dữ liệu từ server  
* Đồng bộ luồng dữ liệu giữa frontend và backend  

Triển khai các chức năng:

* Xem danh sách sách  
* Tìm kiếm và lọc sách  
* Xem chi tiết sách  
* Thực hiện mượn sách (borrow)  
* Đặt trước sách (reservation)  

Kết quả:

* Luồng người dùng hoạt động xuyên suốt (end-to-end)  
* Dữ liệu hiển thị chính xác theo trạng thái thực tế  

---

## 2.2 Xây dựng Dashboard cho người dùng

Đã triển khai:

* Dashboard hiển thị:
  * Số sách đang mượn  
  * Số đơn đặt trước  
  * Số sách sắp đến hạn  
  * Tổng tiền phạt chưa thanh toán  

* Hiển thị danh sách:
  * Sách sắp đến hạn  
  * Sách quá hạn  

Cải tiến:

* Tối ưu API backend để giảm số lần gọi  
* Chuẩn hóa dữ liệu trả về phục vụ UI  

---

## 2.3 Xây dựng hệ thống thông báo (Notification)

Đã thực hiện:

* Hiển thị danh sách thông báo theo người dùng  
* Phân loại thông báo theo trạng thái (đã đọc / chưa đọc)  
* Tích hợp API:
  * Lấy danh sách thông báo  
  * Đánh dấu đã đọc (single và tất cả)  

Kết quả:

* Người dùng có thể theo dõi trạng thái hệ thống (mượn sách, trễ hạn,…)  
* Cải thiện trải nghiệm người dùng  

---

## 2.4 Tối ưu Backend phục vụ Frontend

Đã thực hiện:

* Điều chỉnh các API:
  * Dashboard  
  * Borrow / Return  
  * Reservation  
  * Payment  
* Chuẩn hóa DTO trả về  
* Fix các lỗi logic liên quan đến trạng thái sách  

Cải tiến:

* Giảm độ phức tạp trong service  
* Tối ưu query database  
* Đảm bảo tính nhất quán dữ liệu  

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Hoàn thiện frontend phía người dùng (Reader)  
* Kết nối thành công với backend  
* Xây dựng dashboard và notification  
* Đồng bộ dữ liệu hệ thống  

**Ước tính tiến độ hiện tại: ~92%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ:

* Xây dựng giao diện cho:
  * Librarian (thủ thư)  
  * Admin (quản trị viên)  

* Phát triển các chức năng quản lý:
  * Danh mục sách  
  * Tác giả, nhà xuất bản  
  * Người dùng  

* Xây dựng dashboard cho admin  
* Tiếp tục tối ưu API backend  

---

# 5. Tổng quan tiến độ dự án

| Tuần | Nội dung | Tiến độ |
|------|---------|--------|
| Tuần 1 | Phân tích yêu cầu, thiết kế hệ thống | 20% |
| Tuần 2 | Xây dựng backend cơ bản | 40% |
| Tuần 3 | Hoàn thiện nghiệp vụ | 20% |
| Tuần 4 | Hoàn thiện backend + UI cơ bản | 10% |
| Tuần 5 | Phát triển frontend Reader + tích hợp API | 10% |

**Tổng tiến độ: ~100%**
