package com.ou.LibraryManagement.dto.category;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        String description,

        //  THÊM: Các trường mới khớp với Entity
        String imageUrl,
        boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}