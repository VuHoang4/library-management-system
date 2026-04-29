import React, { useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PAYMENT_GATEWAYS } from "../../../../constants/paymentConfig";
import { useToast } from "../../../toast/useToast";
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
          <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <CreditCard size={24} className="text-rose-500" />
            Tổng quan nợ
          </h2>
          <span className="text-sm font-medium text-slate-500 block ml-8">
            Tổng tiền cần thanh toán hiện tại
          </span>
        </div>
        <div className="flex flex-col md:items-end relative z-10 w-full md:w-auto mt-4 md:mt-0">
           <span className="text-4xl md:text-5xl font-extrabold text-rose-600 tracking-tight text-left md:text-right">
             {totalDebt.toLocaleString("vi-VN")} đ
           </span>
           {totalDebt > 0 && (
             <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm text-left md:text-right bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
               Vui lòng thanh toán để tiếp tục sử dụng dịch vụ mượn sách.
             </p>
           )}
        </div>
      </div>

      {/* ⬇️ DANH SÁCH PHIẾU PHẠT */}
      <div className="w-full space-y-5">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Khoản phạt chờ thanh toán
        </h3>
        
        {unpaidFines.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm">
            <Empty 
              title="Tuyệt vời!" 
              message="Bạn không có khoản nợ nào cần thanh toán." 
              icon={<ShieldCheck size={48} strokeWidth={1.5} className="text-emerald-500" />} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            {unpaidFines.map((fine) => (
              <div key={fine.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md hover:border-blue-100 transition-all duration-300 h-full">
                
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg text-sm border border-slate-200/60">
                      Mã phiếu: #{fine.id}
                    </span>
                    <span className="text-xl text-rose-600 font-black tracking-tight shrink-0">
                      {fine.amount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug">
                    {fine.reason || "Trễ hạn trả sách"}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-2">
                    Ghi nhận: {fine.createdAt ? new Date(fine.createdAt).toLocaleDateString("vi-VN") : "---"}
                  </p>
                </div>

                <div className="flex flex-col pt-5 border-t border-slate-100 mt-auto min-h-[60px] justify-center">
                  
                  {selectingMethodFor !== fine.id && (
                    <Button 
                      variant="primary" 
                      onClick={() => setSelectingMethodFor(fine.id)} 
                      className="w-full font-bold shadow-sm"
                    >
                      Thanh toán khoản này
                    </Button>
                  )}

                  {selectingMethodFor === fine.id && (
                    <div className="flex flex-col gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                      <p className="text-sm font-bold text-slate-700">Chọn phương thức thanh toán:</p>
                      
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {PAYMENT_GATEWAYS.map((gateway) => {
                          const isSelected = selectedGateway === gateway.id;
                          
                          // 🌟 ĐÃ FIX LỖI OBJECTS ARE NOT VALID AS A REACT CHILD
                          const Icon = gateway.icon;

                          return (
                            <button
                              key={gateway.id}
                              onClick={() => setSelectedGateway(gateway.id)}
                              disabled={isProcessing}
                              className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl transition-all font-bold border-2
                                ${isSelected 
                                  ? `${gateway.borderColor} ${gateway.bgActive} ${gateway.colorLabel} shadow-sm` 
                                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <span className="text-2xl drop-shadow-sm flex items-center justify-center">
                                {/* Xử lý linh hoạt: Nếu là thẻ JSX thì in ra, nếu là tham chiếu Component thì bọc vào thẻ */}
                                {React.isValidElement(Icon) ? Icon : <Icon />}
                              </span>
                              <span className="text-[13px] sm:text-sm text-center">{gateway.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 mt-3">
                        <Button 
                          variant="secondary" 
                          onClick={() => setSelectingMethodFor(null)} 
                          disabled={isProcessing}
                          className="w-1/3"
                        >
                          Hủy
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => handleConfirmPayment(fine.id)} 
                          isLoading={isProcessing} 
                          className="flex-1 shadow-sm font-bold"
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