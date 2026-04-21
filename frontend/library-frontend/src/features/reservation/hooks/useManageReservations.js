import { useState, useEffect, useCallback } from "react";
import { reservationApi } from "../services/reservationApi";
import { useToast } from "../../toast/useToast";

export function useManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 Thêm State để quản lý Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null, // Hàm sẽ được chạy khi người dùng bấm "Đồng ý"
  });

  const toast = useToast();

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await reservationApi.getAllReservations();
      setReservations(res.data?.content || res.data?.data || res.data || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách đặt/giữ sách:", error);
      toast.error("Không thể tải dữ liệu yêu cầu.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Hàm đóng Modal
  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Hàm thực thi gọi API (Chỉ chạy khi đã bấm Xác nhận trên Modal)
  const executeAction = async (actionFn, id, successMessage) => {
    try {
      await actionFn(id);
      toast.success(successMessage);
      fetchReservations();
    } catch (error) {
      console.error("Lỗi thao tác:", error);
      toast.error(error.response?.data?.message || "Thao tác thất bại.");
    } finally {
      closeConfirmModal(); // Chạy xong thì đóng Modal
    }
  };

  // 🌟 Các hàm này giờ không gọi API ngay, mà chỉ MỞ MODAL và truyền config
  const handleConfirmPickup = (req) => {
    console.log("Yêu cầu được chọn để xác nhận pickup:", req);
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận Giao sách",
      message: `Xác nhận độc giả ${req.userName} đã đến lấy sách?`,
      onConfirm: () =>
        executeAction(
          // 🌟 Gửi userId và bookId lấy từ dòng Reservation hiện tại
          () =>
            reservationApi.confirmPickup({
              userId: req.userId,
              bookId: req.bookId,
            }),
          req.id,
          "Đã giao sách và tạo phiếu mượn!",
        ),
    });
  };

  const handleCancelHold = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Hủy giữ sách",
      message:
        "Bạn có chắc chắn muốn hủy đơn giữ sách này? Sách sẽ được nhường cho người tiếp theo hoặc trả về kho.",
      onConfirm: () =>
        executeAction(
          reservationApi.cancelHold,
          id,
          "Đã hủy giữ sách ngoại lệ.",
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
          reservationApi.cancelPreOrder,
          id,
          "Đã hủy xếp hàng chờ sách.",
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
    // 🌟 Trả Modal config ra ngoài để Component dùng
    confirmConfig,
    closeConfirmModal,
  };
}
