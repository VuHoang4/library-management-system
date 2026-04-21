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

    @Column(nullable = false)
    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @Column(nullable = false, length = 50)
    private String method; // VNPay, CASH, MOMO, v.v.

    //  SỬA: Mã đơn hàng từ ví điện tử phải là duy nhất để chống gian lận
    @Column(unique = true)
    private String orderId;

    //  THÊM: LAZY và nullable = false (Thanh toán thì phải gắn với 1 hóa đơn phạt)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fine_id", nullable = false)
    private Fine fine;

    //  THÊM: LAZY và nullable = false
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //  SỬA: Bảo vệ ngày tạo gốc
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // THÊM: Cực kỳ cần thiết để track thời điểm VNPay/MoMo trả kết quả về
    private LocalDateTime updatedAt;

    public Payment(){}

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // 🌟 THÊM: Tự động cập nhật thời gian khi đổi từ PENDING sang SUCCESS
    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }
}