package com.ou.LibraryManagement.dto.author;

import java.time.LocalDateTime;

// XÓA HÀM fromEntity ĐI, CHỈ ĐỂ LẠI CÁC TRƯỜNG DỮ LIỆU
public record AuthorResponse(
        Long id,
        String name,
        String bio,
        String imageUrl,
        boolean isActive,         // Cho Frontend biết tác giả này còn hoạt động không
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}