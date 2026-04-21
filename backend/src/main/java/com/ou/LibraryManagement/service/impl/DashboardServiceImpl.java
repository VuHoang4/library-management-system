package com.ou.LibraryManagement.service.impl;

import com.ou.LibraryManagement.dto.dashboard.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.entity.User; // Entity User của bạn
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
        // 1. Lấy thông tin user từ DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email: " + email));

        Long userId = user.getId();

        // 2. Query DB để lấy các con số (BẠN SẼ CẦN TỰ VIẾT CÁC HÀM QUERY TRONG REPOSITORY CỦA MÌNH)

        // Ví dụ: Select count(*) from book_borrowing where user_id = ? and status = 'BORROWED'
        int borrowCount = borrowRepository.countActiveBorrowsByUserId(userId);

        // Ví dụ: Select count(*) from reservation where user_id = ? and status = 'PENDING'
        int reservationCount = reservationRepository.countActiveReservationsByUserId(userId);

        // Ví dụ: Select sum(amount) from fine where user_id = ? and status = 'UNPAID'
        // Cần check null nếu hàm sum() trả về null (khi không có nợ)
        Double totalDebtQuery = fineRepository.sumUnpaidAmountByUserId(userId);
        double totalDebt = (totalDebtQuery != null) ? totalDebtQuery : 0L;

        // Ví dụ: Đếm sách mượn có ngày hẹn trả nằm trong khoảng 3 ngày tới
        LocalDate next3Days = LocalDate.now().plusDays(3);
        int dueSoonCount = (int) borrowRepository.countBorrowsDueSoon(userId, next3Days);

        // 3. Đóng gói thành DTO và trả về
        return new DashboardSummaryResponse(borrowCount, reservationCount, totalDebt, dueSoonCount);
    }
    @Override
    public List<DueSoonResponse> getDueSoonBooks(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Cài đặt mốc chặn trên là 3 ngày sau
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