import api from "../../../services/api";

export const borrowApi = {
  getMyBorrowedBooks: () => {
    return api.get("/borrows/me");
  },

  renewBook: (borrowId) => {
    return api.put(`/borrows/${borrowId}/renew`);
  },

  getBorrows: (params) => {
    return api.get("/borrows", { params });
  },

  receiveReturn: (id) => {
    return api.put(`/borrows/${id}/return`);
  }
};