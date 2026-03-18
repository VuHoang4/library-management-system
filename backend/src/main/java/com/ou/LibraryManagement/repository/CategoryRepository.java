package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}