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
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository repository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public ReservationService(
            ReservationRepository repository,
            BookRepository bookRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

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

    //  CREATE RESERVATION
    @Transactional
    public ReservationResponse create(ReservationRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new NotFoundException("Book not found"));

        if(book.getAvailableQuantity() > 0){
            throw new BadRequestException("Book is available, no need to reserve");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        Reservation reservation = new Reservation();

        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDate.now());
        reservation.setExpireDate(LocalDate.now().plusDays(2)); //  QUAN TRỌNG
        reservation.setStatus(ReservationStatus.PENDING);

        Reservation saved = repository.save(reservation);

        return ReservationResponse.fromEntity(saved);
    }

    //  READY (khi sách available)
    public ReservationResponse markReady(Long id){

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        reservation.setStatus(ReservationStatus.READY);
        reservation.setExpireDate(LocalDate.now().plusDays(2));

        repository.save(reservation);

        return ReservationResponse.fromEntity(reservation);
    }

    //  COMPLETE (user nhận sách)
    public ReservationResponse complete(Long id){

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        reservation.setStatus(ReservationStatus.COMPLETED);

        repository.save(reservation);

        return ReservationResponse.fromEntity(reservation);
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new NotFoundException("Reservation not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public void processQueue(Book book){

        int available = book.getAvailableQuantity();

        List<Reservation> ready = repository
                .findByBookIdAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationStatus.READY
                );

        List<Reservation> pending = repository
                .findByBookIdAndStatusOrderByReservationDateAsc(
                        book.getId(),
                        ReservationStatus.PENDING
                );

        int currentReady = ready.size();
        int canAssign = available - currentReady;

        for(int i = 0; i < Math.min(canAssign, pending.size()); i++){
            Reservation r = pending.get(i);

            r.setStatus(ReservationStatus.READY);
            r.setExpireDate(LocalDate.now().plusDays(2));

            repository.save(r);
        }
    }
}