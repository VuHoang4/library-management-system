package com.ou.LibraryManagement.dto.borrow;

import jakarta.validation.constraints.NotNull;

public record BorrowRequest(
        @NotNull
        Long userId,

        @NotNull
        Long bookId
) {}