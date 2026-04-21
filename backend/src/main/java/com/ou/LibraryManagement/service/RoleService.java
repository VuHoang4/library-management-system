package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.entity.Role;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Trả về danh sách Entity
    public List<Role> findAllEntities() {
        return roleRepository.findAll();
    }

    // Tìm theo ID
    public Role findEntityById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy quyền với ID: " + id));
    }

    // Tìm theo tên (Dùng cho logic đăng ký/phân quyền)
    public Role findEntityByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy quyền: " + name));
    }
}