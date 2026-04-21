import { useState } from "react";
import { Loading, Empty, ConfirmModal } from "../../../../components/common/index";
import { useManageReservations } from "../../../reservation/hooks/useManageReservations"; 

export default function AdminReservationTab() {
  const {
    reservations, isLoading,
    handleCancelHold, handleCancelPreOrder,
    confirmConfig, closeConfirmModal
  } = useManageReservations();

  const [filter, setFilter] = useState("ALL"); 

  const displayData = reservations.filter(r => filter === "ALL" || r.status === filter);

  const renderHoldDeadline = (expiryDate) => {
    if (!expiryDate) return null;
    const diffDays = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return <span className="text-xs text-rose-500 block mt-1">Đã quá hạn giữ sách</span>;
    if (diffDays === 0) return <span className="text-xs text-orange-600 font-bold block mt-1">⏳ Phải lấy trong hôm nay</span>;
    return <span className="text-xs text-slate-500 block mt-1">Còn {diffDays} ngày để lấy</span>;
  };

  const getStatusBadge = (status, holdExpiryDate) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">Đang xếp hàng chờ sách</span>;
      case "HOLDING":
        return (
          <div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Đã cất giữ chờ Độc giả</span>
            {renderHoldDeadline(holdExpiryDate)}
          </div>
        );
      case "COMPLETE":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Đã nhận (Đang mượn)</span>;
      case "EXPIRED":
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold">Đã hủy / Quá hạn nhận</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  // UI HÀNH ĐỘNG GIÁM SÁT
  const renderActionButtons = (req) => {
    if (req.status === "PENDING") {
      return (
        <button onClick={() => handleCancelPreOrder(req.id)} className="text-xs text-rose-500 hover:text-rose-700 hover:underline transition-colors">
          Hủy xếp hàng
        </button>
      );
    }
    
    if (req.status === "HOLDING") {
      return (
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">Xử lý tại Quầy POS</span>
          <button onClick={() => handleCancelHold(req.id)} className="text-xs text-slate-400 hover:text-rose-600 underline transition-colors mt-1">
            Hủy đơn (Khách không lấy)
          </button>
        </div>
      );
    }

    return <span className="text-slate-400 text-sm italic">Lịch sử</span>;
  };

  const TABS = [
    { id: "ALL", label: "Tất cả đơn" }, 
    { id: "PENDING", label: "Hàng đợi (Chờ sách)" }, 
    { id: "HOLDING", label: "Đang giữ chờ lấy" },
    { id: "COMPLETE", label: "Lịch sử đã giao" },
    { id: "EXPIRED", label: "Hủy / Quá hạn" }
  ];

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        {TABS.map(t => (
          <button 
            key={t.id} 
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === t.id 
                ? "bg-slate-800 text-white" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loading text="Đang tải dữ liệu giám sát..." />
      ) : displayData.length === 0 ? (
        <Empty title="Trống" message={`Không có đơn đặt trước nào ở trạng thái này.`} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100 tracking-wider">
                  <th className="p-4 font-bold w-24">Mã Đơn</th>
                  <th className="p-4 font-bold">Độc giả</th>
                  <th className="p-4 font-bold">Sách yêu cầu</th>
                  <th className="p-4 font-bold">Trạng thái theo dõi</th>
                  <th className="p-4 font-bold text-right">Quản lý ngoại lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayData.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-700">#{req.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-800">{req.userName}</td>
                    <td className="p-4 text-sm text-slate-600">{req.bookTitle}</td>
                    <td className="p-4">
                      {getStatusBadge(req.status, req.holdExpiryDate)}
                    </td>
                    <td className="p-4 text-right">
                      {renderActionButtons(req)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={closeConfirmModal}        
      />
    </div>
  );
}