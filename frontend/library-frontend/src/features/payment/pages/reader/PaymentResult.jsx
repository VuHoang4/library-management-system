import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui"; // Import Button

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status"); 
  const orderId = searchParams.get("orderId"); 
  const amount = searchParams.get("amount"); 

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-slate-200 text-center animate-in zoom-in-95 duration-500">
        
        {/* Icon Trạng thái */}
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 
          ${isSuccess ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
        >
          {isSuccess ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h2>
        <p className="text-slate-500 mb-6">
          {isSuccess 
            ? "Cảm ơn bạn đã thanh toán. Khoản nợ của bạn đã được gạch." 
            : "Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán."}
        </p>

        {orderId && (
          <div className="bg-slate-50 rounded-xl p-4 text-left mb-8 border border-slate-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Mã giao dịch:</span>
              <span className="font-semibold text-slate-800">#{orderId}</span>
            </div>
            {amount && (
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Số tiền:</span>
                 <span className="font-semibold text-rose-600">{parseInt(amount).toLocaleString()} đ</span>
               </div>
            )}
          </div>
        )}

        {/* Dùng Button Component */}
        <Button onClick={() => navigate("/")} className="w-full py-3 text-base">
          Quay lại trang chủ
        </Button>
      </div>
    </div>
  );
}

export default PaymentResult;