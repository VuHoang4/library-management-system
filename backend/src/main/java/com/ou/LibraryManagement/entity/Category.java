package com.ou.LibraryManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    //  SỬA: Ép kiểu TEXT đề phòng nội dung dài
    @Column(columnDefinition = "TEXT")
    private String description;

    //  THÊM: Link ảnh/icon minh họa cho Thể loại (Dùng hiển thị trên App/Web)
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    //  THÊM: Cờ xóa mềm
    @Column(nullable = false)
    private boolean isActive = true;

    //  THÊM: Timestamps
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Category() {}

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