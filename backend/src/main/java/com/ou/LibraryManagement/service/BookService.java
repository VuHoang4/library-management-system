package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookDetailResponse;
import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.BookMapper;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.BorrowRepository;
import com.ou.LibraryManagement.service.event.BookStockIncreasedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final AuthorService authorService;
    private final CategoryService categoryService;
    private final PublisherService publisherService;
    private final ReservationService reservationService;
    private final BookMapper bookMapper;
    private final ApplicationEventPublisher publisher;

    public BookService(BookRepository bookRepository, BorrowRepository borrowRepository,
                       AuthorService authorService,
                       CategoryService categoryService,
                       PublisherService publisherService,
                       ReservationService reservationService,
                       BookMapper bookMapper,
                       ApplicationEventPublisher publisher) {
        this.bookRepository = bookRepository;
        this.borrowRepository = borrowRepository;
        this.authorService = authorService;
        this.categoryService = categoryService;
        this.publisherService = publisherService;
        this.reservationService = reservationService;
        this.bookMapper = bookMapper;
        this.publisher = publisher;
    }

    // ================== READ ==================

    public List<BookResponse> getAll(String search, Long categoryId, Long userId, String role) {

        List<Book> books;

        if (search != null && !search.isBlank()) {
            books = bookRepository.searchAll(search);
        } else {
            books = bookRepository.findAllByIsActiveTrue();
        }

        if (categoryId != null) {
            books = books.stream()
                    .filter(b -> b.getCategory().getId().equals(categoryId))
                    .toList();
        }

        // 🔥 ADMIN / LIBRARIAN
        if ("ADMIN".equals(role) || "LIBRARIAN".equals(role)) {
            return books.stream()
                    .map(book -> {
                        int available = reservationService.calculateAvailable(book);
                        return bookMapper.toResponseBasic(book, available);
                    })
                    .toList();
        }

        // 🔥 READER
        return books.stream()
                .map(book -> mapToResponseReader(book, userId))
                .toList();
    }

    public List<Book> search(String keyword) {
        return bookRepository.searchAll(keyword);
    }


    public BookDetailResponse getDetail(Long id) {
        Book book = findEntityById(id);
        int available = reservationService.calculateAvailable(book);

        return bookMapper.toDetailResponse(book,available);
    }

    // ================== ADMIN ==================

    @Transactional
    public BookResponse create(BookRequest request) {
        if (bookRepository.existsByIsbn(request.isbn())) {
            throw new BadRequestException("ISBN đã tồn tại!");
        }

        Book book = new Book();
        updateRelations(book, request);
        mapBasicFields(book, request);

        Book saved = bookRepository.save(book);
        return bookMapper.toResponseBasic(saved, saved.getQuantity());
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = findEntityById(id);

        if (bookRepository.existsByIsbnAndIdNot(request.isbn(), id)) {
            throw new BadRequestException("ISBN bị trùng!");
        }

        updateRelations(book, request);
        mapBasicFields(book, request);

        Book saved = bookRepository.save(book);

        publisher.publishEvent(new BookStockIncreasedEvent(book));

        int available = reservationService.calculateAvailable(saved);
        return bookMapper.toResponseBasic(saved, available);
    }

    @Transactional
    public void delete(Long id) {
        Book book = findEntityById(id);
        book.setActive(false);
        bookRepository.save(book);
    }

    // ================== INTERNAL ==================

    public Book findEntityById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách"));
    }

    private void updateRelations(Book book, BookRequest request) {
        book.setAuthor(authorService.findEntityById(request.authorId()));
        book.setCategory(categoryService.findEntityById(request.categoryId()));
        book.setPublisher(publisherService.findEntityById(request.publisherId()));
    }

    private void mapBasicFields(Book book, BookRequest request) {
        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setImageUrl(request.imageUrl());
        book.setDescription(request.description());
        book.setPublishedYear(request.publishedYear());
        book.setQuantity(request.quantity());
    }

    private BookResponse mapToResponse(Book book, Long userId) {
        int available = reservationService.calculateAvailable(book);

        String resStatus = null;
        String borrowStatus = null;

        if (userId != null) {
            Reservation res = reservationService.findFirstActive(userId, book.getId());
            resStatus = (res != null) ? res.getStatus().name() : null;

            Borrow borrow = borrowRepository.findFirstByUserIdAndBookIdOrderByIdDesc(userId, book.getId());
            if (borrow != null && borrow.getStatus() == BorrowStatus.BORROWED) {
                borrowStatus = borrow.getStatus().name();
            }
        }

        return bookMapper.toResponseReader(book, available, resStatus, borrowStatus);
    }

    private BookResponse mapToResponseReader(Book book, Long userId) {

        int available = reservationService.calculateAvailable(book);

        String resStatus = null;
        String borrowStatus = null;

        if (userId != null) {
            Reservation res = reservationService.findFirstActive(userId, book.getId());
            resStatus = (res != null) ? res.getStatus().name() : null;

            Borrow borrow = borrowRepository
                    .findFirstByUserIdAndBookIdOrderByIdDesc(userId, book.getId());

            if (borrow != null && borrow.getStatus() == BorrowStatus.BORROWED) {
                borrowStatus = borrow.getStatus().name();
            }
        }

        return bookMapper.toResponseReader(book, available, resStatus, borrowStatus);
    }
}