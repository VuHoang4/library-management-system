package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.entity.Author;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.AuthorRepository;
import com.ou.LibraryManagement.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public AuthorService(AuthorRepository authorRepository,
                         BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    // ================= QUERY =================

    public List<AuthorResponse> findAll() {
        return authorRepository.findAll()
                .stream()
                .map(AuthorResponse::fromEntity)
                .toList();
    }

    public AuthorResponse findById(Long id) {
        return AuthorResponse.fromEntity(findEntityById(id));
    }

    // ================= COMMAND =================

    @Transactional
    public AuthorResponse create(AuthorRequest request) {

        validateRequest(request);

        if(authorRepository.existsByName(request.name())){
            throw new BadRequestException("Author already exists");
        }

        Author author = new Author();
        author.setName(request.name());
        author.setBio(request.bio());

        return AuthorResponse.fromEntity(authorRepository.save(author));
    }

    @Transactional
    public AuthorResponse update(Long id, AuthorRequest request) {

        validateRequest(request);

        Author author = findEntityById(id);

        // check duplicate (exclude itself)
        if(authorRepository.existsByName(request.name())
                && !author.getName().equals(request.name())){
            throw new BadRequestException("Author already exists");
        }

        author.setName(request.name());
        author.setBio(request.bio());

        return AuthorResponse.fromEntity(authorRepository.save(author));
    }

    @Transactional
    public void deleteById(Long id) {

        Author author = findEntityById(id);

        boolean hasBook = bookRepository.existsByAuthorId(id);

        if(hasBook){
            throw new BadRequestException("Cannot delete author with existing books");
        }

        authorRepository.delete(author);
    }

    // ================= HELPER =================

    private Author findEntityById(Long id){
        return authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author not found with id: " + id));
    }

    private void validateRequest(AuthorRequest request){

        if(request.name() == null || request.name().isBlank()){
            throw new BadRequestException("Author name is required");
        }
    }
}