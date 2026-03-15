package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Fine;

import java.time.LocalDateTime;

public record FineResponse(

        Long id,
        double amount,
        String status,
        LocalDateTime paidAt

) {

    public static FineResponse fromEntity(Fine fine){
        return new FineResponse(
                fine.getId(),
                fine.getAmount(),
                fine.getStatus(),
                fine.getPaidAt()
        );
    }
}