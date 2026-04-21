import { useState, useCallback } from "react";
import { bookApi } from "../services/bookApi";

// 1. BIẾN TOÀN CỤC (GLOBAL CACHE)
// Khai báo bên ngoài Hook để dữ liệu sống sót ngay cả khi Component bị hủy
let globalBooksCache = null;

export function useBooks() {
  // 2. Khởi tạo State: Có cache thì dùng luôn, không thì mảng rỗng
  const [books, setBooks] = useState(globalBooksCache || []);
  
  // 3. Có cache rồi thì KHÔNG bật loading lúc mới vào nữa
  const [isLoading, setIsLoading] = useState(!globalBooksCache); 
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async ()  => {
    // Chỉ bật vòng xoay loading nếu bộ nhớ đệm đang trống rỗng
    if (!globalBooksCache) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await bookApi.getBooks();
      
      // Lưu kết quả mới nhất vào bộ đệm để lần sau dùng
      globalBooksCache = res.data; 
      
      // Cập nhật lại State (React sẽ âm thầm thay đổi những số liệu nào bị khác mà không làm giật màn hình)
      setBooks(res.data); 
    } catch (err) {
      console.error("Lỗi lấy books:", err);
      setError("Không thể tải danh sách sách.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { books, isLoading, error, fetchBooks };
}