package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmailOrderByCreatedAtDesc(String email);

    long countByUserIdAndIsReadFalse(Long userId);

    List<Notification> findByUserEmailAndIsReadFalse(String email);
}