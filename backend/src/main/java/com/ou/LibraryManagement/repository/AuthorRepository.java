package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}