package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.BorrowMapper;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.service.event.BookReturnedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
@Service
public class BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookService bookService;
    private final UserService userService;
    private final ReservationService reservationService;
    private final SystemSettingService settingService;
    private final FineService fineService;
    private final BorrowMapper borrowMapper;
    private final ApplicationEventPublisher eventPublisher;

    public BorrowService(BorrowRepository borrowRepository,
                         BookService bookService,
                         UserService userService,
                         ReservationService reservationService,
                         SystemSettingService settingService,
                         FineService fineService,
                         BorrowMapper borrowMapper,
                         ApplicationEventPublisher eventPublisher) {
        this.borrowRepository = borrowRepository;
        this.bookService = bookService;
        this.userService = userService;
        this.reservationService = reservationService;
        this.settingService = settingService;
        this.fineService = fineService;
        this.borrowMapper = borrowMapper;
        this.eventPublisher = eventPublisher;
    }
    public List<BorrowResponse> getAll() {
        return borrowRepository.findAll()
                .stream()
                .map(borrowMapper::toResponse)
                .toList();
    }

    // ================== READER ==================

    public List<BorrowResponse> getMyBorrows(String email) {
        return borrowRepository.findByUserEmail(email)
                .stream()
                .map(borrowMapper::toResponse)
                .toList();
    }

    // ================== LIBRARIAN ==================

    @Transactional
    public BorrowResponse borrowBook(BorrowRequest request) {

        Book book = bookService.findEntityById(request.bookId());
        User user = userService.findEntityById(request.userId());

        // 1. Check fine
        if (fineService.hasUnpaidFine(user.getId())) {
            throw new BadRequestException("Còn tiền phạt chưa thanh toán!");
        }

        // 2. Reservation logic
        List<Reservation> holdingList = reservationService.getHoldingListAsc(book.getId());

        Reservation userHolding = holdingList.stream()
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .findFirst().orElse(null);

        int borrowed = countBorrowedByBookId(book.getId());
        int holdingCount = holdingList.size();

        if (borrowed + holdingCount >= book.getQuantity()) {
            if (userHolding == null) {
                throw new BadRequestException("Sách đã hết!");
            }

            if (userHolding.getExpireDate() != null &&
                    userHolding.getExpireDate().isBefore(LocalDate.now())) {
                throw new BadRequestException("Phiếu giữ sách hết hạn!");
            }
        }

        SystemSetting setting = settingService.getActiveSetting();

        Borrow record = new Borrow();
        record.setBook(book);
        record.setUser(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(setting.getBorrowDays()));
        record.setStatus(BorrowStatus.BORROWED);

        if (userHolding != null) {
            userHolding.setStatus(ReservationStatus.COMPLETED);
            reservationService.save(userHolding);
        }

        return borrowMapper.toResponse(borrowRepository.save(record));
    }

    @Transactional
    public BorrowResponse returnBook(Long id) {

        Borrow record = findEntityById(id);

        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("Đã trả rồi!");
        }

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowStatus.RETURNED);

        Borrow saved = borrowRepository.save(record);
        eventPublisher.publishEvent(new BookReturnedEvent(saved));

        return borrowMapper.toResponse(saved);
    }

    @Transactional
    public BorrowResponse renewBook(Long id) {

        Borrow record = findEntityById(id);
        SystemSetting setting = settingService.getActiveSetting();

        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("Không thể gia hạn!");
        }

        if (LocalDate.now().isAfter(record.getDueDate())) {
            throw new BadRequestException("Đã quá hạn!");
        }

        if (record.getRenewCount() >= setting.getMaxRenew()) {
            throw new BadRequestException("Đã đạt max gia hạn!");
        }

        record.setDueDate(record.getDueDate().plusDays(setting.getBorrowDays()));
        record.setRenewCount(record.getRenewCount() + 1);

        return borrowMapper.toResponse(borrowRepository.save(record));
    }

    // ================== INTERNAL ==================

    public Borrow findEntityById(Long id) {
        return borrowRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Borrow not found"));
    }

    public List<Borrow> findByUserId(Long userId) {
        return borrowRepository.findByUserId(userId);
    }

    private int countBorrowedByBookId(Long bookId) {
        return borrowRepository.countByBookIdAndReturnDateIsNull(bookId);
    }

    public Borrow findFirstByUserIdAndBookId(Long userId, Long bookId) {
        return borrowRepository
                .findFirstByUserIdAndBookIdOrderByIdDesc(userId, bookId);
    }
}