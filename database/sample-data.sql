USE library_db;

-- =====================================
-- ROLES
-- =====================================

INSERT IGNORE INTO roles (name) VALUES
('ADMIN'),
('LIBRARIAN'),
('READER');
-- =====================================
-- USERS
-- =====================================

INSERT INTO users (name,email,password,role_id,created_at,updated_at) VALUES
('Admin User','admin@library.com','123',1,NOW(),NOW()),
('Librarian','librarian@library.com','123',2,NOW(),NOW()),
('Nguyen Van A','user1@gmail.com','123',3,NOW(),NOW()),
('Tran Thi B','user2@gmail.com','123',3,NOW(),NOW());

-- =====================================
-- AUTHORS
-- =====================================

INSERT INTO authors (name,bio) VALUES
('Nguyễn Nhật Ánh','Nhà văn nổi tiếng với truyện tuổi học trò'),
('Nam Cao','Nhà văn hiện thực Việt Nam'),
('Tô Hoài','Tác giả Dế Mèn Phiêu Lưu Ký'),
('Nguyễn Du','Tác giả Truyện Kiều');

-- =====================================
-- CATEGORIES
-- =====================================

INSERT INTO categories (name,description) VALUES
('Văn học Việt Nam','Các tác phẩm văn học Việt'),
('Thiếu nhi','Sách dành cho thiếu nhi'),
('Giáo dục','Sách phục vụ học tập');

-- =====================================
-- PUBLISHERS
-- =====================================

INSERT INTO publishers (name) VALUES
('NXB Kim Đồng'),
('NXB Trẻ'),
('NXB Giáo Dục Việt Nam'),
('NXB Văn Học');

-- =====================================
-- BOOKS
-- =====================================

INSERT INTO books
(title,isbn,author_id,category_id,publisher_id,quantity,available_quantity,created_at,updated_at)
VALUES
('Dế Mèn Phiêu Lưu Ký','1000',3,2,1,10,10,NOW(),NOW()),
('Mắt Biếc','1001',1,1,2,8,8,NOW(),NOW()),
('Lão Hạc','1002',2,1,4,6,6,NOW(),NOW()),
('Truyện Kiều','1003',4,1,4,5,5,NOW(),NOW()),
('Tôi Thấy Hoa Vàng Trên Cỏ Xanh','1004',1,1,2,7,7,NOW(),NOW());

-- =====================================
-- BORROW RECORDS
-- =====================================

INSERT INTO borrow_records
(user_id,book_id,borrow_date,due_date,return_date,renew_count,status)
VALUES
(3,1,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),NULL,0,'BORROWED'),
(4,2,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),NULL,0,'BORROWED'),
(3,3,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 14 DAY),CURDATE(),1,'RETURNED');

-- =====================================
-- RESERVATIONS
-- =====================================

INSERT INTO reservations
(user_id,book_id,reservation_date,status)
VALUES
(3,2,CURDATE(),'PENDING'),
(4,1,CURDATE(),'APPROVED'),
(3,4,CURDATE(),'CANCELLED');

-- =====================================
-- FINES
-- =====================================

INSERT INTO fines
(borrow_id,amount,status,paid_at)
VALUES
(3,5.00,'PAID',NOW()),
(1,2.50,'UNPAID',NULL),
(2,3.00,'UNPAID',NULL);

-- =====================================
-- SYSTEM SETTINGS
-- =====================================

INSERT INTO system_settings
(borrow_days,fine_per_day,max_renew)
VALUES
(14,1.5,2),
(7,2.0,1),
(30,1.0,3);

-- =====================================
-- NOTIFICATIONS
-- =====================================

INSERT INTO notifications
(title,content,created_at)
VALUES
('Library Closed','Library closed on Sunday',NOW()),
('New Books','New books available',NOW()),
('Maintenance','System maintenance tonight',NOW());