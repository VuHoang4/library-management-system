import api from "../../../services/api"; // Giữ nguyên đường dẫn import của bạn

export const librarianApi = {
  searchReader: (keyword) =>
    api.get("/librarian/readers/search", { params: { keyword } }),

  searchBook: (keyword) =>
    api.get("/librarian/books/search", { params: { keyword } }),

  checkout: (data) =>
    api.post("/librarian/checkout", data),

  returnBook: (id) =>
    api.put(`/librarian/borrows/${id}/return`),

  giveHolding: (data) =>
  api.post("/librarian/holding/complete", data),
};