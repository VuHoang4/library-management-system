package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.publisher.PublisherRequest;
import com.ou.LibraryManagement.dto.publisher.PublisherResponse;
import com.ou.LibraryManagement.entity.Publisher;
import com.ou.LibraryManagement.repository.PublisherRepository;
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

    public PublisherResponse findById(Long id){
        Publisher publisher = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));

        return PublisherResponse.fromEntity(publisher);
    }

    public PublisherResponse create(PublisherRequest request){
        Publisher publisher = new Publisher();
        publisher.setName(request.name());

        Publisher saved = repository.save(publisher);

        return PublisherResponse.fromEntity(saved);
    }

    public PublisherResponse update(Long id, PublisherRequest request){
        Publisher publisher = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));

        publisher.setName(request.name());

        Publisher updated = repository.save(publisher);

        return PublisherResponse.fromEntity(updated);
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Publisher not found with id: " + id);
        }
        repository.deleteById(id);
    }
}