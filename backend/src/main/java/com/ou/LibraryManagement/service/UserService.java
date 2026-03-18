package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.user.UserRequest;
import com.ou.LibraryManagement.dto.user.UserResponse;
import com.ou.LibraryManagement.entity.Role;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.repository.RoleRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> findAll(){
        return repository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    public UserResponse findById(Long id){
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return UserResponse.fromEntity(user);
    }

    public UserResponse create(UserRequest request){

        if(repository.existsByEmail(request.email())){
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);

        User saved = repository.save(user);

        return UserResponse.fromEntity(saved);
    }

    public UserResponse update(Long id, UserRequest request){

        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if(repository.existsByEmail(request.email())
                && !user.getEmail().equals(request.email())){
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findById(request.roleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);

        User updated = repository.save(user);

        return UserResponse.fromEntity(updated);
    }

    public void deleteById(Long id){
        if(!repository.existsById(id)){
            throw new RuntimeException("User not found with id: " + id);
        }
        repository.deleteById(id);
    }
}