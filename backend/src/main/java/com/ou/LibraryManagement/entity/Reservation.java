package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Getter
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate reservationDate;

    // Cho phép null vì trạng thái QUEUE sẽ chưa có ngày hết hạn
    private LocalDate expireDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    // THEM: fetch = FetchType.LAZY va nullable = false
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // THEM: fetch = FetchType.LAZY va nullable = false
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // THEM: Timestamps de track chinh xac thoi gian ai dat truoc, ai dat sau
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Reservation() {}

    @PrePersist
    public void prePersist(){
        if(reservationDate == null){
            reservationDate = LocalDate.now();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // THEM: preUpdate
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}