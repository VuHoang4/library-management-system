package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.dto.book.BookResponse;

import java.util.List;

public record DashboardResponse(
        int borrowCount,
        int reservationCount,
        double debt,
        List<BookResponse> dueSoon,
        List<BookResponse> featuredBooks
) {}