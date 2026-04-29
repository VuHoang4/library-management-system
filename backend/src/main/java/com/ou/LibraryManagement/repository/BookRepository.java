package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByIsActiveTrue();

    List<Book> findByTitleContainingIgnoreCaseAndIsActiveTrue(String keyword);

    boolean existsByAuthorId(Long id);
    boolean existsByIsbn(String isbn);
    boolean existsByIsbnAndIdNot(String isbn, Long id); // Dùng cho update
    boolean existsByCategoryId(Long id);
    boolean existsByPublisherId(Long id);
    @Query("""
    SELECT b FROM Book b
    WHERE b.isActive = true AND (
        LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(b.author.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(b.publisher.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
""")
    List<Book> searchAll(@Param("keyword") String keyword);
}