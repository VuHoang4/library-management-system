import { useState, useCallback } from "react";
import { getMyPayments } from "../services/paymentApi";
// ĐẢM BẢO đường dẫn import getMyFines này chính xác trong dự án của bạn
import { getMyFines } from "../services/fineApi";

export function usePayment() {
  const [allFines, setAllFines] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Gọi song song 2 API lấy Phí phạt và Lịch sử thanh toán
      const [finesRes, paymentsRes] = await Promise.all([
        getMyFines(),
        getMyPayments(),
      ]);

      const allFinesData = finesRes.data || [];
      
      setAllFines(allFinesData);
      setUnpaidFines(allFinesData.filter((f) => f.status === "UNPAID"));
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu tài chính:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    allFines,
    unpaidFines,
    payments,
    isLoading,
    fetchPaymentData,
  };
}