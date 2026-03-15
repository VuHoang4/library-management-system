package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.UserRequest;
import com.ou.LibraryManagement.dto.UserResponse;
import com.ou.LibraryManagement.model.User;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UserResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<UserResponse> findById(Long id){

        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    public ResponseEntity<UserResponse> create(UserRequest request){

        User user = new User();

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());

        User saved = repository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.fromEntity(saved));
    }

    public ResponseEntity<UserResponse> update(Long id, UserRequest request){

        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());

        User updated = repository.save(user);

        return ResponseEntity.ok(UserResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id){

        if(!repository.existsById(id))
            return false;

        repository.deleteById(id);
        return true;
    }
}