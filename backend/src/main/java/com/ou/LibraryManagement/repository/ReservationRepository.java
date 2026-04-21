package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByBookIdAndStatusOrderByReservationDateAsc(
            Long bookId,
            ReservationStatus status
    );

    List<Reservation> findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
            Long bookId,
            ReservationType type,
            ReservationStatus status
    );

    @Query("""
    SELECT DISTINCT r.book 
    FROM Reservation r 
    WHERE r.status IN ('PENDING', 'HOLDING')
""")
    List<Book> findBooksWithActiveReservations();

    boolean existsByUserIdAndBookIdAndStatusIn(
            Long userId,
            Long bookId,
            List<ReservationStatus> statuses
    );

    boolean existsByBookIdAndTypeAndStatus(Long id, ReservationType reservationType, ReservationStatus reservationStatus);

    int countByBookIdAndTypeAndStatus(Long id, ReservationType reservationType, ReservationStatus reservationStatus);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId AND r.status IN ('PENDING', 'HOLDING')")
    int countActiveReservationsByUserId(@Param("userId") Long userId);
    List<Reservation> findByUserEmailOrderByReservationDateDesc(String email);
}