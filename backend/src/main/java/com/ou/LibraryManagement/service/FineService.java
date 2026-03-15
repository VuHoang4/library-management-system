package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.FineRequest;
import com.ou.LibraryManagement.dto.FineResponse;
import com.ou.LibraryManagement.model.Fine;
import com.ou.LibraryManagement.repository.FineRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FineService {

    private final FineRepository repository;

    public FineService(FineRepository repository) {
        this.repository = repository;
    }

    public List<FineResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<FineResponse> findById(Long id){

        Fine fine = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        return ResponseEntity.ok(FineResponse.fromEntity(fine));
    }

    public ResponseEntity<FineResponse> create(FineRequest request){

        Fine fine = new Fine();

        fine.setAmount(request.amount());
        fine.setStatus("UNPAID");

        Fine saved = repository.save(fine);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(FineResponse.fromEntity(saved));
    }

    public ResponseEntity<FineResponse> payFine(Long id){

        Fine fine = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        fine.setStatus("PAID");
        fine.setPaidAt(LocalDateTime.now());

        Fine updated = repository.save(fine);

        return ResponseEntity.ok(FineResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id){

        if(!repository.existsById(id))
            return false;

        repository.deleteById(id);
        return true;
    }
}