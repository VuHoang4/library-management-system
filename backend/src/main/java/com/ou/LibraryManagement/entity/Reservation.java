package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "reservations")
@Getter
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate reservationDate;
    private LocalDate expireDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    public Reservation(){}

    @PrePersist
    public void prePersist(){
        if (reservationDate == null) {
            reservationDate = LocalDate.now();
        }
        if (expireDate == null) {
            expireDate = reservationDate.plusDays(2);
        }
        if (status == null) {
            status = ReservationStatus.PENDING;
        }
    }
}