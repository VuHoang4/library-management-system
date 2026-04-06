package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.entity.Reservation;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.BookMapper;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRepository borrowRecordRepository;
    private final ReservationRepository reservationRepository;
    private final BookMapper bookMapper;
    private final ReservationService reservationService;

    public BookService(BookRepository bookRepository,
                       BorrowRepository borrowRecordRepository,
                       ReservationRepository reservationRepository, BookMapper bookMapper, ReservationService reservationService) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.reservationRepository = reservationRepository;
        this.bookMapper = bookMapper;
        this.reservationService = reservationService;
    }

    // ================= QUERY =================

    public List<BookResponse> findAll(){
        return bookRepository.findAll()
                .stream()
                .map(book -> bookMapper.toResponse(
                        book,
                        reservationService.calculateAvailable(book),
                        null
                ))
                .toList();
    }

    public BookResponse findById(Long id){
        Book book = findEntityById(id);
        return bookMapper.toResponse(
                book,
                reservationService.calculateAvailable(book),
                null
        );
    }

    public List<BookResponse> search(String keyword){
        return bookRepository
                .findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(book -> bookMapper.toResponse(
                        book,
                        reservationService.calculateAvailable(book),null
                ))
                .toList();
    }

    public List<BookResponse> getAllBooks(Long userId){

        //  STEP 1: lấy reservation của user → map theo bookId
        Map<Long, Reservation> reservationMap =
                (userId == null)
                        ? new HashMap<>()
                        : reservationRepository
                        .findByUserId(userId)
                        .stream()
                        .filter(r -> r.getBook() != null)
                        .collect(Collectors.toMap(
                                r -> r.getBook().getId(),
                                r -> r,
                                (r1, r2) -> {
                                    if (r1.getStatus() == ReservationStatus.HOLDING) return r1;
                                    if (r2.getStatus() == ReservationStatus.HOLDING) return r2;
                                    return r1;
                                }
                        ));

        //  STEP 2: map book → response
        return bookRepository.findAll().stream()
                .map(book -> {

                    int available = reservationService.calculateAvailable(book);

                    Reservation r = reservationMap.get(book.getId());
                    String status = mapUserStatus(r);

                    return bookMapper.toResponse(
                            book,
                            available,
                            status
                    );
                })
                .toList();
    }
    private String mapUserStatus(Reservation r){

        if (r == null) return null;

        if (r.getStatus() == ReservationStatus.HOLDING) {
            if (r.getExpireDate() != null &&
                    r.getExpireDate().isBefore(LocalDate.now())) {
                return "EXPIRED";
            }
            return "HOLDING";
        }

        if (r.getStatus() == ReservationStatus.PENDING) {
            return "PENDING";
        }

        return null;
    }

    // ================= COMMAND =================

    @Transactional
    public BookResponse create(BookRequest request){

        validateRequest(request);

        if(request.isbn() != null && bookRepository.existsByIsbn(request.isbn())){
            throw new BadRequestException("ISBN already exists");
        }

        Book book = mapToEntity(new Book(), request);

        Book saved = bookRepository.save(book);

        return bookMapper.toResponse(
                saved,
                reservationService.calculateAvailable(saved),null
        );
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request){

        validateRequest(request);

        Book book = findEntityById(id);

        if(request.isbn() != null
                && bookRepository.existsByIsbn(request.isbn())
                && !request.isbn().equals(book.getIsbn())){
            throw new BadRequestException("ISBN already exists");
        }

        int borrowed = borrowRecordRepository
                .countByBookIdAndReturnDateIsNull(id);

        int holding = reservationRepository
                .countByBookIdAndTypeAndStatus(
                        id,
                        com.ou.LibraryManagement.entity.enums.ReservationType.HOLD,
                        com.ou.LibraryManagement.entity.enums.ReservationStatus.HOLDING
                );

        if(request.quantity() < borrowed + holding){
            throw new BadRequestException(
                    "Quantity cannot be less than borrowed + holding"
            );
        }

        mapToEntity(book, request);

        Book updated = bookRepository.save(book);

        return bookMapper.toResponse(
                updated,
                reservationService.calculateAvailable(updated),null
        );
    }

    @Transactional
    public void deleteById(Long id){

        Book book = findEntityById(id);

        boolean hasBorrow = borrowRecordRepository
                .existsByBookIdAndReturnDateIsNull(id);

        if(hasBorrow){
            throw new BadRequestException("Cannot delete book being borrowed");
        }

        boolean hasHolding = reservationRepository
                .existsByBookIdAndTypeAndStatus(
                        id,
                        com.ou.LibraryManagement.entity.enums.ReservationType.HOLD,
                        com.ou.LibraryManagement.entity.enums.ReservationStatus.HOLDING
                );

        if(hasHolding){
            throw new BadRequestException("Cannot delete book with active holding");
        }

        bookRepository.delete(book);
    }

    // ================= HELPER =================

    public Book findEntityById(Long id){
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book not found"));
    }

    private Book mapToEntity(Book book, BookRequest request){
        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setImageUrl(request.imageUrl());
        book.setQuantity(request.quantity());
        return book;
    }

    private void validateRequest(BookRequest request){

        if(request.title() == null || request.title().isBlank()){
            throw new BadRequestException("Title is required");
        }

        if(request.quantity() < 0){
            throw new BadRequestException("Quantity must be >= 0");
        }
    }
}