package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByBookIdAndStatusOrderByReservationDateAsc(
            Long bookId,
            ReservationStatus status
    );

}