package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.CategoryRequest;
import com.ou.LibraryManagement.dto.CategoryResponse;
import com.ou.LibraryManagement.model.Category;
import com.ou.LibraryManagement.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> findAll(){
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<CategoryResponse> findById(Long id){

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return ResponseEntity.ok(CategoryResponse.fromEntity(category));
    }

    public ResponseEntity<CategoryResponse> create(CategoryRequest request){

        Category category = new Category();

        category.setName(request.name());
        category.setDescription(request.description());

        Category saved = categoryRepository.save(category);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CategoryResponse.fromEntity(saved));
    }

    public ResponseEntity<CategoryResponse> update(Long id, CategoryRequest request){

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.name());
        category.setDescription(request.description());

        Category updated = categoryRepository.save(category);

        return ResponseEntity.ok(CategoryResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id){

        if(!categoryRepository.existsById(id))
            return false;

        categoryRepository.deleteById(id);
        return true;
    }
}