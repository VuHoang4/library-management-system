package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.dto.dashboard.admin.BadDebtorResponse;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {

    List<Fine> findByUserEmail(String email);

    List<Fine> findByUserIdAndStatus(Long userId, FineStatus status);

    List<Fine> findByUserEmailAndStatus(String email, FineStatus status);

    boolean existsByUserIdAndStatus(Long userId, FineStatus status);

    boolean existsByBorrowId(Long borrowId);

    Optional<Fine> findByBorrowId(Long borrowId);
    List<Fine> findByStatus(FineStatus status);


    @Query("SELECT COALESCE(SUM(f.amount), 0.0) FROM Fine f WHERE f.user.id = :userId AND f.status = 'UNPAID'")
    Double sumUnpaidAmountByUserId(@Param("userId") Long userId);

    long countByUserIdAndStatus(Long userId, FineStatus status);


    @Query("""
SELECT COALESCE(SUM(f.amount), 0)
FROM Fine f
WHERE MONTH(f.createdAt) = MONTH(CURRENT_DATE)
AND YEAR(f.createdAt) = YEAR(CURRENT_DATE)
""")
    Double sumMonthlyFine();

    @Query("""
SELECT new com.ou.LibraryManagement.dto.dashboard.admin.BadDebtorResponse(
    u.id,
    u.name,
    u.phone,
    COALESCE(SUM(f.amount), 0),
    0
)
FROM Fine f
JOIN f.user u
WHERE f.status = 'UNPAID'
GROUP BY u.id, u.name, u.phone
ORDER BY SUM(f.amount) DESC
""")
    List<BadDebtorResponse> findBadDebtors(Pageable pageable);
}