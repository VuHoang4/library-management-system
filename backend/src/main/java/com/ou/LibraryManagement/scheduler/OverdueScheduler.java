package com.ou.LibraryManagement.scheduler;


import com.ou.LibraryManagement.entity.BorrowRecord;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import com.ou.LibraryManagement.service.FineService;
import com.ou.LibraryManagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OverdueScheduler {

    private final BorrowRepository borrowRepository;
    private final FineService fineService;
    private final SystemSettingRepository settingRepository;
    private final NotificationService notificationService;

    // chạy mỗi 1 giờ
    @Scheduled(cron = "0 0 * * * *")
    public void scanOverdueBooks() {

        List<BorrowRecord> records =
                borrowRepository
                        .findByReturnDateIsNullAndDueDateBefore(LocalDateTime.now());

        for (BorrowRecord record : records) {

            fineService.handleFineForBorrow(
                    record,
                    LocalDate.now()
            );
        }
    }
}