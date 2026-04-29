import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home, ReceiptText } from "lucide-react";
import { Button } from "../../../../components/ui";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status"); 
  const orderId = searchParams.get("orderId"); 
  const amount = searchParams.get("amount"); 

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      
      {/* Lớp nền mờ trang trí (Blobs) */}
      <div className={`absolute top-0 left-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-20 ${
        isSuccess ? "bg-emerald-400" : "bg-rose-400"
      }`}></div>

      <div className="bg-white max-w-md w-full p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center animate-in zoom-in-95 fade-in duration-500 relative z-10">
        
        {/* Icon Trạng thái */}
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm border-8 ${
          isSuccess 
            ? "bg-emerald-100 text-emerald-600 border-emerald-50" 
            : "bg-rose-100 text-rose-600 border-rose-50"
        }`}>
          {isSuccess ? (
            <CheckCircle size={40} strokeWidth={2.5} />
          ) : (
            <XCircle size={40} strokeWidth={2.5} />
          )}
        </div>

        <h2 className={`text-2xl md:text-3xl font-black tracking-tight mb-2 ${
          isSuccess ? "text-slate-800" : "text-rose-600"
        }`}>
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h2>
        
        <p className="text-slate-500 mb-8 font-medium">
          {isSuccess 
            ? "Tuyệt vời! Khoản nợ thư viện của bạn đã được thanh toán và cập nhật trên hệ thống." 
            : "Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau."}
        </p>

        {/* Thông tin hóa đơn */}
        {orderId && (
          <div className="bg-slate-50 rounded-2xl p-5 text-left mb-8 border border-slate-100 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <ReceiptText size={64} />
            </div>
            
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-slate-200/60 pb-3">
                <span className="text-slate-500 font-medium">Mã giao dịch:</span>
                <span className="font-bold text-slate-800">#{orderId}</span>
              </div>
              
              {amount && (
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-slate-500 font-medium">Số tiền:</span>
                  <span className="font-black text-lg text-slate-800">
                    {parseInt(amount).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <Button 
          onClick={() => navigate("/")} 
          className="w-full py-3.5 text-base shadow-sm gap-2"
          variant={isSuccess ? "primary" : "secondary"}
        >
          <Home size={18} strokeWidth={2.5} />
          Về lại Trang chủ
        </Button>
      </div>
    </div>
  );
}

export default PaymentResult;