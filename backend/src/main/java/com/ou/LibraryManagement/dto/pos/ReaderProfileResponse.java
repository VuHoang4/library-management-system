package com.ou.LibraryManagement.dto.pos;

import java.util.List;

public record ReaderProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        boolean isActive,
        double unpaidFine,
        HoldingBookDto holdingBook,
        List<ActiveBorrowResponse> activeBorrows
) {}