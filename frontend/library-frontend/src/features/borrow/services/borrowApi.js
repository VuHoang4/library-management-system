import api from "../../../services/api";

export const borrowApi = {
  // 1. Lấy danh sách sách đang mượn của chính user đang đăng nhập
  getMyBorrowedBooks: () => {
    return api.get("/borrows/me");
  },

  // 2. Gia hạn sách
  renewBook: (borrowId) => {
    return api.put(`/borrows/${borrowId}/renew`);
  },

  // --- Nếu sau này bạn có trang Quản lý của Admin, cứ nhét thêm vào đây ---
  
  getBorrows: (params) => {
    return api.get("/borrows", { params });
  },
  // approveBorrow: (id) => {
  //   return api.put(`/admin/borrows/${id}/approve`);
  // }
  receiveReturn: (id) => {
    return api.put(`/borrows/${id}/return`);
  }
  
  
};