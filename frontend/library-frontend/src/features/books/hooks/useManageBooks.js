import { useState, useEffect, useCallback } from "react";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../../../services/categoryApi";
import { useToast } from "../../../hooks/useToast";

export function useManageBooks() {
  const [books, setBooks] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const toast = useToast();

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      
      if (searchTerm.trim() !== "") {
        params.search = searchTerm;
      }
      
      if (category !== "all") {
        params.categoryId = category; 
      }

      const res = await bookApi.getBooks(params);
      const dataList = res.data?.content || res.data?.data || res.data || [];
      
      setBooks(dataList);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách sách từ máy chủ.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, category, toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getAll();
      setCategoriesList(res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCategories(); 
  }, [fetchCategories]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchBooks]); 

  const handleDeleteBook = async (id) => {
    try {
      await bookApi.deleteBook(id);
      toast.success("Đã xóa sách thành công!");
      fetchBooks(); 
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa sách.");
    }
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (book) => {
    try {
      const res = await bookApi.getBookById(book.id); 
      setEditingBook(res.data?.data || res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin chi tiết của sách.");
    }
  };

  const handleSaveBook = async (formData) => {
    try {
      if (editingBook) {
        await bookApi.updateBook(editingBook.id, formData);
        toast.success("Cập nhật sách thành công!");
      } else {
        await bookApi.createBook(formData);
        toast.success("Thêm sách mới thành công!");
      }
      
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu sách.");
      throw error;
    }
  };

  return {
    books,
    isLoading,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    categoriesList,
    handleDeleteBook,
    refreshBooks: fetchBooks,
    isModalOpen, 
    setIsModalOpen,
    editingBook,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveBook
  };
}