package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.Fine;
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

    public List<FineResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(FineResponse::fromEntity)
                .toList();
    }

    public FineResponse findById(Long id){
        Fine fine = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found with id: " + id));

        return FineResponse.fromEntity(fine);
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new NotFoundException("Fine not found with id: " + id);
        }
        repository.deleteById(id);
    }
}