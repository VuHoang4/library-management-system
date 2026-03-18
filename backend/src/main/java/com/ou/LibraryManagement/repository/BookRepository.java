package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContaining(String keyword);
    List<Book> findByTitleContainingIgnoreCase(String keyword);

}