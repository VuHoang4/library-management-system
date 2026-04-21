// src/constants/paymentConfig.js
import { payWithMoMo, payWithVNPay } from "../features/payment/services/paymentApi";

export const PAYMENT_GATEWAYS = [
  {
    id: "MOMO",
    name: "Ví MoMo",
    colorLabel: "text-[#A50064]",
    borderColor: "border-[#A50064]",
    bgActive: "bg-[#A50064]/10",
    icon: "👛", // Hoặc dùng URL ảnh logo thật
    apiHandler: payWithMoMo, // Gắn trực tiếp hàm gọi API vào đây
  },
  {
    id: "VNPAY",
    name: "VNPay",
    colorLabel: "text-[#005BAA]",
    borderColor: "border-[#005BAA]",
    bgActive: "bg-[#005BAA]/10",
    icon: "🏦", // Hoặc dùng URL ảnh logo thật
    apiHandler: payWithVNPay,
  },
  // Tương lai muốn thêm ZaloPay? Chỉ việc thêm 1 object vào đây, KHÔNG cần chạm vào code UI!
  // {
  //   id: "ZALOPAY",
  //   name: "ZaloPay",
  //   ...
  //   apiHandler: payWithZaloPay
  // }
];