package com.ou.LibraryManagement.service.impl;

import com.ou.LibraryManagement.dto.dashboard.*;
import com.ou.LibraryManagement.dto.dashboard.admin.BadDebtorResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.TopBookResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.DashboardSummaryResponse;
import com.ou.LibraryManagement.repository.*;
import com.ou.LibraryManagement.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private FineRepository fineRepository;

    @Override
    public DashboardSummaryResponse getSummary() {

        long totalReaders = userRepository.countByRole_Name("READER");

        long activeBorrows = borrowRepository.countByReturnDateIsNull();

        long overdue = borrowRepository.countOverdue();

        Double fine = fineRepository.sumMonthlyFine();

        return new DashboardSummaryResponse(
                totalReaders,
                activeBorrows,
                fine != null ? fine : 0,
                overdue
        );
    }

    @Override
    public List<TopBookResponse> getTopBooks() {
        return borrowRepository.findTopBooks(PageRequest.of(0, 5));
    }

    @Override
    public List<BadDebtorResponse> getBadDebtors() {

        List<BadDebtorResponse> list =
                fineRepository.findBadDebtors(PageRequest.of(0, 5));

        return list.stream()
                .map(d -> {

                    int daysLate = borrowRepository.findMaxDaysLateByUserId(d.id());

                    return new BadDebtorResponse(
                            d.id(),
                            d.name(),
                            d.phone(),
                            d.debt(),
                            daysLate
                    );
                })
                .toList();
    }
}