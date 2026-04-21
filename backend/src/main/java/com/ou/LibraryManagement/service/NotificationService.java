package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.notification.NotificationRequest;
import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.entity.Notification;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.NotificationMapper;
import com.ou.LibraryManagement.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UserService userService;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository repository,
                               UserService userService,
                               NotificationMapper notificationMapper) {
        this.repository = repository;
        this.userService = userService;
        this.notificationMapper = notificationMapper;
    }

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    // ================== ADMIN ==================

    @Transactional
    public void sendManualNotification(NotificationRequest request) {
        User user = userService.findEntityById(request.userId());

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.title());
        notification.setContent(request.content());
        notification.setType(request.type());

        repository.save(notification);
    }

    // ================== READER ==================

    public List<NotificationResponse> getMyNotifications(String email) {
        return repository.findByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = findEntityById(id);
        notification.setRead(true);
        repository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String email) {
        List<Notification> unreadList =
                repository.findByUserEmailAndIsReadFalse(email);

        unreadList.forEach(n -> n.setRead(true));
        repository.saveAll(unreadList);
    }

    // ================== INTERNAL ==================

    public Notification findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy thông báo!"));
    }
}