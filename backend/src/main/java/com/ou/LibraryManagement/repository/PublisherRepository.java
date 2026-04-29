package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    List<Publisher> findAllByIsActiveTrue();

    boolean existsByNameAndIsActiveTrue(String name);
}