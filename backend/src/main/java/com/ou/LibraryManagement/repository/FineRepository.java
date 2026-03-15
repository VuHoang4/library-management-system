package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<Fine, Long> {
}