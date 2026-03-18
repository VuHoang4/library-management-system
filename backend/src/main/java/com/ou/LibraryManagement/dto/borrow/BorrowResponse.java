package com.ou.LibraryManagement.dto.borrow;

import com.ou.LibraryManagement.entity.BorrowRecord;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;

import java.time.LocalDate;

public record BorrowResponse(
        Long id,
        String userName,
        String bookTitle,
        LocalDate borrowDate,
        LocalDate dueDate,
        BorrowStatus status,
        LocalDate returnDate
) {

    public static BorrowResponse fromEntity(BorrowRecord record){
        return new BorrowResponse(
                record.getId(),
                record.getUser().getName(),
                record.getBook().getTitle(),
                record.getBorrowDate(),
                record.getDueDate(),
                record.getStatus(),
                record.getReturnDate()
        );
    }
}