package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContaining(String keyword);
    List<Book> findByTitleContainingIgnoreCase(String keyword);

}