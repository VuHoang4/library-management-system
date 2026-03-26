package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.dto.HotBook;
import com.ou.LibraryManagement.dto.Overdue;
import com.ou.LibraryManagement.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByUserId(Long userId);

    @Query("""
    SELECT new com.ou.LibraryManagement.dto.HotBook(
        b.title,
        COUNT(br.id)
    )
    FROM BorrowRecord br
    JOIN br.book b
    GROUP BY b.title
    ORDER BY COUNT(br.id) DESC
""")
    List<HotBook> getHotBooks();


    @Query("""
    SELECT new com.ou.LibraryManagement.dto.Overdue(
        br.id,
        b.title,
        u.name,
        br.dueDate
    )
    FROM BorrowRecord br
    JOIN br.book b
    JOIN br.user u
    WHERE br.returnDate IS NULL
    AND br.dueDate < CURRENT_DATE
""")
    List<Overdue> getOverdueBooks();

    int countByBookIdAndReturnDateIsNull(Long id);
}