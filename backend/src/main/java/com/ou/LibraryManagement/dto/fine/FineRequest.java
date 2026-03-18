package com.ou.LibraryManagement.dto.fine;

public record FineRequest(

        Long borrowId,
        double amount

) {}