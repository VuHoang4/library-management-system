package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.BorrowRecord;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class FineService {

    private final FineRepository repository;
    private final SystemSettingRepository settingRepository;
    private final NotificationService notificationService;

    public FineService(FineRepository repository, SystemSettingRepository settingRepository, NotificationService notificationService) {
        this.repository = repository;
        this.settingRepository = settingRepository;
        this.notificationService = notificationService;
    }

    // ================= QUERY =================

    public List<FineResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public FineResponse findById(Long id){
        return FineResponse.fromEntity(findEntityById(id));
    }

    public List<FineResponse> getByUserEmail(String email){
        return repository.findByUserEmail(email)
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public List<FineResponse> getUnpaidByUserId(Long userId){
        return repository.findByUserIdAndStatus(userId, FineStatus.UNPAID)
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public List<FineResponse> getUnpaidByUserEmail(String email){
        return repository.findByUserEmailAndStatus(email, FineStatus.UNPAID)
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public boolean hasUnpaidFine(Long userId){
        return repository.existsByUserIdAndStatus(userId, FineStatus.UNPAID);
    }

    // ================= COMMAND =================

    @Transactional
    public Fine createFine(BorrowRecord record, double amount){

        // tránh tạo duplicate fine cho cùng 1 borrow
        Optional<Fine> existing = repository.findByBorrowRecordId(record.getId());
        if(existing.isPresent()){
            return existing.get();
        }

        Fine fine = new Fine();
        fine.setBorrowRecord(record);
        fine.setUser(record.getUser());
        fine.setAmount(amount);
        fine.setStatus(FineStatus.UNPAID);

        return repository.save(fine);
    }

    @Transactional
    public void handleFineForBorrow(BorrowRecord record, LocalDate returnDate){

        //  không trễ thì thôi
        if(!returnDate.isAfter(record.getDueDate())) return;

        //  tránh duplicate
        Optional<Fine> existing = repository.findByBorrowRecordId(record.getId());
        if(existing.isPresent()) return;

        long daysLate = ChronoUnit.DAYS.between(
                record.getDueDate(),
                returnDate
        );

        SystemSetting setting = settingRepository.findByActiveTrue()
                .orElseThrow(() -> new NotFoundException("System setting not found"));

        double fineAmount = daysLate * setting.getFinePerDay();

        Fine fine = new Fine();
        fine.setBorrowRecord(record);
        fine.setUser(record.getUser());
        fine.setAmount(fineAmount);
        fine.setStatus(FineStatus.UNPAID);

        repository.save(fine);

        notificationService.notifyUser(
                record.getUser().getId(),
                "Sách quá hạn",
                "Bạn bị phạt " + fineAmount + "đ"
        );
    }

    // ================= HELPER =================

    public Fine findEntityById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + id));
    }
    public boolean existsByBorrowRecord(Long borrowId){
        return repository.existsByBorrowRecordId(borrowId);
    }
}