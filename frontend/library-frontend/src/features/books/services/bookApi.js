import api from "../../../services/api";

export const bookApi = {
  getBooks: (params) => {
    return api.get("/books", { params });
  },

  getBookById: (id) => {
    return api.get(`/books/${id}`);
  },

  createBook: (data) => {
    return api.post("/books", data);
  },

  updateBook: (id, data) => {
    return api.put(`/books/${id}`, data);
  },

  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};