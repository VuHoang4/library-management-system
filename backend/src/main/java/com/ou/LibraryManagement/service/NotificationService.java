package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.notification.NotificationRequest;
import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.entity.Notification;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.NotificationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository repository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<NotificationResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    public List<NotificationResponse> getByUser(Long userId){
        return repository.findByUserId(userId)
                .stream()
                .map(NotificationResponse::fromEntity)
                .toList();
    }

    public NotificationResponse create(NotificationRequest request){

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);

        // SỬA
        notification.setTitle(request.title());
        notification.setContent(request.content());

        Notification saved = repository.save(notification);

        return NotificationResponse.fromEntity(saved);
    }

    public void notifyUser(Long userId, String title, String content){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setContent(content);

        repository.save(notification);
    }
}