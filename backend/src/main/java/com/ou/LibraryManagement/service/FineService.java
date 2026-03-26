package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.FineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FineService {

    private final FineRepository repository;

    public FineService(FineRepository repository) {
        this.repository = repository;
    }

    // ================= QUERY =================
    public List<FineResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public FineResponse findById(Long id){
        return FineResponse.fromEntity(findEntityById(id));
    }

    public List<FineResponse> getByUser(Long userId){
        return repository.findByUserId(userId)
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public List<FineResponse> getUnpaidByUser(Long userId){
        return repository.findByUserIdAndStatus(userId, com.ou.LibraryManagement.entity.enums.FineStatus.UNPAID)
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    // ================= HELPER =================
    public Fine findEntityById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + id));
    }

    public boolean hasUnpaidFine(Long userId){
        return repository.existsByUserIdAndStatus(userId, FineStatus.UNPAID);
    }
}