import { useState, useEffect, useCallback } from "react";
import { bookApi } from "../services/bookApi";
import { categoryApi } from "../../../services/categoryApi";
import { useToast } from "../../../hooks/useToast";

export function useManageBooks() {
  const [books, setBooks] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  // 🌟 State quản lý Modal Thêm/Sửa Sách
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null = Thêm mới, có object = Sửa

  const toast = useToast();

  // 1. Hàm lấy danh sách sách từ API
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
      
      // Đọc dữ liệu từ 'content' (vì Backend trả về dạng Page)
      const dataList = res.data?.content || res.data?.data || res.data || [];
      
      setBooks(dataList);
      
    } catch (error) {
      console.error("Lỗi fetch sách:", error);
      toast.error("Không thể tải danh sách sách từ máy chủ.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, category, toast]);

  // 2. Hàm lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategoriesList(res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy thể loại:", error);
    }
  }, []);

  // 3. Gọi lấy thể loại 1 lần duy nhất khi vào trang
  useEffect(() => {
    fetchCategories(); 
  }, [fetchCategories]);

  // 4. Gọi sách khi search/category thay đổi (DEBOUNCE 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchBooks]); 

  // 5. Hàm Xóa sách (Đã gỡ bỏ window.confirm vì đã dùng ConfirmModal ở UI)
  const handleDeleteBook = async (id) => {
    try {
      await bookApi.deleteBook(id);
      toast.success("Đã xóa sách thành công!");
      
      // Xóa xong thì gọi lại hàm fetchBooks để bảng tự động cập nhật dữ liệu mới
      fetchBooks(); 
    } catch (error) {
      console.error("Lỗi xóa sách:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi xóa sách.");
    }
  };

  // ==========================================
  // CÁC HÀM XỬ LÝ MODAL THÊM / SỬA SÁCH
  // ==========================================

  // 6. Mở Modal Thêm Sách
  const handleOpenAdd = () => {
    setEditingBook(null); // Đặt data về null để làm trắng form
    setIsModalOpen(true);
  };

  // 7. Mở Modal Sửa Sách
  const handleOpenEdit = async (book) => {
    try {
      // Phải gọi API lấy BookDetailResponse vì Grid chỉ có BookSummaryResponse
      const res = await bookApi.getBookById(book.id); 
      setEditingBook(res.data?.data || res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết sách:", error);
      toast.error("Không thể tải thông tin chi tiết của sách.");
    }
  };

  // 8. Lưu Sách (Xử lý chung cho Thêm mới và Cập nhật)
  const handleSaveBook = async (formData) => {
    try {
      if (editingBook) {
        // Đã có data -> Cập nhật
        await bookApi.updateBook(editingBook.id, formData);
        toast.success("Cập nhật sách thành công!");
      } else {
        // Chưa có data -> Thêm mới
        await bookApi.createBook(formData);
        toast.success("Thêm sách mới thành công!");
      }
      
      setIsModalOpen(false); // Thành công thì đóng Modal
      fetchBooks(); // Load lại bảng luôn cho nóng
    } catch (error) {
      console.error("Lỗi lưu sách:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi lưu sách.");
      throw error; // Ném lỗi ra để Modal bên ngoài biết (không tự động đóng)
    }
  };

  // 9. Trả về toàn bộ "Vũ khí" cho UI
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
    
    // 🌟 Trả ra các vũ khí mới cho giao diện
    isModalOpen, 
    setIsModalOpen,
    editingBook,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveBook
  };
}