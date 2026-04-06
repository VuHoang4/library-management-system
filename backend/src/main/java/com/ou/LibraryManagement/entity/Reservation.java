package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;
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
    private ReservationType type;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @ManyToOne
    private User user;

    @ManyToOne
    private Book book;

    @PrePersist
    public void prePersist(){
        if(reservationDate == null){
            reservationDate = LocalDate.now();
        }
    }
}