package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.reservation.ReservationRequest;
import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.entity.enums.ReservationType;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.ReservationMapper;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;

// Import Mapper tương ứng...
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final UserService userService;
    private final ReservationMapper reservationMapper;

    public ReservationService(ReservationRepository reservationRepository,
                              BorrowRepository borrowRepository, BookRepository bookRepository,

                              UserService userService,
                              ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;

        this.userService = userService;
        this.reservationMapper = reservationMapper;
    }

    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    @Transactional
    public void complete(Long userId, Long bookId) {

        Reservation res = findFirstActive(userId, bookId);

        if (res == null || res.getStatus() != ReservationStatus.HOLDING) {
            throw new BadRequestException("Không tìm thấy phiếu giữ sách hợp lệ.");
        }

        res.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(res);
    }

    // ================== READER ==================

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request, String email) {

        User user = userService.findEntityByEmail(email)
                .orElseThrow(() -> new BadRequestException("User không tồn tại"));

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách"));

        boolean isBorrowing = borrowRepository
                .existsByUserIdAndBookIdAndReturnDateIsNull(user.getId(), book.getId());

        if (isBorrowing) {
            throw new BadRequestException("Bạn đang mượn cuốn sách này, không thể đặt trước.");
        }

        if (findFirstActive(user.getId(), book.getId()) != null) {
            throw new BadRequestException("Bạn đã đặt sách này rồi.");
        }

        int available = calculateAvailable(book);

        Reservation res = new Reservation();
        res.setBook(book);
        res.setUser(user);
        res.setReservationDate(LocalDate.now());

        if (available > 0) {
            res.setType(ReservationType.HOLD);
            res.setStatus(ReservationStatus.HOLDING);
            res.setExpireDate(LocalDate.now().plusDays(2));
        } else {
            res.setType(ReservationType.QUEUE);
            res.setStatus(ReservationStatus.PENDING);
        }

        return reservationMapper.toResponse(reservationRepository.save(res));
    }

    // ================== INTERNAL ==================

    public Reservation findFirstActive(Long userId, Long bookId) {
        return reservationRepository.findByUserId(userId).stream()
                .filter(r -> r.getBook().getId().equals(bookId)
                        && (r.getStatus() == ReservationStatus.PENDING
                        || r.getStatus() == ReservationStatus.HOLDING))
                .findFirst().orElse(null);
    }
    public List<Reservation> findHoldingByUserId(Long userId) {
        return reservationRepository.findByUserIdAndStatus(userId, ReservationStatus.HOLDING);
    }

    public int calculateAvailable(Book book) {
        int borrowed = borrowRepository.countByBookIdAndReturnDateIsNull(book.getId());

        int holding = reservationRepository.countByBookIdAndTypeAndStatus(
                book.getId(),
                ReservationType.HOLD,
                ReservationStatus.HOLDING
        );

        return book.getQuantity() - borrowed - holding;
    }

    @Transactional
    public void processQueue(Book book) {

        int available = calculateAvailable(book);
        if (available <= 0) return;

        List<Reservation> pendingList =
                reservationRepository.findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationType.QUEUE,
                        ReservationStatus.PENDING
                );

        int canAssign = Math.min(available, pendingList.size());

        for (int i = 0; i < canAssign; i++) {
            Reservation r = pendingList.get(i);
            r.setType(ReservationType.HOLD);
            r.setStatus(ReservationStatus.HOLDING);
            r.setExpireDate(LocalDate.now().plusDays(2));

            reservationRepository.save(r);
        }
    }

    public Reservation save(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getHoldingListAsc(Long bookId) {
        return reservationRepository.findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                bookId,
                ReservationType.HOLD,
                ReservationStatus.HOLDING
        );
    }

    public List<ReservationResponse> getMyReservations(String email) {
        return reservationRepository.findByUserEmailOrderByReservationDateDesc(email)
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }
}