package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    List<Author> findAllByIsActiveTrue();

    boolean existsByNameAndIsActiveTrue(String name);
}