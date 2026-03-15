package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.model.Notification;
import com.ou.LibraryManagement.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public List<Notification> getAll() {
        return repository.findAll();
    }

    public Notification save(Notification notification) {
        return repository.save(notification);
    }
}