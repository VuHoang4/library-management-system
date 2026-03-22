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

    public BorrowRecordService(
            BorrowRecordRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            FineRepository fineRepository,
            SystemSettingRepository settingRepository,
            ReservationRepository reservationRepository,
            NotificationService notificationService,
            ReservationService reservationService
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.fineRepository = fineRepository;
        this.settingRepository = settingRepository;
        this.reservationRepository = reservationRepository;
        this.notificationService = notificationService;
        this.reservationService = reservationService;
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

    // ================= BORROW =================
    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //  CHECK reservation READY (ưu tiên người đặt)
        List<Reservation> readyList = reservationRepository
                .findByBookIdAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationStatus.READY
                );

        if(!readyList.isEmpty() && !readyList.get(0).getUser().getId().equals(user.getId())){
            throw new BadRequestException("Book is reserved for another user");
        }
//        //chặn PENDING queue
//        List<Reservation> pendingList = reservationRepository
//                .findByBookIdAndStatusOrderByReservationDateAsc(
//                        book.getId(),
//                        ReservationStatus.PENDING
//                );
//
//        if(!pendingList.isEmpty()){
//            Long firstUser = pendingList.get(0).getUser().getId();
//
//            if(!firstUser.equals(user.getId())){
//                throw new BadRequestException("Book is reserved for another user");
//            }
//        }

        if(book.getAvailableQuantity() <= 0){
            throw new NotFoundException("Book not available");
        }

        SystemSetting setting = settingRepository.findById(1L)
                .orElseThrow(() -> new NotFoundException("System setting not found"));

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

        //  nếu borrow từ reservation → mark COMPLETED
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

    @Transactional
    public BorrowResponse renewBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        //  đã trả rồi thì không renew
        if(record.getReturnDate() != null){
            throw new BadRequestException("Book already returned");
        }

        //  quá hạn thì không cho renew
        if(LocalDate.now().isAfter(record.getDueDate())){
            throw new BadRequestException("Cannot renew overdue book");
        }

        //  giới hạn số lần gia hạn
        if(record.getRenewCount() >= 2){
            throw new BadRequestException("Max renew reached");
        }

        SystemSetting setting = settingRepository.findById(1L)
                .orElseThrow(() -> new NotFoundException("Setting not found"));

        //  gia hạn
        record.setDueDate(record.getDueDate().plusDays(setting.getBorrowDays()));
        record.setRenewCount(record.getRenewCount() + 1);

        BorrowRecord updated = repository.save(record);

        return BorrowResponse.fromEntity(updated);
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

        // update số lượng
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);

        repository.save(record);
        bookRepository.save(book);

        // ================= FINE =================
        if(record.getReturnDate().isAfter(record.getDueDate())){

            long daysLate = ChronoUnit.DAYS.between(
                    record.getDueDate(),
                    record.getReturnDate()
            );

            SystemSetting setting = settingRepository.findById(1L)
                    .orElseThrow(() -> new NotFoundException("System setting not found"));

            double fineAmount = daysLate * setting.getFinePerDay();

            Fine fine = new Fine();
            fine.setBorrowRecord(record);
            fine.setUser(record.getUser());
            fine.setAmount(fineAmount);
            fine.setStatus(FineStatus.UNPAID);

            fineRepository.save(fine);

            //  NOTIFICATION (fine)
            notificationService.notifyUser(
                    record.getUser().getId(),
                    "Trả sách trễ",
                    "Bạn bị phạt " + fineAmount + "đ"
            );
        }

        //  đồng bộ queue chuẩn
        reservationService.processQueue(book);

        return BorrowResponse.fromEntity(record);
    }
}