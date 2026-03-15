package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Reservation;

import java.time.LocalDate;

public record ReservationResponse(

        Long id,
        String userName,
        String bookTitle,
        LocalDate reservationDate,
        String status

) {

    public static ReservationResponse fromEntity(Reservation reservation){
        return new ReservationResponse(
                reservation.getId(),
                reservation.getUser().getName(),
                reservation.getBook().getTitle(),
                reservation.getReservationDate(),
                reservation.getStatus()
        );
    }
}