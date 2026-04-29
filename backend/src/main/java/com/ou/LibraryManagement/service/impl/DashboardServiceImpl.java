package com.ou.LibraryManagement.service.impl;

import com.ou.LibraryManagement.dto.dashboard.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.repository.UserRepository;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private FineRepository fineRepository;

    @Override
    public DashboardSummaryResponse getSummaryByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        Long userId = user.getId();

        int borrowCount = borrowRepository.countActiveBorrowsByUserId(userId);
        int reservationCount = reservationRepository.countActiveReservationsByUserId(userId);

        Double totalDebtQuery = fineRepository.sumUnpaidAmountByUserId(userId);
        double totalDebt = (totalDebtQuery != null) ? totalDebtQuery : 0.0;

        LocalDate next3Days = LocalDate.now().plusDays(3);
        int dueSoonCount = (int) borrowRepository.countBorrowsDueSoon(userId, next3Days);

        return new DashboardSummaryResponse(borrowCount, reservationCount, totalDebt, dueSoonCount);
    }

    @Override
    public List<DueSoonResponse> getDueSoonBooks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate next3Days = LocalDate.now().plusDays(3);

        return borrowRepository.findDueSoonBooksByUserId(user.getId(), next3Days);
    }

    @Override
    public List<OverdueResponse> getOverdueBooks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return borrowRepository.findOverdueBooksByUserId(user.getId());
    }
}