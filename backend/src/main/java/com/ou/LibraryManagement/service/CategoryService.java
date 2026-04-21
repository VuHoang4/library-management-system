package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.category.CategoryRequest;
import com.ou.LibraryManagement.dto.category.CategoryResponse;
import com.ou.LibraryManagement.entity.Category;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.CategoryMapper;
import com.ou.LibraryManagement.repository.BookRepository;
import com.ou.LibraryManagement.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           BookRepository bookRepository,
                           CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.categoryMapper = categoryMapper;
    }

    // ================== READ ==================

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAllByIsActiveTrue()
                .stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse getById(Long id) {
        return categoryMapper.toResponse(findEntityById(id));
    }

    // ================== INTERNAL ==================

    public Category findEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy thể loại với id: " + id));
    }

    private boolean isNameExisted(String name) {
        return categoryRepository.existsByNameAndIsActiveTrue(name);
    }

    // ================== ADMIN ==================

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        if (isNameExisted(request.name())) {
            throw new BadRequestException("Thể loại đã tồn tại!");
        }

        Category category = categoryMapper.toEntity(request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findEntityById(id);

        if (isNameExisted(request.name())
                && !category.getName().equals(request.name())) {
            throw new BadRequestException("Tên thể loại bị trùng!");
        }

        categoryMapper.updateEntityFromRequest(request, category);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = findEntityById(id);

        if (bookRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Không thể xóa vì đang có sách!");
        }

        category.setActive(false);
        categoryRepository.save(category);
    }
}