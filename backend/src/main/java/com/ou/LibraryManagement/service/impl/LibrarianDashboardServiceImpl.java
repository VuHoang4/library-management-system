package com.ou.LibraryManagement.service.impl;

import com.ou.LibraryManagement.dto.dashboard.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.dto.dashboard.lib.LibrarianDashboardResponse;
import com.ou.LibraryManagement.dto.dashboard.lib.RecentBorrowResponse;
import com.ou.LibraryManagement.entity.User; // Entity User của bạn
import com.ou.LibraryManagement.repository.*;
import com.ou.LibraryManagement.service.DashboardService;
import com.ou.LibraryManagement.service.LibrarianDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
public class LibrarianDashboardServiceImpl implements LibrarianDashboardService {

    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final UserRepository userRepository;

    public LibrarianDashboardServiceImpl(
            BookRepository bookRepository,
            BorrowRepository borrowRepository,
            UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.borrowRepository = borrowRepository;
        this.userRepository = userRepository;
    }

    @Override
    public LibrarianDashboardResponse getSummary() {
        return new LibrarianDashboardResponse(
                bookRepository.count(),
                borrowRepository.countByReturnDateIsNull(),
                borrowRepository.countOverdue(),
                userRepository.countByRoleName("READER")
        );
    }

    @Override
    public List<RecentBorrowResponse> getRecentBorrows() {
        return borrowRepository.findTop10ByOrderByBorrowDateDesc()
                .stream()
                .map(b -> new RecentBorrowResponse(
                        b.getId(),
                        b.getUser().getName(),
                        b.getBook().getTitle(),
                        b.getBorrowDate(),
                        b.getStatus().name()
                ))
                .toList();
    }
}