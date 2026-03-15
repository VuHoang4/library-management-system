package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}