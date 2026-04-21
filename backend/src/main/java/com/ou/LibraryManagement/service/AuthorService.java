package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.entity.Author;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.AuthorMapper;
import com.ou.LibraryManagement.repository.AuthorRepository;
import com.ou.LibraryManagement.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;
    private final BookRepository bookRepository;

    public AuthorService(AuthorRepository authorRepository,
                         AuthorMapper authorMapper,
                         BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.authorMapper = authorMapper;
        this.bookRepository = bookRepository;
    }

    // ================== READ ==================

    public List<AuthorResponse> getAll() {
        return authorRepository.findAllByIsActiveTrue()
                .stream()
                .map(authorMapper::toResponse)
                .toList();
    }

    public AuthorResponse getById(Long id) {
        return authorMapper.toResponse(findEntityById(id));
    }

    // ================== INTERNAL ==================

    public Author findEntityById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy tác giả với ID: " + id));
    }

    private boolean isNameExisted(String name) {
        return authorRepository.existsByNameAndIsActiveTrue(name);
    }

    // ================== ADMIN ==================

    @Transactional
    public AuthorResponse create(AuthorRequest request) {
        if (isNameExisted(request.name())) {
            throw new BadRequestException("Tác giả này đã tồn tại!");
        }

        Author author = authorMapper.toEntity(request);
        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Transactional
    public AuthorResponse update(Long id, AuthorRequest request) {
        Author author = findEntityById(id);

        if (isNameExisted(request.name())
                && !author.getName().equals(request.name())) {
            throw new BadRequestException("Tên tác giả mới đã bị trùng!");
        }

        authorMapper.updateEntityFromRequest(request, author);
        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Transactional
    public void delete(Long id) {
        Author author = findEntityById(id);

        if (bookRepository.existsByAuthorId(id)) {
            throw new BadRequestException("Không thể xóa tác giả đang có sách!");
        }

        author.setActive(false);
        authorRepository.save(author);
    }
}