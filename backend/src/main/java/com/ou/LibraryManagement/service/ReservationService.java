package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.reservation.ReservationRequest;
import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;

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
    public ReservationResponse create(ReservationRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if(book.getAvailableQuantity() > 0){
            throw new RuntimeException("Book is available, no need to reserve");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

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
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.READY);
        reservation.setExpireDate(LocalDate.now().plusDays(2));

        repository.save(reservation);

        return ReservationResponse.fromEntity(reservation);
    }

    //  COMPLETE (user nhận sách)
    public ReservationResponse complete(Long id){

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(ReservationStatus.COMPLETED);

        repository.save(reservation);

        return ReservationResponse.fromEntity(reservation);
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Reservation not found with id: " + id);
        }
        repository.deleteById(id);
    }
}