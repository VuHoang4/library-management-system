package com.ou.LibraryManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "system_settings")
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  SỬA: Không được để trống. (Thường gán luôn giá trị mặc định cho an toàn)
    @Column(nullable = false)
    private int borrowDays = 14;

    //  SỬA: Không được để trống
    @Column(nullable = false)
    private double finePerDay = 5000.0;

    //  SỬA: Không được để trống
    @Column(nullable = false)
    private int maxRenew = 2;

    @Column(nullable = false)
    private boolean active = true;

    //  THÊM: Thời gian tạo cấu hình
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    //  THÊM: Thời gian cập nhật cấu hình lần cuối (Rất quan trọng để Audit)
    private LocalDateTime updatedAt;

    public SystemSetting() {}

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}