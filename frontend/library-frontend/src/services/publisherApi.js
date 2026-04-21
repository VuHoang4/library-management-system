import api from "./api"; // Giữ nguyên đường dẫn import của bạn

export const publisherApi = {
  // Dành cho mọi người (Lấy danh sách để đổ vào Dropdown)
  getPublishers: (params) => {
    return api.get("/publishers", { params });
  },

  getPublisherById: (id) => {
    return api.get(`/publishers/${id}`);
  },

  // Dành cho Admin/Thủ thư (Cần có Token JWT)
  createPublisher: (data) => {
    return api.post("/publishers", data);
  },

  updatePublisher: (id, data) => {
    return api.put(`/publishers/${id}`, data);
  },

  deletePublisher: (id) => {
    return api.delete(`/publishers/${id}`);
  }
};