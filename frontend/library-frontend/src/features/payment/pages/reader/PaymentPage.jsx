import { useState, useEffect } from "react";
import { usePayment } from "../../hooks/usePayment";
import PaymentSummary from "../../components/reader/PaymentSummary";
import PaymentHistory from "../../components/reader/PaymentHistory";
import FinesList from "../../components/reader/FinesList";
import { Loading } from "../../../../components/common"; // Import Vũ khí

function PaymentPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { allFines, unpaidFines, payments, isLoading, fetchPaymentData } = usePayment();

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  const tabs = [
    { id: "overview", label: "Tổng quan nợ", count: unpaidFines.length },
    { id: "fines", label: "Danh sách phiếu phạt", count: allFines.length },
    { id: "history", label: "Lịch sử giao dịch", count: null },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Tài chính & Tiền phạt
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Quản lý các khoản phí, nợ thư viện và lịch sử thanh toán của bạn.
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-6 border-b border-slate-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 text-sm font-semibold transition-all relative ${
              activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    activeTab === tab.id ? "bg-blue-100 text-blue-700 font-bold" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT - Dùng Component Loading chuẩn */}
      {isLoading ? (
        <div className="py-32">
           <Loading text="Đang đồng bộ dữ liệu tài chính..." />
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {activeTab === "overview" && (
            <PaymentSummary unpaidFines={unpaidFines} onPaymentSuccess={fetchPaymentData} />
          )}
          {activeTab === "fines" && <FinesList fines={allFines} />}
          {activeTab === "history" && <PaymentHistory payments={payments} />}
        </div>
      )}
    </div>
  );
}

export default PaymentPage;