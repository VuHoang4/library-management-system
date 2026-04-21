package com.ou.LibraryManagement.service.event;

import com.ou.LibraryManagement.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationEventListener {

    private final ReservationService reservationService;

    @EventListener
    public void handleBookReturned(BookReturnedEvent event) {
        reservationService.processQueue(event.record().getBook());
    }

    @EventListener
    public void handleStockIncreased(BookStockIncreasedEvent event) {
        reservationService.processQueue(event.book());
    }
}