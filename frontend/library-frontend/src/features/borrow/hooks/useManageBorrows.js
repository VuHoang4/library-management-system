import { useState, useEffect, useCallback } from "react";
import { borrowApi } from "../services/borrowApi";
import { useToast } from "../../toast/useToast";

export function useManageBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const toast = useToast();

  const fetchBorrows = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await borrowApi.getBorrows();
      setBorrows(res.data?.content || res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu phiếu mượn.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleReceiveReturn = async (id) => {
    try {
      await borrowApi.receiveReturn(id);
      toast.success("Đã thu hồi sách thành công!");
      fetchBorrows();
    } catch (error) {
      console.error(error);
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