package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, Long> {
}