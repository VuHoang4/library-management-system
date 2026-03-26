package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    // ================= QUERY =================
    public List<BookResponse> findAll(){
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    public BookResponse findById(Long id){
        return BookResponse.fromEntity(findEntityById(id));
    }

    public List<BookResponse> search(String keyword){
        return bookRepository
                .findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    // ================= COMMAND =================
    public BookResponse create(BookRequest request){
        Book book = mapToEntity(new Book(), request);
        return BookResponse.fromEntity(bookRepository.save(book));
    }

    public BookResponse update(Long id, BookRequest request){
        Book book = findEntityById(id);
        mapToEntity(book, request);
        return BookResponse.fromEntity(bookRepository.save(book));
    }
    public Book updateEntity(Long id, BookRequest request){
        Book book = findEntityById(id);

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setQuantity(request.quantity());

        return bookRepository.save(book);
    }

    public void deleteById(Long id){
        Book book = findEntityById(id);
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
        book.setQuantity(request.quantity());
        return book;
    }
}