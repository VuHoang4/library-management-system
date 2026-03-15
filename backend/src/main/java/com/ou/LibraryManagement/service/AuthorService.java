package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.AuthorRequest;
import com.ou.LibraryManagement.dto.AuthorResponse;
import com.ou.LibraryManagement.model.Author;
import com.ou.LibraryManagement.repository.AuthorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public List<AuthorResponse> findAll() {
        return authorRepository.findAll()
                .stream()
                .map(AuthorResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<AuthorResponse> findById(Long id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));

        return ResponseEntity.ok(AuthorResponse.fromEntity(author));
    }

    public ResponseEntity<AuthorResponse> create(AuthorRequest request) {

        Author author = new Author();
        author.setName(request.name());
        author.setBio(request.bio());

        Author saved = authorRepository.save(author);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(AuthorResponse.fromEntity(saved));
    }

    public ResponseEntity<AuthorResponse> update(Long id, AuthorRequest request) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + id));

        author.setName(request.name());
        author.setBio(request.bio());

        Author updated = authorRepository.save(author);

        return ResponseEntity.ok(AuthorResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id) {

        if (!authorRepository.existsById(id))
            return false;

        authorRepository.deleteById(id);
        return true;
    }
}