package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowRecordService {

    private final BorrowRecordRepository repository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;
    private final SystemSettingRepository settingRepository;

    public BorrowRecordService(
            BorrowRecordRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            FineRepository fineRepository,
            SystemSettingRepository settingRepository
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.fineRepository = fineRepository;
        this.settingRepository = settingRepository;
    }

    public List<BorrowResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(BorrowResponse::fromEntity)
                .toList();
    }

    public List<BorrowResponse> getByUser(Long userId){
        return repository.findByUserId(userId)
                .stream()
                .map(BorrowResponse::fromEntity)
                .toList();
    }

    //  BORROW BOOK
    public BorrowResponse borrowBook(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if(book.getAvailableQuantity() <= 0){
            throw new RuntimeException("Book not available");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SystemSetting setting = settingRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("System setting not found"));

        BorrowRecord record = new BorrowRecord();

        record.setBook(book);
        record.setUser(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(setting.getBorrowDays()));
        record.setStatus(BorrowStatus.BORROWED);

        // update số lượng
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);

        BorrowRecord saved = repository.save(record);
        bookRepository.save(book);

        return BorrowResponse.fromEntity(saved);
    }

    //  RETURN BOOK + AUTO CREATE FINE
    public BorrowResponse returnBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if(record.getStatus() == BorrowStatus.RETURNED){
            throw new RuntimeException("Book already returned");
        }

        Book book = record.getBook();

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        // update số lượng
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);

        repository.save(record);
        bookRepository.save(book);

        //  CALCULATE FINE
        if(record.getReturnDate().isAfter(record.getDueDate())){

            long daysLate = ChronoUnit.DAYS.between(
                    record.getDueDate(),
                    record.getReturnDate()
            );

            SystemSetting setting = settingRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("System setting not found"));

            double fineAmount = daysLate * setting.getFinePerDay();

            Fine fine = new Fine();
            fine.setBorrowRecord(record);
            fine.setUser(record.getUser()); //  QUAN TRỌNG
            fine.setAmount(fineAmount);
            fine.setStatus(FineStatus.UNPAID);

            fineRepository.save(fine);
        }

        return BorrowResponse.fromEntity(record);
    }
}