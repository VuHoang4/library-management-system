import React, { useState } from "react";
import { PAYMENT_GATEWAYS } from "../../../../constants/paymentConfig";
import { useToast } from "../../../toast/useToast";
// Import Vũ khí
import { Empty } from "../../../../components/common"; 
import { Button } from "../../../../components/ui";

function PaymentSummary({ unpaidFines }) {
  const [selectingMethodFor, setSelectingMethodFor] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState(PAYMENT_GATEWAYS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const toast = useToast();
  const totalDebt = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

  const handleConfirmPayment = async (fineId) => {
    try {
      setIsProcessing(true);
      const gatewayConfig = PAYMENT_GATEWAYS.find((g) => g.id === selectedGateway);
      
      if (!gatewayConfig || !gatewayConfig.apiHandler) throw new Error("Phương thức thanh toán không hợp lệ!");

      const response = await gatewayConfig.apiHandler(fineId);
      const paymentUrl = response.data;

      if (paymentUrl && paymentUrl.startsWith("http")) {
        toast.success("Khởi tạo thành công! Đang chuyển hướng...");
        setTimeout(() => { window.location.href = paymentUrl; }, 1000);
      } else {
        toast.error("Không nhận được URL thanh toán hợp lệ từ server.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error(error.response?.data?.message || "Lỗi server! Không thể kết nối đến cổng thanh toán.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      
      {/* 🔝 HERO BANNER */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Tổng quan nợ</h2>
          <span className="text-sm text-slate-500 block">Tổng tiền cần thanh toán hiện tại</span>
        </div>
        <div className="flex flex-col md:items-end relative z-10">
           <span className="text-4xl md:text-5xl font-extrabold text-rose-600 tracking-tight">
             {totalDebt.toLocaleString()} đ
           </span>
           {totalDebt > 0 && (
              <p className="mt-2 text-sm text-slate-500 max-w-sm text-left md:text-right">
                Thanh toán để tiếp tục sử dụng dịch vụ mượn sách.
              </p>
           )}
        </div>
      </div>

      {/* ⬇️ DANH SÁCH PHIẾU PHẠT */}
      <div className="w-full space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Khoản phạt chờ thanh toán</h3>
        
        {unpaidFines.length === 0 ? (
          // SỬ DỤNG EMPTY STATE
          <Empty title="Tuyệt vời!" message="Bạn không có khoản nợ nào cần thanh toán." icon="🎉" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            {unpaidFines.map((fine) => (
              <div key={fine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all h-full">
                
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-sm">Mã phiếu: #{fine.id}</span>
                    <span className="text-rose-600 font-bold">{fine.amount.toLocaleString()} đ</span>
                  </div>
                  <h4 className="text-base font-medium text-slate-800 line-clamp-2">{fine.reason || "Trễ hạn trả sách"}</h4>
                  <p className="text-xs text-slate-400 mt-2">Ghi nhận: {fine.createdAt ? new Date(fine.createdAt).toLocaleDateString("vi-VN") : "---"}</p>
                </div>

                <div className="flex flex-col pt-4 border-t border-slate-100 mt-auto min-h-[60px] justify-center">
                  
                  {selectingMethodFor !== fine.id && (
                    <Button onClick={() => setSelectingMethodFor(fine.id)} className="w-full">
                      Thanh toán khoản này
                    </Button>
                  )}

                  {selectingMethodFor === fine.id && (
                    <div className="flex flex-col gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                      <p className="text-sm font-medium text-slate-600">Chọn phương thức thanh toán:</p>
                      
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {PAYMENT_GATEWAYS.map((gateway) => {
                          const isSelected = selectedGateway === gateway.id;
                          return (
                            <button
                              key={gateway.id}
                              onClick={() => setSelectedGateway(gateway.id)}
                              disabled={isProcessing}
                              className={`flex items-center gap-2 p-3 border rounded-xl transition-all text-sm font-semibold
                                ${isSelected 
                                  ? `${gateway.borderColor} ${gateway.bgActive} ${gateway.colorLabel} ring-1 ring-current` 
                                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <span className="text-lg">{gateway.icon}</span>
                              {gateway.name}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button variant="secondary" onClick={() => setSelectingMethodFor(null)} disabled={isProcessing}>
                          Hủy
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => handleConfirmPayment(fine.id)} 
                          isLoading={isProcessing} 
                          className="flex-1"
                        >
                          Xác nhận & Thanh toán
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentSummary;