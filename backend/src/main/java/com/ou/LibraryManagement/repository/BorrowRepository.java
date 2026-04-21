package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.dto.HotBook;
import com.ou.LibraryManagement.dto.Overdue;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.entity.Borrow;
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
    // Cho ReportService (Dòng 24)
    @Query("SELECT b FROM Borrow b WHERE b.returnDate IS NULL AND b.dueDate < CURRENT_DATE")
    List<Borrow> getOverdueBooks();

    // Cho OverdueScheduler (Dòng 36)
    List<Borrow> findByReturnDateIsNullAndDueDateBefore(LocalDate date);

    // Cho DashboardServiceImpl (Dòng 56)
    @Query("SELECT COUNT(b) FROM Borrow b WHERE b.user.id = :userId AND b.returnDate IS NULL AND b.dueDate < :date")
    long countBorrowsDueSoon(@Param("userId") Long userId, @Param("date") LocalDate date);
}