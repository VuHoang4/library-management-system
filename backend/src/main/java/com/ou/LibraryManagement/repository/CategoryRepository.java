package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Category;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(@NotBlank(message = "Category name không được để trống") String name);
}