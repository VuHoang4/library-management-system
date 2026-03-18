package com.ou.LibraryManagement.dto.fine;

import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;

public record FineResponse(

        Long id,
        double amount,
        FineStatus status


) {

    public static FineResponse fromEntity(Fine fine){
        return new FineResponse(
                fine.getId(),
                fine.getAmount(),
                fine.getStatus()
        );
    }
}