import api from "./api"; // Đảm bảo api đã config baseURL là '/api'


export const categoryApi = {
  // Lấy toàn bộ danh sách thể loại
  getCategories: () => {
    return api.get("/categories"); 
  },
  
  // Sau này bạn có thể thêm các hàm khác ở đây:
  // createCategory: (data) => api.post("/categories", data),
  // deleteCategory: (id) => api.delete(`/categories/${id}`),
};