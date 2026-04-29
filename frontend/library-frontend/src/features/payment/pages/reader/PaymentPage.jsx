import { useState, useEffect } from "react";
import { CreditCard, Receipt, History } from "lucide-react";
import { usePayment } from "../../hooks/usePayment";
import PaymentSummary from "../../components/reader/PaymentSummary";
import PaymentHistory from "../../components/reader/PaymentHistory";
import FinesList from "../../components/reader/FinesList";
import { Loading } from "../../../../components/common"; 

function PaymentPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { allFines, unpaidFines, payments, isLoading, fetchPaymentData } = usePayment();

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const tabs = [
    { 
      id: "overview", 
      label: "Tổng quan nợ", 
      icon: <CreditCard size={18} strokeWidth={2} />,
      count: unpaidFines.length 
    },
    { 
      id: "fines", 
      label: "Danh sách phiếu phạt", 
      icon: <Receipt size={18} strokeWidth={2} />,
      count: allFines.length 
    },
    { 
      id: "history", 
      label: "Lịch sử giao dịch", 
      icon: <History size={18} strokeWidth={2} />,
      count: null 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Tài chính & Tiền phạt
        </h1>
        <p className="text-slate-500 mt-2 text-base font-medium">
          Quản lý các khoản phí, nợ thư viện và lịch sử thanh toán của bạn một cách dễ dàng.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-4 sm:gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-sm font-bold transition-all relative whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? "text-blue-600" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span 
                    className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                      isActive 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.4)] animate-in fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      {isLoading ? (
        <div className="py-32 flex justify-center">
           <Loading text="Đang đồng bộ dữ liệu tài chính..." />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "overview" && (
            <PaymentSummary 
              unpaidFines={unpaidFines} 
              onPaymentSuccess={fetchPaymentData} 
            />
          )}
          {activeTab === "fines" && (
            <FinesList fines={allFines} />
          )}
          {activeTab === "history" && (
            <PaymentHistory payments={payments} />
          )}
        </div>
      )}
      
    </div>
  );
}

export default PaymentPage;