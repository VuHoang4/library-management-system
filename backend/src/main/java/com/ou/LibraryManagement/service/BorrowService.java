package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRepository repository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final SystemSettingRepository settingRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final FineService fineService;

    public BorrowService(
            BorrowRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            SystemSettingRepository settingRepository,
            ReservationRepository reservationRepository, ReservationService reservationService,
            FineService fineService
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.settingRepository = settingRepository;
        this.reservationRepository = reservationRepository;
        this.reservationService = reservationService;
        this.fineService = fineService;
    }

    // ================= QUERY =================

    public List<BorrowRecord> findAll(){
        return repository.findAll();
    }

    public List<BorrowRecord> getByUser(Long userId){
        return repository.findByUserId(userId);
    }

    // ================= BORROW =================

    @Transactional
    public BorrowRecord borrow(BorrowRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new NotFoundException("Book not found"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // check fine
        if(fineService.hasUnpaidFine(user.getId())){
            throw new BadRequestException("Bạn còn tiền phạt");
        }

        // expire holding trước
        List<Reservation> holdingList = reservationRepository
                .findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationType.HOLD,
                        ReservationStatus.HOLDING
                );

        Reservation userHolding = holdingList.stream()
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElse(null);

        int borrowed = repository.countByBookIdAndReturnDateIsNull(book.getId());
        int holding = holdingList.size();

        if(borrowed + holding >= book.getQuantity()){
            if(userHolding == null){
                throw new BadRequestException("Book is reserved for another user");
            }

            if(userHolding.getExpireDate() != null &&
                    userHolding.getExpireDate().isBefore(LocalDate.now())){
                throw new BadRequestException("Reservation expired");
            }
        }

        SystemSetting setting = settingRepository.findByActiveTrue()
                .orElseThrow(() -> new NotFoundException("System setting not found"));

        BorrowRecord record = new BorrowRecord();
        record.setBook(book);
        record.setUser(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(setting.getBorrowDays()));
        record.setStatus(BorrowStatus.BORROWED);

        if(userHolding != null){
            reservationService.completeReservation(user.getId(), book.getId());
        }
        return repository.save(record);
    }

    // ================= RETURN =================

    @Transactional
    public BorrowRecord returnBook(Long id){

        BorrowRecord record = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Borrow record not found"));

        if(record.getStatus() == BorrowStatus.RETURNED){
            throw new BadRequestException("Book already returned");
        }

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        return repository.save(record);
    }

    // ================= RENEW =================

    @Transactional
    public BorrowRecord renew(Long id){

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

        return repository.save(record);
    }
}