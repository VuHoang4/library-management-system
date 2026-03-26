package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.entity.Book;
import org.springframework.stereotype.Service;
import com.ou.LibraryManagement.dto.book.BookResponse;


@Service
public class LibraryService {

    private final BookService bookService;
    private final ReservationService reservationService;

    public LibraryService(BookService bookService,
                          ReservationService reservationService) {
        this.bookService = bookService;
        this.reservationService = reservationService;
    }

    public BookResponse updateBook(Long id, BookRequest request){

        // 1. lấy dữ liệu cũ
        Book oldBook = bookService.findEntityById(id);

        int oldQuantity = oldBook.getQuantity();

        Book updated = bookService.updateEntity(id, request);

        if(request.quantity() > oldQuantity){
            reservationService.processQueue(updated);
        }

        return BookResponse.fromEntity(updated);
    }
}