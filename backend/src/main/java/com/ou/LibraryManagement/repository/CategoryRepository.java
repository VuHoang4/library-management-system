package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByActiveTrue();

    boolean existsByNameAndActiveTrue(String name);
}