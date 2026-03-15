package com.ou.LibraryManagement.dto;

public record BorrowRequest(
        Long userId,
        Long bookId
) {}