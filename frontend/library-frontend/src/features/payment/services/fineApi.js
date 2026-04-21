import api from "../../../services/api";


// Lấy danh sách phiếu phạt của TÔI
export const getMyFines = () => {
  return api.get("/fines/me");
};