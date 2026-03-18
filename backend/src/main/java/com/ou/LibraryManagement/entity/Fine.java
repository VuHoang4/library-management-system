package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.FineStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "fines")
@Getter
@Setter
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FineStatus status = FineStatus.UNPAID;

    @ManyToOne
    @JoinColumn(name = "borrow_id")
    private BorrowRecord borrowRecord;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;

    public Fine(){}

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
    }
}