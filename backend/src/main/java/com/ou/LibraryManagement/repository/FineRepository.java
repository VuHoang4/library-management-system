package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    // 1. Truy vấn cơ bản cho Reader & Librarian
    List<Fine> findByUserEmail(String email);

    List<Fine> findByUserIdAndStatus(Long userId, FineStatus status);

    List<Fine> findByUserEmailAndStatus(String email, FineStatus status);

    // 2. Các hàm "Check" để xử lý logic ở tầng Core/UseCase
    boolean existsByUserIdAndStatus(Long userId, FineStatus status);

    // Đổi tên thành công theo Entity mới (borrow thay vì borrowRecord)
    boolean existsByBorrowId(Long borrowId);

    Optional<Fine> findByBorrowId(Long borrowId);
    List<Fine> findByStatus(FineStatus status);

    // 3. Tính toán tổng nợ (Sử dụng Double/double để khớp với Entity)
    // COALESCE(SUM, 0.0) là "pha xử lý" điểm 10 giúp tránh lỗi Null khi User chưa có nợ.
    @Query("SELECT COALESCE(SUM(f.amount), 0.0) FROM Fine f WHERE f.user.id = :userId AND f.status = 'UNPAID'")
    Double sumUnpaidAmountByUserId(@Param("userId") Long userId);

    // 4. Bổ sung: Đếm số phiếu phạt chưa thanh toán (Hữu ích cho logic chặn mượn sách)
    long countByUserIdAndStatus(Long userId, FineStatus status);


}