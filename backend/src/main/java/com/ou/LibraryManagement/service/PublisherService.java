package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.dto.publisher.PublisherRequest;
import com.ou.LibraryManagement.dto.publisher.PublisherResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.BorrowMapper; // Inject Mapper
import com.ou.LibraryManagement.mapper.FineMapper;
import com.ou.LibraryManagement.mapper.PublisherMapper;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.PublisherRepository;
import com.ou.LibraryManagement.service.event.BookReturnedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
@Service
public class PublisherService {

    private final PublisherRepository repository;
    private final BookRepository bookRepository;
    private final PublisherMapper publisherMapper;

    public PublisherService(PublisherRepository repository,
                            BookRepository bookRepository,
                            PublisherMapper publisherMapper) {
        this.repository = repository;
        this.bookRepository = bookRepository;
        this.publisherMapper = publisherMapper;
    }

    // ================== READ ==================

    public List<PublisherResponse> getAll() {
        return repository.findAllByIsActiveTrue()
                .stream()
                .map(publisherMapper::toResponse)
                .toList();
    }

    public PublisherResponse getById(Long id) {
        return publisherMapper.toResponse(findEntityById(id));
    }

    // ================== INTERNAL ==================

    public Publisher findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy nhà xuất bản với id: " + id));
    }

    private boolean existsByName(String name) {
        return repository.existsByNameAndIsActiveTrue(name);
    }

    // ================== ADMIN ==================

    @Transactional
    public PublisherResponse create(PublisherRequest request) {
        if (existsByName(request.name())) {
            throw new BadRequestException("Nhà xuất bản đã tồn tại!");
        }

        Publisher publisher = publisherMapper.toEntity(request);
        return publisherMapper.toResponse(repository.save(publisher));
    }

    @Transactional
    public PublisherResponse update(Long id, PublisherRequest request) {
        Publisher publisher = findEntityById(id);

        if (existsByName(request.name())
                && !publisher.getName().equals(request.name())) {
            throw new BadRequestException("Tên nhà xuất bản bị trùng!");
        }

        publisherMapper.updateEntityFromRequest(request, publisher);
        return publisherMapper.toResponse(repository.save(publisher));
    }

    @Transactional
    public void delete(Long id) {
        Publisher publisher = findEntityById(id);

        if (bookRepository.existsByPublisherId(id)) {
            throw new BadRequestException("Không thể xóa vì đang có sách!");
        }

        publisher.setActive(false);
        repository.save(publisher);
    }
}