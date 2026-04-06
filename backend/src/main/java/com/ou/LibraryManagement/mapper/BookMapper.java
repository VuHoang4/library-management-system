package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {



        public BookResponse toResponse(Book book, int available, String userReservationStatus) {
            return new BookResponse(
                    book.getId(),
                    book.getTitle(),
                    book.getIsbn(),
                    book.getImageUrl(),
                    book.getAuthor() != null ? book.getAuthor().getName() : null,
                    book.getCategory() != null ? book.getCategory().getName() : null,
                    available,
                    userReservationStatus
            );
        }

}