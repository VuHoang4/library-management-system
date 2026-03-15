package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.BorrowRequest;
import com.ou.LibraryManagement.dto.BorrowResponse;
import com.ou.LibraryManagement.model.*;
import com.ou.LibraryManagement.repository.*;
import org.springframework.http.ResponseEntity;
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

    // Borrow Book
    public ResponseEntity<BorrowResponse> borrowBook(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if(book.getAvailableQuantity() <= 0){
            throw new RuntimeException("Book not available");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SystemSetting setting = settingRepository.findById(1L).orElse(null);

        BorrowRecord record = new BorrowRecord();

        record.setBook(book);
        record.setUser(user);

        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(setting.getBorrowDays()));
        record.setStatus("BORROWED");

        book.setAvailableQuantity(book.getAvailableQuantity() - 1);

        BorrowRecord saved = repository.save(record);
        bookRepository.save(book);

        return ResponseEntity.ok(BorrowResponse.fromEntity(saved));
    }

    // Return Book
    public ResponseEntity<BorrowResponse> returnBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        Book book = record.getBook();

        record.setReturnDate(LocalDate.now());
        record.setStatus("RETURNED");

        book.setAvailableQuantity(book.getAvailableQuantity() + 1);

        repository.save(record);
        bookRepository.save(book);

        // Fine calculation
        if(record.getReturnDate().isAfter(record.getDueDate())){

            long daysLate = ChronoUnit.DAYS.between(
                    record.getDueDate(),
                    record.getReturnDate()
            );

            SystemSetting setting = settingRepository.findById(1L).orElse(null);

            double fineAmount = daysLate * setting.getFinePerDay();

            Fine fine = new Fine();

            fine.setBorrowRecord(record);
            fine.setAmount(fineAmount);
            fine.setStatus("UNPAID");

            fineRepository.save(fine);
        }

        return ResponseEntity.ok(BorrowResponse.fromEntity(record));
    }

}