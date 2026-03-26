package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;
    private final ReservationService reservationService;
    private final FineService fineService;

    public BorrowRecordService(
            BorrowRecordRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            FineRepository fineRepository,
            SystemSettingRepository settingRepository,
            ReservationRepository reservationRepository,
            NotificationService notificationService,
            ReservationService reservationService,
            FineService fineService
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.fineRepository = fineRepository;
        this.settingRepository = settingRepository;
        this.reservationRepository = reservationRepository;
        this.notificationService = notificationService;
        this.reservationService = reservationService;
        this.fineService = fineService;
    }

    // ================= FIND =================
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

    // ================= BORROW =================
    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new NotFoundException("Book not found"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if(fineService.hasUnpaidFine(user.getId())){
            throw new BadRequestException("Bạn còn tiền phạt");
        }
        // ưu tiên reservation READY
        List<Reservation> readyList = reservationRepository
                .findByBookIdAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationStatus.READY
                );

        if(!readyList.isEmpty() &&
                !readyList.get(0).getUser().getId().equals(user.getId())){
            throw new BadRequestException("Book is reserved for another user");
        }

        //  tính available động
        int borrowed = repository.countByBookIdAndReturnDateIsNull(book.getId());
        int available = book.getQuantity() - borrowed;

        if (available <= 0) {
            throw new BadRequestException("Book not available");
        }

        SystemSetting setting = settingRepository.findByActiveTrue()
                .orElseThrow(() -> new NotFoundException("System setting not found"));

        BorrowRecord record = new BorrowRecord();
        record.setBook(book);
        record.setUser(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(setting.getBorrowDays()));
        record.setStatus(BorrowStatus.BORROWED);

        BorrowRecord saved = repository.save(record);

        // mark reservation COMPLETED nếu có
        if(!readyList.isEmpty()){
            Reservation r = readyList.stream()
                    .filter(x -> x.getUser().getId().equals(user.getId()))
                    .findFirst()
                    .orElse(null);

            if(r != null){
                r.setStatus(ReservationStatus.COMPLETED);
                reservationRepository.save(r);
            }
        }

        return BorrowResponse.fromEntity(saved);
    }

    // ================= RENEW =================
    @Transactional
    public BorrowResponse renewBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Borrow record not found"));

        if(record.getReturnDate() != null){
            throw new BadRequestException("Book already returned");
        }

        if(LocalDate.now().isAfter(record.getDueDate())){
            throw new BadRequestException("Cannot renew overdue book");
        }

        if(record.getRenewCount() >= 2){
            throw new BadRequestException("Max renew reached");
        }

        SystemSetting setting = settingRepository.findByActiveTrue()
                .orElseThrow(() -> new NotFoundException("System setting not found"));

        record.setDueDate(record.getDueDate().plusDays(setting.getBorrowDays()));
        record.setRenewCount(record.getRenewCount() + 1);

        return BorrowResponse.fromEntity(repository.save(record));
    }

    // ================= RETURN =================
    @Transactional
    public BorrowResponse returnBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Borrow record not found"));

        if(record.getStatus() == BorrowStatus.RETURNED){
            throw new BadRequestException("Book already returned");
        }

        Book book = record.getBook();

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        repository.save(record);

        // ================= FINE =================
        if(record.getReturnDate().isAfter(record.getDueDate())){

            long daysLate = ChronoUnit.DAYS.between(
                    record.getDueDate(),
                    record.getReturnDate()
            );

            SystemSetting setting = settingRepository.findByActiveTrue()
                    .orElseThrow(() -> new NotFoundException("System setting not found"));

            double fineAmount = daysLate * setting.getFinePerDay();

            Fine fine = new Fine();
            fine.setBorrowRecord(record);
            fine.setUser(record.getUser());
            fine.setAmount(fineAmount);
            fine.setStatus(FineStatus.UNPAID);

            fineRepository.save(fine);

            notificationService.notifyUser(
                    record.getUser().getId(),
                    "Trả sách trễ",
                    "Bạn bị phạt " + fineAmount + "đ"
            );
        }

        // queue reservation
        reservationService.processQueue(book);

        return BorrowResponse.fromEntity(record);
    }
}