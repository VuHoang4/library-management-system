package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.user.ChangePasswordRequest;
import com.ou.LibraryManagement.dto.user.ProfileUpdateRequest;
import com.ou.LibraryManagement.dto.user.UserRequest;
import com.ou.LibraryManagement.dto.user.UserResponse;
import com.ou.LibraryManagement.entity.Role;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.UserMapper; // Sử dụng Mapper
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleService roleService,
                       UserMapper userMapper,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== READ ==================

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse getById(Long id) {
        return userMapper.toResponse(findEntityById(id));
    }

    public Optional<User> findEntityByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ================== INTERNAL ==================

    public User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy user với ID: " + id));
    }

    private boolean isEmailExisted(String email) {
        return userRepository.existsByEmail(email);
    }

    private boolean isEmailExistedExcludeId(String email, Long id) {
        return userRepository.existsByEmailAndIdNot(email, id);
    }

    // ================== ADMIN ==================

    @Transactional
    public UserResponse createUser(UserRequest request) {

        if (isEmailExisted(request.email())) {
            throw new BadRequestException("Email đã tồn tại!");
        }

        Role role = roleService.findEntityById(request.roleId());

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(role);

        return userMapper.toResponse(userRepository.save(user));
    }
    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {

        User user = findEntityByEmail(email)
                .orElseThrow(() -> new NotFoundException("User không tồn tại"));

        user.setName(request.fullName());
        user.setPhone(request.phone());

        return userMapper.toResponse(userRepository.save(user));
    }
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {

        User user = findEntityByEmail(email)
                .orElseThrow(() -> new NotFoundException("User không tồn tại"));

        // check mật khẩu cũ
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }

        // set mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {

        User user = findEntityById(id);

        if (isEmailExistedExcludeId(request.email(), id)) {
            throw new BadRequestException("Email bị trùng!");
        }

        Role role = roleService.findEntityById(request.roleId());

        userMapper.updateEntityFromRequest(request, user);

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        user.setRole(role);

        return userMapper.toResponse(userRepository.save(user));
    }

    public List<UserResponse> search(String keyword, String role) {

        List<User> users;

        if (keyword == null || keyword.isBlank()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.search(keyword);
        }

        if (role != null) {
            users = users.stream()
                    .filter(u -> u.getRole().getName().equalsIgnoreCase(role))
                    .toList();
        }

        return users.stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse toggleActive(Long id) {
        User user = findEntityById(id);

        user.setActive(!user.isActive());

        return userMapper.toResponse(userRepository.save(user));
    }

    public List<UserResponse> searchReaders(String keyword) {
        return userRepository.searchReaders(keyword)
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }
}