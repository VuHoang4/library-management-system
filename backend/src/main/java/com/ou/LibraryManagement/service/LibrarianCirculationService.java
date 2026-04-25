package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.fine.FineDto;
import com.ou.LibraryManagement.dto.pos.*;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LibrarianCirculationService {

    private final UserService userService;
    private final BorrowService borrowService;
    private final BookService bookService;
    private final ReservationService reservationService;
    private final FineService fineService;

    public LibrarianCirculationService(UserService userService,
                                       BorrowService borrowService,
                                       BookService bookService,
                                       ReservationService reservationService,
                                       FineService fineService) {
        this.userService = userService;
        this.borrowService = borrowService;
        this.bookService = bookService;
        this.reservationService = reservationService;
        this.fineService = fineService;
    }

    // ================= SEARCH READER =================
    public ReaderProfileResponse searchReader(String keyword) {

        // 👉 bạn chưa có search đa field → tạm dùng email
        User user = userService.findEntityByEmail(keyword)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy độc giả"));

        // ===== tiền phạt =====
        List<Fine> unpaidFines = fineService.findUnpaidByUserId(user.getId());

        double total = unpaidFines.stream()
                .mapToDouble(Fine::getAmount)
                .sum();

        List<FineDto> fineDtos = unpaidFines.stream()
                .map(f -> new FineDto(
                        f.getId(),
                        f.getAmount(),
                        "Trễ hạn " + f.getBorrow().getBook().getTitle(),
                        f.getBorrow().getId()
                ))
                .toList();

        // ===== sách đang giữ (HOLDING) =====
        List<HoldingBookDto> holdingDtos =
                reservationService.findHoldingByUserId(user.getId())
                        .stream()
                        .map(r -> new HoldingBookDto(
                                r.getBook().getId(),
                                r.getBook().getTitle()
                        ))
                        .toList();

        List<ActiveBorrowResponse> borrows =
                borrowService.findByUserId(user.getId()).stream()
                        .filter(b -> b.getReturnDate() == null)
                        .map(b -> {

                            boolean isOverdue = b.getDueDate().isBefore(LocalDate.now());

                            long daysLate = isOverdue
                                    ? ChronoUnit.DAYS.between(b.getDueDate(), LocalDate.now())
                                    : 0;

                            return new ActiveBorrowResponse(
                                    b.getId(),
                                    b.getBook().getTitle(),
                                    b.getBook().getAuthor().getName(),
                                    b.getBorrowDate(),
                                    b.getDueDate(),
                                    isOverdue ? "OVERDUE" : "BORROWED",
                                    (int) daysLate
                            );
                        })
                        .toList();

        return new ReaderProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.isActive(),
                total,
                fineDtos,
                holdingDtos,
                borrows
        );
    }

    // ================= SEARCH BOOK =================
    public BookSearchResponse findBook(String keyword) {

        Book book = bookService.search(keyword).stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách"));

        int available = reservationService.calculateAvailable(book);

        if (available <= 0) {
            throw new RuntimeException("Sách đã hết");
        }

        return new BookSearchResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor().getName(),
                book.getCategory().getName(),
                available
        );
    }

    // ================= CHECKOUT =================
    @Transactional
    public void checkout(CheckoutRequest request) {

        //  bỏ thanh toán → chỉ check
        if (fineService.hasUnpaidFine(request.userId())) {
            throw new RuntimeException("Độc giả còn nợ phí");
        }

        for (Long bookId : request.bookIds()) {
            borrowService.borrowBook(
                    new com.ou.LibraryManagement.dto.borrow.BorrowRequest(
                            request.userId(),
                            bookId
                    )
            );
        }
    }

    // ================= RETURN =================
    public void returnBook(Long borrowId) {
        borrowService.returnBook(borrowId);
    }

    // ================= GIVE HOLDING BOOK =================
    @Transactional
    public void giveHoldingBook(BorrowRequest request) {
        borrowService.borrowBook(request);
    }
}