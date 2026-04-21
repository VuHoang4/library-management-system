package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  SỬA: Không cho phép tiêu đề rỗng
    @Column(nullable = false)
    private String title;

    //  SỬA: Không cho phép nội dung rỗng
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private NotificationType type; // SUCCESS, WARNING, INFO

    @Column(nullable = false)
    private boolean isRead = false;

    //  SỬA: Thêm updatable = false
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    //  THÊM: Để biết lúc nào người dùng đánh dấu đã đọc
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Một thông báo bắt buộc phải thuộc về 1 ai đó
    private User user;

    public Notification(){}

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // THÊM: Tự động cập nhật thời gian khi đổi trạng thái isRead
    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }
}