package com.ou.LibraryManagement.dto.pos;

import com.ou.LibraryManagement.dto.fine.FineDto;

import java.util.List;

public record ReaderProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        boolean isActive,
        double unpaidFine,
        List<FineDto> fines,
        List<HoldingBookDto> holdingBooks,
        List<ActiveBorrowResponse> activeBorrows
) {}