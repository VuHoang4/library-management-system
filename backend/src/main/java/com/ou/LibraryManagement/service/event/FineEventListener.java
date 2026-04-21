package com.ou.LibraryManagement.service.event;

import com.ou.LibraryManagement.entity.Borrow;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.Notification;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.entity.enums.NotificationType;
import com.ou.LibraryManagement.service.FineService;
import com.ou.LibraryManagement.service.NotificationService;
import com.ou.LibraryManagement.service.SystemSettingService;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
@Component
public class FineEventListener {

    private final FineService fineService;
    private final SystemSettingService settingService;
    private final NotificationService notificationService;

    public FineEventListener(FineService fineService,
                             SystemSettingService settingService,
                             NotificationService notificationService) {
        this.fineService = fineService;
        this.settingService = settingService;
        this.notificationService = notificationService;
    }

    @EventListener
    public void onBookReturned(BookReturnedEvent event) {

        Borrow record = event.record();
        LocalDate returnDate = record.getReturnDate();

        // 1. Không trễ → bỏ qua
        if (!returnDate.isAfter(record.getDueDate())) {
            return;
        }

        // 2. Tránh tạo duplicate fine
        if (fineService.existsByBorrowId(record.getId())) {
            return;
        }

        // 3. Tính tiền phạt
        long daysLate = ChronoUnit.DAYS.between(record.getDueDate(), returnDate);
        SystemSetting setting = settingService.getActiveSetting();
        double fineAmount = daysLate * setting.getFinePerDay();

        // 4. Lưu fine
        Fine fine = new Fine();
        fine.setBorrow(record);
        fine.setUser(record.getUser());
        fine.setAmount(fineAmount);
        fine.setStatus(FineStatus.UNPAID);

        fineService.save(fine);

        // 5. Gửi notification
        Notification notification = new Notification();
        notification.setUser(record.getUser());
        notification.setTitle("Sách quá hạn");
        notification.setType(NotificationType.WARNING);
        notification.setContent("Bạn bị phạt " + fineAmount + "đ do trả sách trễ hạn.");
        notification.setRead(false);

        notificationService.save(notification);
    }
}