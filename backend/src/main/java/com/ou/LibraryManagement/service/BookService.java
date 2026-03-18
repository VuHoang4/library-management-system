package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.Book;
import com.ou.LibraryManagement.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    public List<BookResponse> findAll(){
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    public BookResponse findById(Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        return BookResponse.fromEntity(book);
    }

    public List<BookResponse> search(String keyword){
        return bookRepository
                .findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    public BookResponse create(BookRequest request){
        Book book = new Book();

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setQuantity(request.quantity());
        book.setAvailableQuantity(request.quantity()); // quan trọng

        Book saved = bookRepository.save(book);

        return BookResponse.fromEntity(saved);
    }

    public BookResponse update(Long id, BookRequest request){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        //   logic availableQuantity
        int borrowed = book.getQuantity() - book.getAvailableQuantity();

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setQuantity(request.quantity());

        // update lại availableQuantity
        book.setAvailableQuantity(Math.max(0, request.quantity() - borrowed));

        Book updated = bookRepository.save(book);

        return BookResponse.fromEntity(updated);
    }

    public void deleteById(Long id){
        if(!bookRepository.existsById(id)){
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }
}