import api from "./api"; // Đảm bảo api đã config baseURL là '/api'

export const getNotifications = () => {
  // 1. SỬA: Thêm /me để chỉ lấy thông báo của User đang đăng nhập
  return api.get("/notifications/me"); 
};

export const markAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return api.put("/notifications/read-all");
};