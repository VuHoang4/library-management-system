# Báo Cáo Tiến Độ - Tuần 3

## Dự án

**Library Management System (Hệ Thống Quản Lý Thư Viện)**

## Thành viên nhóm

* Hoàng Công Vũ
* Trần Phạm Nhất Trung

---

# 1. Công việc đã hoàn thành

| Thành viên           | MSSV       | Công việc                                                                                                                                                                                                 | Link Commit/PR |
|--------------------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| Hoàng Công Vũ      | 2251050081 | Bổ sung cấu trúc database (thêm bảng Payment). Cập nhật và refactor lại Controller, Service để đồng bộ logic. Xây dựng chức năng **hash password bằng PasswordEncoder**. Tạo file JSON để kiểm thử API. | [a92a68a7](https://github.com/VuHoang4/library-management-system/commit/a92a68a71a552c74b72889189b428354ddcd306b) <br> [c4097489](https://github.com/VuHoang4/library-management-system/commit/c4097489f9bf604c730c926600e63768c0db3128) |
| Trần Phạm Nhất Trung | 2251050078 | Phát triển API **gia hạn sách (renew book)**. Tạo file JSON để kiểm thử API cho **Category, Publisher, SystemSetting**. Hỗ trợ kiểm thử và validate các chức năng hệ thống. | [cbeebfc6](https://github.com/VuHoang4/library-management-system/commit/cbeebfc6250108919918d11ec6f06f08b7693d77) |

---

# 2. Nội dung đã triển khai

Trong tuần 3, nhóm tập trung **mở rộng nghiệp vụ và hoàn thiện hệ thống backend**, đặc biệt là các chức năng nâng cao.

---

## 2.1 Phát triển chức năng gia hạn sách

Đã triển khai API **gia hạn sách (renew)** trong hệ thống.

Chức năng này bao gồm:

* Cho phép gia hạn thêm số ngày mượn
* Giới hạn số lần gia hạn (tối đa 2 lần)
* Không cho gia hạn nếu:
    * Sách đã trả
    * Sách đã quá hạn

---

## 2.2 Bổ sung chức năng thanh toán tiền phạt

Hệ thống đã được mở rộng với:

* Entity mới: **Payment**
* API thanh toán tiền phạt

Chức năng:

* Thanh toán fine
* Cập nhật trạng thái fine → `PAID`
* Lưu lịch sử thanh toán

---

## 2.3 Bảo mật mật khẩu người dùng

Đã cải thiện bảo mật hệ thống:

* Sử dụng `PasswordEncoder` để mã hóa mật khẩu
* Không lưu mật khẩu dạng plain text

---

## 2.4 Hoàn thiện và refactor hệ thống

Thực hiện:

* Chuẩn hóa lại cấu trúc Controller và Service
* Đồng bộ cách xử lý exception (`NotFoundException`, `BadRequestException`)
* Tối ưu lại luồng xử lý nghiệp vụ

Ví dụ:

* Xử lý queue đặt sách tự động khi có sách trả
* Tách logic ra các service riêng biệt

---

## 2.5 Kiểm thử API bằng JSON

Nhóm đã xây dựng các file JSON để test API:

* Category
* Publisher
* SystemSetting
* Một số API khác

Mục đích:

* Test nhanh bằng script
* Dễ dàng verify hệ thống
* Hỗ trợ debug

---

# 3. Tiến độ hiện tại

Các phần đã hoàn thành:

* Hoàn thiện backend cơ bản + nâng cao
* Triển khai nghiệp vụ gia hạn sách
* Triển khai thanh toán tiền phạt
* Cải thiện bảo mật (hash password)
* Kiểm thử API bằng JSON
* Refactor hệ thống

**Ước tính tiến độ hiện tại: ~80%**

---

# 4. Kế hoạch tuần tiếp theo

Trong tuần tiếp theo, nhóm sẽ:

* Hoàn thiện toàn bộ API còn lại
* Xây dựng frontend (nếu có yêu cầu)
* Fix bug và tối ưu hiệu năng


---

# 5. Tổng quan tiến độ dự án

| Tuần | Nội dung | Tiến độ |
|------|--------|--------|
| Tuần 1 | Phân tích yêu cầu, thiết kế hệ thống | 20% |
| Tuần 2 | Xây dựng backend cơ bản | 40% |
| Tuần 3 | Hoàn thiện nghiệp vụ + nâng cao | 20% |

**Tổng tiến độ: ~80%**
