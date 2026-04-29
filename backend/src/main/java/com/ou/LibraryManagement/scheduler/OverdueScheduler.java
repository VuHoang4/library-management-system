package com.ou.LibraryManagement.scheduler;

import com.ou.LibraryManagement.entity.Borrow;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.service.FineService;
import com.ou.LibraryManagement.service.NotificationService;
import com.ou.LibraryManagement.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OverdueScheduler {

    private final BorrowRepository borrowRepository;
    private final FineService fineService;
    private final SystemSettingService settingService;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 1500000)
    @Transactional
    public void scanOverdueBooks() {

        LocalDate today = LocalDate.now();

        List<Borrow> records =
                borrowRepository.findByReturnDateIsNullAndDueDateBefore(today);

        SystemSetting setting = settingService.getActiveSetting();

        for (Borrow record : records) {

            long daysLate = ChronoUnit.DAYS.between(record.getDueDate(), today);
            if (daysLate <= 0) continue;

            double currentAmount = daysLate * setting.getFinePerDay();

            Optional<Fine> existingFineOpt =
                    fineService.findByBorrowId(record.getId());

            if (existingFineOpt.isPresent()) {

                Fine existingFine = existingFineOpt.get();

                if (existingFine.getStatus() == FineStatus.UNPAID) {
                    existingFine.setAmount(currentAmount);
                    fineService.save(existingFine);
                }

            } else {

                Fine newFine = new Fine();
                newFine.setBorrow(record);
                newFine.setUser(record.getUser());
                newFine.setAmount(currentAmount);
                newFine.setStatus(FineStatus.UNPAID);

                fineService.save(newFine);
            }
        }
    }
}