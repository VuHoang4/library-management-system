import api from "../../../services/api";

export const userApi = {
  // ================= CURRENT USER =================

  getMe: () => {
    return api.get("/users/me");
  },

  getDashboardSummary: () => {
    return api.get("/users/me/dashboard-summary");
  },

  getDueSoonBooks: () => {
    return api.get("/users/me/due-soon");
  },

  getOverdueBooks: () => {
    return api.get("/users/me/overdue");
  },

  updateProfile: (data) => {
    return api.put("/users/me", data); // ✅ fix thiếu "/"
  },

  changePassword: (data) => {
    return api.put("/users/me/password", data); // ✅ fix endpoint
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

  // ================= SEARCH =================

 getReaders: (keyword) => {
  return api.get("/users/readers", {
    params: { search: keyword }
  });
}
};