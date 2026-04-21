package com.ou.LibraryManagement.dto.pos;

import java.util.List;

public record CheckoutRequest(
        Long userId,
        List<Long> bookIds
) {}