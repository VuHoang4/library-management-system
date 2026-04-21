package com.ou.LibraryManagement.dto.borrow;

import jakarta.validation.constraints.NotNull;

public record BorrowRequest(

        @NotNull(message = "ID Độc giả không được để trống")
        Long userId,

        @NotNull(message = "ID Sách không được để trống")
        Long bookId

) {}