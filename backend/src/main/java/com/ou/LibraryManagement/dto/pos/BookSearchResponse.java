package com.ou.LibraryManagement.dto.pos;

public record BookSearchResponse(
        Long id,
        String title,
        String author,
        String category,
        int available
) {}