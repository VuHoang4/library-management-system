package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Author;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
    boolean existsByName(@NotBlank(message = "Author name không được để trống") @Size(max = 255) String name);
}