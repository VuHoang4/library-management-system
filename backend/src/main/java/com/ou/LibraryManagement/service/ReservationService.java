package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.ReservationRequest;
import com.ou.LibraryManagement.dto.ReservationResponse;
import com.ou.LibraryManagement.model.Book;
import com.ou.LibraryManagement.model.Reservation;
import com.ou.LibraryManagement.model.User;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
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

    // Create Reservation
    public ResponseEntity<ReservationResponse> create(ReservationRequest request){

        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if(book.getAvailableQuantity() > 0){
            throw new RuntimeException("Book still available, no need to reserve");
        }

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = new Reservation();

        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDate.now());
        reservation.setStatus("PENDING");

        Reservation saved = repository.save(reservation);

        return ResponseEntity.ok(ReservationResponse.fromEntity(saved));
    }

    // Approve reservation
    public ResponseEntity<ReservationResponse> approve(Long id){

        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus("APPROVED");

        repository.save(reservation);

        return ResponseEntity.ok(ReservationResponse.fromEntity(reservation));
    }

    public boolean deleteById(Long id){

        if(!repository.existsById(id))
            return false;

        repository.deleteById(id);
        return true;
    }

}