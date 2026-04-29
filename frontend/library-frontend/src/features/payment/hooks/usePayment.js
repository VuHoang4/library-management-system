import { useState, useCallback } from "react";
import { paymentApi } from "../services/paymentApi";
import { fineApi} from "../services/fineApi";
import { useToast } from "../../toast/useToast";

export function usePayment() {
  const [allFines, setAllFines] = useState([]);
  const [unpaidFines, setUnpaidFines] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const toast = useToast();

  const fetchPaymentData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [finesRes, paymentsRes] = await Promise.all([
        fineApi.getMyFines(),
        paymentApi.getMyPayments(),
      ]);

      const allFinesData = finesRes.data || [];
      
      setAllFines(allFinesData);
      setUnpaidFines(allFinesData.filter((f) => f.status === "UNPAID"));
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu tài chính.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    allFines,
    unpaidFines,
    payments,
    isLoading,
    fetchPaymentData,
  };
}