import api from "./api"; // Giữ nguyên đường dẫn import của bạn

export const authorApi = {
  // Dành cho mọi người (Lấy danh sách để đổ vào Dropdown)
  getAuthors: (params) => {
    return api.get("/authors", { params });
  },

  getAuthorById: (id) => {
    return api.get(`/authors/${id}`);
  },

  // Dành cho Admin/Thủ thư (Cần có Token JWT)
  createAuthor: (data) => {
    return api.post("/authors", data);
  },

  updateAuthor: (id, data) => {
    return api.put(`/authors/${id}`, data);
  },

  deleteAuthor: (id) => {
    return api.delete(`/authors/${id}`);
  }
};