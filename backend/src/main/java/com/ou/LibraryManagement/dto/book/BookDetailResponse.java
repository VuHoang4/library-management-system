package com.ou.LibraryManagement.dto.book;

public record BookDetailResponse(
        Long id,
        String title,
        String isbn,
        String imageUrl,
        String description,

        Integer publishedYear,
        boolean isActive,
        int quantity,
        int available,

        //  ĐỔI TÊN:
        String author,
        String category,
        String publisher,

        Long authorId,
        Long categoryId,
        Long publisherId
) {}