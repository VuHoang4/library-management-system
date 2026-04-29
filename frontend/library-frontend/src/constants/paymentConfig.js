import { Wallet, Landmark } from "lucide-react";
import { paymentApi } from "../features/payment/services/paymentApi";

export const PAYMENT_GATEWAYS = [
  {
    id: "MOMO",
    name: "Ví MoMo",
    colorLabel: "text-[#A50064]",
    borderColor: "border-[#A50064]",
    bgActive: "bg-[#A50064]/10",
    icon: Wallet, 
    apiHandler: paymentApi.payWithMoMo,
  },
  {
    id: "VNPAY",
    name: "VNPay",
    colorLabel: "text-[#005BAA]",
    borderColor: "border-[#005BAA]",
    bgActive: "bg-[#005BAA]/10",
    icon: Landmark, 
    apiHandler: paymentApi.payWithVNPay,
  }
];