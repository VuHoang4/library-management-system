package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.*;
import com.ou.LibraryManagement.entity.enums.BorrowStatus;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.entity.enums.ReservationStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.BorrowMapper; // Inject Mapper
import com.ou.LibraryManagement.mapper.FineMapper;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.service.event.BookReturnedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FineService {

    private final FineRepository repository;
    private final FineMapper fineMapper;

    public FineService(FineRepository repository, FineMapper fineMapper) {
        this.repository = repository;
        this.fineMapper = fineMapper;
    }

    // ================== LIBRARIAN ==================

    public List<FineResponse> getAllFines() {
        return repository.findAll()
                .stream()
                .map(fineMapper::toResponse)
                .toList();
    }

    public FineResponse getFineDetail(Long id) {
        return fineMapper.toResponse(findEntityById(id));
    }

    public List<FineResponse> getUnpaidFinesByUser(Long userId) {
        return repository.findByUserIdAndStatus(userId, FineStatus.UNPAID)
                .stream()
                .map(fineMapper::toResponse)
                .toList();
    }

    // ================== READER ==================

    public List<FineResponse> getMyAllFines(String email) {
        return repository.findByUserEmail(email)
                .stream()
                .map(fineMapper::toResponse)
                .toList();
    }

    public List<FineResponse> getMyUnpaidFines(String email) {
        return repository.findByUserEmailAndStatus(email, FineStatus.UNPAID)
                .stream()
                .map(fineMapper::toResponse)
                .toList();
    }

    // ================== INTERNAL ==================

    public Fine findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy phiếu phạt với id: " + id));
    }

    public boolean hasUnpaidFine(Long userId) {
        return repository.existsByUserIdAndStatus(userId, FineStatus.UNPAID);
    }

    public boolean existsByBorrowId(Long borrowId) {
        return repository.existsByBorrowId(borrowId);
    }

    public Optional<Fine> findByBorrowId(Long borrowId) {
        return repository.findByBorrowId(borrowId);
    }

    public Double getTotalUnpaidAmount(Long userId) {
        return repository.sumUnpaidAmountByUserId(userId);
    }

    public Fine save(Fine fine) {
        return repository.save(fine);
    }
}