package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.dto.HotBook;
import com.ou.LibraryManagement.dto.Overdue;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.TopBookResponse;
import com.ou.LibraryManagement.entity.Borrow;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    List<Borrow> findByUserId(Long userId);
    List<Borrow> findByUserEmail(String email);
    long countByReturnDateIsNull();

    @Query("""
        SELECT COUNT(b)
        FROM Borrow b
        WHERE b.returnDate IS NULL
          AND b.dueDate < CURRENT_DATE
    """)
    long countOverdue();

    List<Borrow> findTop10ByOrderByBorrowDateDesc();

    @Query("""
        SELECT new com.ou.LibraryManagement.dto.HotBook(b.title, COUNT(br.id))
        FROM Borrow br JOIN br.book b
        GROUP BY b.title ORDER BY COUNT(br.id) DESC
    """)
    List<HotBook> getHotBooks();

    @Query("SELECT COUNT(br) FROM Borrow br WHERE br.user.id = :userId AND br.status = 'BORROWED'")
    int countActiveBorrowsByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT new com.ou.LibraryManagement.dto.dashboard.DueSoonResponse(
            br.id, b.id, b.title, b.author.name, b.imageUrl, br.borrowDate, br.dueDate
        )
        FROM Borrow br JOIN br.book b
        WHERE br.user.id = :userId 
          AND br.status = 'BORROWED' 
          AND br.dueDate BETWEEN CURRENT_DATE AND :endDate
        ORDER BY br.dueDate ASC
    """)
    List<DueSoonResponse> findDueSoonBooksByUserId(@Param("userId") Long userId, @Param("endDate") LocalDate endDate);

    @Query("""
        SELECT new com.ou.LibraryManagement.dto.dashboard.OverdueResponse(
            br.id, b.title, COALESCE(SUM(f.amount), 0.0)
        )
        FROM Borrow br JOIN br.book b
        LEFT JOIN Fine f ON f.borrow.id = br.id AND f.status = 'UNPAID'
        WHERE br.user.id = :userId 
          AND br.status = 'BORROWED' 
          AND br.dueDate < CURRENT_DATE
        GROUP BY br.id, b.title
        ORDER BY br.dueDate ASC
    """)
    List<OverdueResponse> findOverdueBooksByUserId(@Param("userId") Long userId);

    int countByBookIdAndReturnDateIsNull(Long id);
    Borrow findFirstByUserIdAndBookIdOrderByIdDesc(Long userId, Long bookId);
    @Query("SELECT b FROM Borrow b WHERE b.returnDate IS NULL AND b.dueDate < CURRENT_DATE")
    List<Borrow> getOverdueBooks();

    List<Borrow> findByReturnDateIsNullAndDueDateBefore(LocalDate date);

    @Query("""
SELECT COUNT(b)
FROM Borrow b
WHERE b.user.id = :userId
  AND b.status = 'BORROWED'
  AND b.returnDate IS NULL
  AND b.dueDate BETWEEN CURRENT_DATE AND :date
""")
    long countBorrowsDueSoon(@Param("userId") Long userId,
                             @Param("date") LocalDate date);

    boolean existsByUserIdAndBookIdAndReturnDateIsNull(Long userId, Long bookId);


    @Query("""
SELECT new com.ou.LibraryManagement.dto.dashboard.admin.TopBookResponse(
    b.id,
    b.title,
    COUNT(br.id)
)
FROM Borrow br
JOIN br.book b
GROUP BY b.id, b.title
ORDER BY COUNT(br.id) DESC
""")
    List<TopBookResponse> findTopBooks(Pageable pageable);

    @Query("""
SELECT COALESCE(MAX(
    CASE 
        WHEN b.dueDate < CURRENT_DATE 
        THEN FUNCTION('DATEDIFF', CURRENT_DATE, b.dueDate)
        ELSE 0
    END
), 0)
FROM Borrow b
WHERE b.user.id = :userId
""")
    int findMaxDaysLateByUserId(Long userId);
}