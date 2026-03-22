package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.HotBook;
import com.ou.LibraryManagement.dto.Overdue;
import com.ou.LibraryManagement.repository.BorrowRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final BorrowRecordRepository repository;

    public ReportService(BorrowRecordRepository repository) {
        this.repository = repository;
    }

    public List<HotBook> getHotBooks(){
        return repository.getHotBooks();
    }

    public List<Overdue> getOverdueBooks(){
        return repository.getOverdueBooks();
    }
}