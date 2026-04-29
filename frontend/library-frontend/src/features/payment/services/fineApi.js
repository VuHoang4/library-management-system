import api from "../../../services/api";

export const fineApi = {
  getMyFines: () => {
    return api.get("/fines/me");
  }
};