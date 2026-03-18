package com.ou.LibraryManagement.dto.reservation;

import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;

import java.time.LocalDate;

public record ReservationResponse(

        Long id,
        String userName,
        String bookTitle,
        LocalDate reservationDate,
        ReservationStatus status,
        LocalDate expireDate

) {

    public static ReservationResponse fromEntity(Reservation reservation){
        return new ReservationResponse(
                reservation.getId(),
                reservation.getUser().getName(),
                reservation.getBook().getTitle(),
                reservation.getReservationDate(),
                reservation.getStatus(),
                reservation.getExpireDate()
        );
    }
}