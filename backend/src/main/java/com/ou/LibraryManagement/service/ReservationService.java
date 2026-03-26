package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.reservation.ReservationRequest;
import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.BorrowRecordRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    private static final int RESERVATION_EXPIRE_DAYS = 2;

    private final ReservationRepository repository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public ReservationService(
            ReservationRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository,
            BorrowRecordRepository borrowRecordRepository
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
    @Transactional
    public ReservationResponse create(ReservationRequest request){

        Book book = findBook(request.bookId());
        User user = findUser(request.userId());

        validateCanReserve(book);

        Reservation reservation = new Reservation();
        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDate.now());
        reservation.setExpireDate(LocalDate.now().plusDays(RESERVATION_EXPIRE_DAYS));
        reservation.setStatus(ReservationStatus.PENDING);

        return ReservationResponse.fromEntity(repository.save(reservation));
    }

    // ================= STATUS =================
    public ReservationResponse markReady(Long id){
        Reservation reservation = findReservation(id);

        reservation.setStatus(ReservationStatus.READY);
        reservation.setExpireDate(LocalDate.now().plusDays(RESERVATION_EXPIRE_DAYS));

        return ReservationResponse.fromEntity(repository.save(reservation));
    }

    public ReservationResponse complete(Long id){
        Reservation reservation = findReservation(id);

        reservation.setStatus(ReservationStatus.COMPLETED);

        return ReservationResponse.fromEntity(repository.save(reservation));
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new NotFoundException("Reservation not found");
        }
        repository.deleteById(id);
    }

    // ================= QUEUE =================
    public void processQueue(Book book){

        int available = calculateAvailable(book);

        if (available <= 0) return;

        List<Reservation> readyList = getReservations(book, ReservationStatus.READY);
        List<Reservation> pendingList = getReservations(book, ReservationStatus.PENDING);

        int canAssign = available - readyList.size();

        assignReadyReservations(pendingList, canAssign);
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

    private Reservation findReservation(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));
    }

    private void validateCanReserve(Book book){
        if(calculateAvailable(book) > 0){
            throw new BadRequestException("Book is available, no need to reserve");
        }
    }

    private int calculateAvailable(Book book) {
        int borrowed = borrowRecordRepository
                .countByBookIdAndReturnDateIsNull(book.getId());

        return book.getQuantity() - borrowed;
    }

    private List<Reservation> getReservations(Book book, ReservationStatus status){
        return repository.findByBookIdAndStatusOrderByReservationDateAsc(
                book.getId(), status
        );
    }

    private void assignReadyReservations(List<Reservation> pendingList, int canAssign){
        for(int i = 0; i < Math.min(canAssign, pendingList.size()); i++){
            Reservation r = pendingList.get(i);

            r.setStatus(ReservationStatus.READY);
            r.setExpireDate(LocalDate.now().plusDays(RESERVATION_EXPIRE_DAYS));

            repository.save(r);
        }
    }
}