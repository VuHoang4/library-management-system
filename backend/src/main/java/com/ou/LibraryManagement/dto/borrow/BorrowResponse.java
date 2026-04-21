package com.ou.LibraryManagement.dto.borrow;

import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import java.time.LocalDate;

public record BorrowResponse(
        Long id,

        // Dữ liệu từ các bảng liên kết
        String userName,
        String bookTitle,
        String imageUrl,

        // Dữ liệu nội tại của bảng Borrow
        LocalDate borrowDate,
        LocalDate dueDate,
        LocalDate returnDate,

        //  THÊM: Các trường mới từ Entity
        int renewCount,
        String returnNote,

        BorrowStatus status
) {}