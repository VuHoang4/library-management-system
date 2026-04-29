package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.book.BookDetailResponse;
import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.User;

import com.ou.LibraryManagement.service.BookService;
import com.ou.LibraryManagement.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    public BookController(BookService bookService,
                          UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            Principal principal) {

        Long userId = getUserId(principal);
        String role = getRole(principal);

        return ResponseEntity.ok(
                bookService.getAll(search, categoryId, userId, role)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDetailResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(
                bookService.getDetail(id)
        );
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @PostMapping
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.create(request));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody BookRequest request) {
        return ResponseEntity.ok(
                bookService.update(id, request)
        );
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Principal principal) {
        if (principal == null) return null;

        return userService.findEntityByEmail(principal.getName())
                .map(User::getId)
                .orElse(null);
    }

    private String getRole(Principal principal) {
        if (principal == null) return "GUEST";

        return userService.findEntityByEmail(principal.getName())
                .map(user -> user.getRole().getName())
                .orElse("GUEST");
    }
}