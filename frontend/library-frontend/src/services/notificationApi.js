import api from "./api"; // Đảm bảo api đã config baseURL là '/api'

export const getNotifications = () => {
  return api.get("/notifications/me"); 
};

export const markAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return api.put("/notifications/read-all");
};

export const notificationApi = {
  create: (data) => api.post("/notifications", data)
};