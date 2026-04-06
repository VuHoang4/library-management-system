package com.ou.LibraryManagement.dto.book;


public record BookResponse(
        Long id,
        String title,
        String isbn,
        String imageUrl,
        String authorName,
        String categoryName,
        int available,
        String userReservationStatus
        ) { }
