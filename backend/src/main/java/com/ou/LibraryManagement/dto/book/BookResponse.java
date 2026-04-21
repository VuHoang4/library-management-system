package com.ou.LibraryManagement.dto.book;

public record BookResponse(
        Long id,
        String title,
        String imageUrl,
        int quantity,


        //  ĐỔI TÊN:
        String author,
        String category,
        String publisher,

        // Dữ liệu Động (Computed Data - được truyền vào từ Service qua Mapper)
        int available,
        String userReservationStatus,
        String userBorrowStatus
) {}