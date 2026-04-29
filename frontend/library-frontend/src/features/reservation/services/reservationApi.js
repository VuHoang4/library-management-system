import api from "../../../services/api";

export const reservationApi = {
  createReservation: (data) => {
    return api.post("/reservations", data);
  },

  getMyReservations: () => {
    return api.get("/reservations/me");
  },

  getAllReservations: (params) => {
    return api.get("/reservations", { params });
  },

  confirmPickup: (payload) => {
    return api.post("/borrows", payload);
  },

  cancelHold: (id) => {
    return api.put(`/reservations/${id}/cancel-hold`);
  },

  cancelPreOrder: (id) => {
    return api.put(`/reservations/${id}/cancel-preorder`);
  },
};