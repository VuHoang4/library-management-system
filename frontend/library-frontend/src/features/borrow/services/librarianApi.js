import api from "../../../services/api";

export const librarianApi = {
  // ================= SEARCH =================
  searchReader: (keyword) =>
    api.get("/librarian/readers/search", { params: { keyword } }),

  searchBook: (keyword) =>
    api.get("/librarian/books/search", { params: { keyword } }),

  // ================= BORROW =================
  checkout: (data) =>
    api.post("/librarian/checkout", data),

  returnBook: (id) =>
    api.put(`/librarian/borrows/${id}/return`),

  // ================= HOLDING =================
  giveHolding: (data) =>
    api.post("/librarian/holding/complete", data),

  // ================= PAYMENT =================
  payFineCash: (fineId) =>
    api.put(`/payments/fines/${fineId}/pay-cash`), 

  // ================= DASHBOARD =================
  getDashboardSummary: () =>
    api.get("/librarian/dashboard/summary"),

  getRecentBorrows: () =>
    api.get("/librarian/dashboard/recent-borrows"),
};