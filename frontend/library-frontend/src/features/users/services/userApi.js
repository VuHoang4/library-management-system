import api from "../../../services/api";

export const userApi = {
  // ================= CURRENT USER =================

  getMe: () => {
    return api.get("/users/me");
  },

  getDashboardSummary: () => {
    return api.get("/dashboard/me/summary");
  },

  getDueSoonBooks: () => {
    return api.get("/dashboard/me/due-soon");
  },

  getOverdueBooks: () => {
    return api.get("/dashboard/me/overdue");
  },

  updateProfile: (data) => {
    return api.put("/users/me", data);
  },

  changePassword: (data) => {
    return api.put("/users/me/password", data); 
  },

  // ================= ADMIN =================

  getAllUsers: () => {
    return api.get("/users");
  },

  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  createUser: (data) => {
    return api.post("/users", data);
  },

  updateUser: (id, data) => {
    return api.put(`/users/${id}`, data);
  },
  toggleActive: (id) => api.put(`/users/${id}/toggle-active`),

  // ================= SEARCH =================

getUsers: (params = {}) => {
  return api.get("/users", { params });
}
};