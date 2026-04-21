package com.ou.LibraryManagement.scheduler;

import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService; // ✅ đổi
    private final BookRepository bookRepository;

    @Scheduled(fixedRate = 150000)
    @Transactional
    public void cleanupAndProcessQueue() {

        // 1. tìm reservation hết hạn
        List<Reservation> expiredReservations = reservationRepository.findAll().stream()
                .filter(r -> r.getStatus() == ReservationStatus.HOLDING
                        && r.getExpireDate() != null
                        && r.getExpireDate().isBefore(LocalDate.now()))
                .toList();

        // 2. expire + process queue
        for (Reservation r : expiredReservations) {
            r.setStatus(ReservationStatus.EXPIRED);
            reservationRepository.save(r);

            processQueueForBook(r.getBook());
        }
    }

    private void processQueueForBook(Book book) {
        reservationService.processQueue(book); // ✅ sửa
    }
}