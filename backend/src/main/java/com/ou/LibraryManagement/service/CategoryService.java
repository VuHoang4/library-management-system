package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.category.CategoryRequest;
import com.ou.LibraryManagement.dto.category.CategoryResponse;
import com.ou.LibraryManagement.entity.Category;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
    }

    // ================= QUERY =================

    public List<CategoryResponse> findAll(){
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    public CategoryResponse findById(Long id){
        return CategoryResponse.fromEntity(findEntityById(id));
    }

    // ================= COMMAND =================

    @Transactional
    public CategoryResponse create(CategoryRequest request){

        validate(request);

        if(categoryRepository.existsByName(request.name())){
            throw new BadRequestException("Category already exists");
        }

        Category category = new Category();
        category.setName(request.name());
        category.setDescription(request.description());

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request){

        validate(request);

        Category category = findEntityById(id);

        if(categoryRepository.existsByName(request.name())
                && !category.getName().equals(request.name())){
            throw new BadRequestException("Category already exists");
        }

        category.setName(request.name());
        category.setDescription(request.description());

        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    public void deleteById(Long id){

        Category category = findEntityById(id);

        if(bookRepository.existsByCategoryId(id)){
            throw new BadRequestException("Cannot delete category with existing books");
        }

        categoryRepository.delete(category);
    }

    // ================= HELPER =================

    private Category findEntityById(Long id){
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));
    }

    private void validate(CategoryRequest request){
        if(request.name() == null || request.name().isBlank()){
            throw new BadRequestException("Category name is required");
        }
    }
}