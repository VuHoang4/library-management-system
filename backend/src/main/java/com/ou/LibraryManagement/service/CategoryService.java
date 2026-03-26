package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.category.CategoryRequest;
import com.ou.LibraryManagement.dto.category.CategoryResponse;
import com.ou.LibraryManagement.entity.Category;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.CategoryRepository;
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

    public CategoryResponse findById(Long id){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        return CategoryResponse.fromEntity(category);
    }

    public CategoryResponse create(CategoryRequest request){
        Category category = new Category();

        category.setName(request.name());
        category.setDescription(request.description());

        Category saved = categoryRepository.save(category);

        return CategoryResponse.fromEntity(saved);
    }

    public CategoryResponse update(Long id, CategoryRequest request){
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        category.setName(request.name());
        category.setDescription(request.description());

        Category updated = categoryRepository.save(category);

        return CategoryResponse.fromEntity(updated);
    }

    public void deleteById(Long id){
        if(!categoryRepository.existsById(id)){
            throw new NotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}