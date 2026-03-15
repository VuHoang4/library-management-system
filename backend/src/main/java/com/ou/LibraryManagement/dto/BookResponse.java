package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Book;

public record BookResponse(
        Long id,
        String title,
        String isbn,
        int availableQuantity
) {
    public static BookResponse fromEntity(Book book){
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                book.getAvailableQuantity()
        );
    }
}