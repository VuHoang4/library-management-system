import api from "../../../services/api"; // Giữ nguyên đường dẫn import của bạn

export const bookApi = {
  // 1. Lấy danh sách sách (Hỗ trợ truyền nhiều params: userId, search, category...)
  getBooks: (params) => {
    return api.get("/books", { params });
  },

  // 2. Lấy chi tiết 1 cuốn sách (Để show lên form khi bấm nút Sửa)
  getBookById: (id) => {
    return api.get(`/books/${id}`);
  },

  // 3. Thêm sách mới
  createBook: (data) => {
    return api.post("/books", data);
  },

  // 4. Cập nhật thông tin sách
  updateBook: (id, data) => {
    return api.put(`/books/${id}`, data);
  },

  // 5. Xóa sách
  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};