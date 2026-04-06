package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Service
public class LibraryService {

    private final BookService bookService;
    private final ReservationService reservationService;

    private final BorrowService borrowService;
    private final NotificationService notificationService;
    private final FineService fineService;
    private final SystemSettingRepository settingRepository;

    public LibraryService(BookService bookService,
                          ReservationService reservationService,
                          BorrowService borrowService,
                          NotificationService notificationService,
                          FineRepository fineRepository, FineService fineService,
                          SystemSettingRepository settingRepository) {
        this.bookService = bookService;
        this.reservationService = reservationService;
        this.borrowService = borrowService;
        this.notificationService = notificationService;
        this.fineService = fineService;
        this.settingRepository = settingRepository;
    }

    // ================= BOOK FLOW =================

    public BookResponse updateBook(Long id, BookRequest request){

        Book oldBook = bookService.findEntityById(id);
        int oldQuantity = oldBook.getQuantity();

        BookResponse response = bookService.update(id, request);

        if(request.quantity() > oldQuantity){
            reservationService.processQueue(bookService.findEntityById(id));
        }

        return response;
    }

    // ================= BORROW FLOW =================

    public BorrowResponse borrowBook(BorrowRequest request){

        BorrowRecord record = borrowService.borrow(request);

        return BorrowResponse.fromEntity(record);
    }

    // ================= RETURN FLOW =================

    public BorrowResponse returnBook(Long id){

        BorrowRecord record = borrowService.returnBook(id);

        //  xử lý fine
        fineService.handleFineForBorrow(
                record,
                record.getReturnDate()
        );

        //  update queue
        reservationService.processQueue(record.getBook());

        return BorrowResponse.fromEntity(record);
    }

    // ================= RENEW FLOW =================

    public BorrowResponse renewBook(Long id){

        BorrowRecord record = borrowService.renew(id);

        return BorrowResponse.fromEntity(record);
    }
}