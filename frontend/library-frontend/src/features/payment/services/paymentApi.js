import api from "../../../services/api";

export const paymentApi = {
  getMyPayments: () => {
    return api.get("/payments/me");
  },

  payWithMoMo: (fineId) => {
    return api.post(`/payments/momo?fineId=${fineId}`);
  },

  payWithVNPay: (fineId) => {
    return api.get(`/payments/vnpay?fineId=${fineId}`);
  },

  getPayments: (params) => {
    return api.get("/payments", { params });
  },

  getUnpaidFines: () => {
    return api.get("/fines/unpaid");
  },

  payFineCash: (fineId) => {
    return api.put(`/payments/fines/${fineId}/pay-cash`);
  },

  getPaymentDetail: (id) => {
    return api.get(`/payments/${id}`);
  }
};