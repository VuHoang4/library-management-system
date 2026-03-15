package com.ou.LibraryManagement.model;

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

    private String status;

    private LocalDateTime paidAt;

    @OneToOne
    @JoinColumn(name = "borrow_id")
    private BorrowRecord borrowRecord;

    public Fine(){}
}