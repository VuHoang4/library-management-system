package com.ou.LibraryManagement.entity;

import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String method; // VNPay, CASH, etc.

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "fine_id")
    private Fine fine;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Payment(){}

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
    }
}