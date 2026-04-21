package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String email);

    // Đếm số thông báo chưa đọc cho độc giả (để hiện chấm đỏ trên UI)
    long countByUserIdAndIsReadFalse(Long userId);

    // Tìm tất cả thông báo chưa đọc của 1 user để xử lý hàng loạt
    List<Notification> findByUserEmailAndIsReadFalse(String email);
}