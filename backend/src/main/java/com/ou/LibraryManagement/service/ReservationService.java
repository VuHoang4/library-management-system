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
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ReservationService {

    private static final int HOLD_DAYS = 2;

    private final ReservationRepository repository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRepository borrowRecordRepository;

    public ReservationService(
            ReservationRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            BorrowRepository borrowRecordRepository
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    // ================= QUERY =================
    public List<ReservationResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(ReservationResponse::fromEntity)
                .toList();
    }

    public List<ReservationResponse> getByUser(Long userId){
        return repository.findByUserId(userId)
                .stream()
                .map(ReservationResponse::fromEntity)
                .toList();
    }

    // ================= CREATE =================
    public ReservationResponse create(ReservationRequest request){

        Book book = findBook(request.bookId());
        User user = findUser(request.userId());

        //  CHECK DUPLICATE (đặt ở đây)
        boolean existed = repository.existsByUserIdAndBookIdAndStatusIn(
                request.userId(),
                request.bookId(),
                List.of(
                        ReservationStatus.PENDING,
                        ReservationStatus.HOLDING
                )
        );

        if(existed){
            throw new BadRequestException("Bạn đã đặt sách này rồi");
        }

        // clear expired HOLDING
        expireHolding(book);
        int available = calculateAvailable(book);

        Reservation reservation = new Reservation();
        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDate.now());

        //  HOLDING (còn sách)
        if(available > 0){
            reservation.setType(ReservationType.HOLD);
            reservation.setStatus(ReservationStatus.HOLDING);
            reservation.setExpireDate(LocalDate.now().plusDays(HOLD_DAYS));
        }
        //  QUEUE (hết sách)
        else{
            reservation.setType(ReservationType.QUEUE);
            reservation.setStatus(ReservationStatus.PENDING);
            reservation.setExpireDate(null);
        }

        return ReservationResponse.fromEntity(repository.save(reservation));
    }

    // ================= PROCESS QUEUE =================
    public void processQueue(Book book){

        // 1. clear expired HOLDING
        expireHolding(book);

        int available = calculateAvailable(book);
        if(available <= 0) return;

        List<Reservation> pendingList = repository
                .findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationType.QUEUE,
                        ReservationStatus.PENDING
                );

        int canAssign = available;

        for(int i = 0; i < Math.min(canAssign, pendingList.size()); i++){
            Reservation r = pendingList.get(i);

            r.setType(ReservationType.HOLD);
            r.setStatus(ReservationStatus.HOLDING);
            r.setExpireDate(LocalDate.now().plusDays(HOLD_DAYS));

            repository.save(r);
        }

    }

    // ================= EXPIRE =================
    public void expireHolding(Book book){

        List<Reservation> holdingList = repository
                .findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationType.HOLD,
                        ReservationStatus.HOLDING
                );

        for(Reservation r : holdingList){
            if(r.getExpireDate() != null &&
                    r.getExpireDate().isBefore(LocalDate.now())){

                r.setStatus(ReservationStatus.EXPIRED);
                repository.save(r);
            }
        }
    }

    // ================= COMPLETE =================
    public void completeReservation(Long userId, Long bookId){

        List<Reservation> holdingList = repository
                .findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        bookId,
                        ReservationType.HOLD,
                        ReservationStatus.HOLDING
                );

        if(holdingList.isEmpty()) return;

        Reservation first = holdingList.get(0);

        if(first.getExpireDate() != null &&
                first.getExpireDate().isBefore(LocalDate.now())){
            throw new BadRequestException("Reservation expired");
        }

        if(!first.getUser().getId().equals(userId)){
            throw new BadRequestException("Book is reserved for another user");
        }

        first.setStatus(ReservationStatus.COMPLETED);
        repository.save(first);
    }

    // ================= AVAILABLE =================
    public int calculateAvailable(Book book){
        int borrowed = borrowRecordRepository
                .countByBookIdAndReturnDateIsNull(book.getId());

        int holding = repository
                .findByBookIdAndTypeAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationType.HOLD,
                        ReservationStatus.HOLDING
                ).size();

        return book.getQuantity() - borrowed - holding;
    }

    // ================= HELPER =================
    private Book findBook(Long id){
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book not found"));
    }

    private User findUser(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
    public List<Book> getBooksNeedProcess(){
        return repository.findBooksWithActiveReservations();
    }
}