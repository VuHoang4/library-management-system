package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.role.RoleResponse;
import com.ou.LibraryManagement.service.RoleService;
import com.ou.LibraryManagement.mapper.RoleMapper; // 1. Thêm Import Mapper
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;
    private final RoleMapper roleMapper; // 2. Inject Mapper vào đây

    public RoleController(RoleService roleService, RoleMapper roleMapper){
        this.roleService = roleService;
        this.roleMapper = roleMapper;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAll(){
        List<RoleResponse> responses = roleService.findAllEntities()
                .stream()
                .map(roleMapper::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }
}