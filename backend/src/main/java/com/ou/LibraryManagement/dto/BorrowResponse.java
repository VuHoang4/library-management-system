package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.BorrowRecord;

import java.time.LocalDate;

public record BorrowResponse(

        Long id,
        String userName,
        String bookTitle,
        LocalDate borrowDate,
        LocalDate dueDate,
        String status

) {

    public static BorrowResponse fromEntity(BorrowRecord record){
        return new BorrowResponse(
                record.getId(),
                record.getUser().getName(),
                record.getBook().getTitle(),
                record.getBorrowDate(),
                record.getDueDate(),
                record.getStatus()
        );
    }
}