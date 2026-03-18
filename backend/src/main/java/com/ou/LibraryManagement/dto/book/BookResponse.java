package com.ou.LibraryManagement.dto.book;

import com.ou.LibraryManagement.entity.Book;

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