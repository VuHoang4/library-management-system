package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.entity.Author;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.AuthorRepository;
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

    public AuthorResponse findById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author not found with id: " + id));

        return AuthorResponse.fromEntity(author);
    }

    public AuthorResponse create(AuthorRequest request) {
        Author author = new Author();
        author.setName(request.name());
        author.setBio(request.bio());

        Author saved = authorRepository.save(author);

        return AuthorResponse.fromEntity(saved);
    }

    public AuthorResponse update(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author not found with id: " + id));

        author.setName(request.name());
        author.setBio(request.bio());

        Author updated = authorRepository.save(author);

        return AuthorResponse.fromEntity(updated);
    }

    public void deleteById(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new NotFoundException("Author not found with id: " + id);
        }
        authorRepository.deleteById(id);
    }
}