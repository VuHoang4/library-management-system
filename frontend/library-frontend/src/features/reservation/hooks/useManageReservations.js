import { useState, useEffect, useCallback } from "react";
import { reservationApi } from "../services/reservationApi";
import { useToast } from "../../toast/useToast";

export function useManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null, 
  });

  const toast = useToast();

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reservationApi.getAllReservations();
      setReservations(res.data?.content || res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const executeAction = async (actionFn, successMessage) => {
    try {
      await actionFn();
      toast.success(successMessage);
      fetchReservations();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Thao tác thất bại.");
    } finally {
      closeConfirmModal();
    }
  };

  const handleConfirmPickup = (req) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận Giao sách",
      message: `Xác nhận độc giả ${req.userName} đã đến lấy sách?`,
      onConfirm: () =>
        executeAction(
          () => reservationApi.confirmPickup({
            userId: req.userId,
            bookId: req.bookId,
          }),
          "Đã giao sách và tạo phiếu mượn!"
        ),
    });
  };

  const handleCancelHold = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hủy giữ sách",
      message: "Bạn có chắc chắn muốn hủy đơn giữ sách này? Sách sẽ được nhường cho người tiếp theo hoặc trả về kho.",
      onConfirm: () =>
        executeAction(
          () => reservationApi.cancelHold(id),
          "Đã hủy giữ sách ngoại lệ."
        ),
    });
  };

  const handleCancelPreOrder = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hủy xếp hàng chờ",
      message: "Xác nhận hủy yêu cầu xếp hàng của độc giả này?",
      onConfirm: () =>
        executeAction(
          () => reservationApi.cancelPreOrder(id),
          "Đã hủy xếp hàng chờ sách."
        ),
    });
  };

  return {
    reservations,
    isLoading,
    handleConfirmPickup,
    handleCancelHold,
    handleCancelPreOrder,
    refreshData: fetchReservations,
    confirmConfig,
    closeConfirmModal,
  };
}