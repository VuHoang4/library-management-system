import { useState, useEffect, useCallback } from "react";
import { borrowApi } from "../services/borrowApi";
import { useToast } from "../../toast/useToast";

export function useManageBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const toast = useToast();

  // 1. Hàm tải dữ liệu mượn thực tế
  const fetchBorrows = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await borrowApi.getBorrows();
      setBorrows(res.data?.content || res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách phiếu mượn:", error);
      toast.error("Không thể tải dữ liệu phiếu mượn.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // 2. Tự động gọi API khi mount
  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  // 3. Hàm xử lý nhận sách trả (Có thể BE sẽ tự tính phí phạt nếu overdue)
  const handleReceiveReturn = async (id) => {
    try {
      await borrowApi.receiveReturn(id);
      toast.success("Đã thu hồi sách thành công!");
      fetchBorrows();
    } catch (error) {
      console.error("Lỗi khi nhận trả sách:", error);
      toast.error(error.response?.data?.message || "Lỗi thu hồi sách.");
    }
  };

  return {
    borrows,
    isLoading,
    handleReceiveReturn,
    refreshData: fetchBorrows
  };
}