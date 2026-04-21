import api from "../../../services/api";


// Lấy lịch sử giao dịch của TÔI
export const getMyPayments = () => {
  return api.get("/payments/me");
};

// Gọi API tạo thanh toán MoMo
export const payWithMoMo = (fineId) => {
  // Backend expects POST /api/payments/momo?fineId=...
  return api.post(`/payments/momo?fineId=${fineId}`);
};

// Gọi API tạo thanh toán VNPay
export const payWithVNPay = (fineId) => {
  // Backend expects GET /api/payments/vnpay?fineId=...
  return api.get(`/payments/vnpay?fineId=${fineId}`);
};