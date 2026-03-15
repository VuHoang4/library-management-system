package com.ou.LibraryManagement.dto;

public record FineRequest(

        Long borrowId,
        double amount

) {}