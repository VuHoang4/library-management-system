package com.ou.LibraryManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "publishers")
public class Publisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    //  THÊM: Mô tả hoặc địa chỉ
    @Column(columnDefinition = "TEXT")
    private String description;

    //  THÊM: Cờ xóa mềm (Chống lỗi khóa ngoại khi xóa)
    @Column(nullable = false)
    private boolean isActive = true;

    //  THÊM: Timestamps
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Publisher(){}

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