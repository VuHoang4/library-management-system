package com.ou.LibraryManagement.scheduler;

import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.service.ReservationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationScheduler {

    private final BookRepository bookRepository;
    private final ReservationService reservationService;

    public ReservationScheduler(
            BookRepository bookRepository,
            ReservationService reservationService
    ) {
        this.bookRepository = bookRepository;
        this.reservationService = reservationService;
    }

    // chạy mỗi 5 phút
    @Scheduled(fixedRate = 300000)
    public void autoProcessQueue(){

        List<Book> books = reservationService.getBooksNeedProcess();

        for(Book b : books){
            reservationService.processQueue(b);
        }
    }
}