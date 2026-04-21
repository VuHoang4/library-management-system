package com.ou.LibraryManagement.dto.reservation;

import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservationResponse(
        Long id,
        String userName,
        String bookTitle,
        String imageUrl,
        LocalDate reservationDate,
        ReservationType type,
        ReservationStatus status,
        LocalDate expireDate,

        //  THÊM: Quan trọng để xác định thứ tự trong hàng đợi (Queue)
        LocalDateTime createdAt,

        Long userId,
        Long bookId
) {}