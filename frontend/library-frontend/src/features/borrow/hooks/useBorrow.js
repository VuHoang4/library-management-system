import { useState, useCallback } from "react";
import { borrowApi} from "../services/borrowApi";
import { mapBorrowToCard } from "../../../utils/mapToBookCard";
import { useToast } from "../../toast/useToast";

export function useBorrow() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renewingId, setRenewingId] = useState(null);
  
  const toast = useToast();

  const fetchBorrowedBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await borrowApi.getMyBorrowedBooks();
      console.log("Dữ liệu sách mượn của tôi:", res.data);
      setBooks(res.data.map(mapBorrowToCard));
    } catch (err) {
      console.error("Lỗi lấy borrowed:", err);
      toast.error("Không thể tải danh sách sách mượn.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleRenew = useCallback(async (borrowId) => {
    try {
      setRenewingId(borrowId);
      await borrowApi.renewBook(borrowId);
      
      toast.success("Gia hạn sách thành công!");
      await fetchBorrowedBooks(); // Refresh lại data
    } catch (error) {
      console.error("Lỗi gia hạn:", error);
      const errorMessage = error.response?.data?.message || "Lỗi server! Không thể gia hạn.";
      toast.error(errorMessage);
    } finally {
      setRenewingId(null);
    }
  }, [fetchBorrowedBooks, toast]);

  return { books, isLoading, renewingId, fetchBorrowedBooks, handleRenew };
}