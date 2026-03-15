package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.PublisherRequest;
import com.ou.LibraryManagement.dto.PublisherResponse;
import com.ou.LibraryManagement.model.Publisher;
import com.ou.LibraryManagement.repository.PublisherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublisherService {

    private final PublisherRepository repository;

    public PublisherService(PublisherRepository repository) {
        this.repository = repository;
    }

    public List<PublisherResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(PublisherResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<PublisherResponse> findById(Long id){

        Publisher publisher = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        return ResponseEntity.ok(PublisherResponse.fromEntity(publisher));
    }

    public ResponseEntity<PublisherResponse> create(PublisherRequest request){

        Publisher publisher = new Publisher();
        publisher.setName(request.name());

        Publisher saved = repository.save(publisher);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(PublisherResponse.fromEntity(saved));
    }

    public ResponseEntity<PublisherResponse> update(Long id, PublisherRequest request){

        Publisher publisher = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        publisher.setName(request.name());

        Publisher updated = repository.save(publisher);

        return ResponseEntity.ok(PublisherResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id){

        if(!repository.existsById(id))
            return false;

        repository.deleteById(id);
        return true;
    }
}