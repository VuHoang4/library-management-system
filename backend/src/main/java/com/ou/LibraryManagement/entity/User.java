package com.ou.LibraryManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // FE dùng fullName hoặc name đều được

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(length = 15)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    //  THÊM: Cờ trạng thái tài khoản (Rất quan trọng cho Spring Security)
    // true = Đang hoạt động, false = Bị khóa/Đã xóa mềm
    @Column(name = "is_active",nullable = false)
    private boolean isActive = true;

    //  SỬA: Bảo vệ ngày tạo gốc
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // EAGER ở đây là hợp lý vì Security luôn cần load Role lên cùng lúc với User
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false) // Một user bắt buộc phải có Role
    private Role role;

    public User(){}

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }
}