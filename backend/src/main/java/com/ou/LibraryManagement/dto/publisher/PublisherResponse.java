package com.ou.LibraryManagement.dto.publisher;

import java.time.LocalDateTime;

public record PublisherResponse(
        Long id,
        String name,
        String website,
        String description,
        boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}