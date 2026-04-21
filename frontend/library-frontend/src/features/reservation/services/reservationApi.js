import api from "../../../services/api";

export const reservationApi = {
  // 1. Tạo yêu cầu đặt trước / mượn sách mới
  createReservation: (data) => {
    return api.post("/reservations", data);
  },

  // 2. Lấy danh sách yêu cầu của CHÍNH ĐỘC GIẢ ĐANG ĐĂNG NHẬP
  getMyReservations: () => {
    return api.get("/reservations/me");
  },

  // 3. Lấy TẤT CẢ danh sách yêu cầu (Dành cho Thủ thư / Admin)
  // Có truyền thêm params để hỗ trợ tính năng lọc (filter) hoặc phân trang (pagination)
  getAllReservations: (params) => {
    return api.get("/reservations", { params });
    // Lưu ý: Nếu Backend của bạn không có tiền tố /admin, hãy sửa lại thành "/reservations"
  },

  //   // 4. Các API thao tác của Thủ thư (Nếu bạn gom chung vào đây)
  confirmPickup: (payload) => {
    // payload = { userId, bookId }
    // Gọi trực tiếp đến Controller chứa hàm @PostMapping borrowBook
    return api.post("/borrows", payload);
  },

  cancelHold: (id) => {
    return api.put(`/reservations/${id}/cancel-hold`);
  },

  cancelPreOrder: (id) => {
    return api.put(`/reservations/${id}/cancel-preorder`);
  },
};
