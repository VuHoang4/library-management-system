package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.notification.NotificationRequest;
import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.entity.Notification;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.NotificationMapper;
import com.ou.LibraryManagement.repository.NotificationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationService(NotificationRepository repository,
                               UserService userService, UserRepository userRepository,
                               NotificationMapper notificationMapper) {
        this.repository = repository;
        this.userService = userService;
        this.userRepository = userRepository;
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

    public void create(NotificationRequest req) {

        List<User> users;

        if (req.targetRole().equals("ALL")) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findByRole_Name(req.targetRole());
        }

        List<Notification> list = users.stream().map(u -> {
            Notification n = new Notification();
            n.setTitle(req.title());
            n.setContent(req.content());
            n.setType(req.type());
            n.setUser(u);
            return n;
        }).toList();

        repository.saveAll(list);
    }

    // ================== INTERNAL ==================

    public Notification findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy thông báo!"));
    }
}