import { useState, useMemo } from "react";
import { Loading, Empty } from "../../../../components/common/index";
import { useManageBorrows } from "../../hooks/useManageBorrows";

export default function AdminBorrowTab() {
  const { borrows, isLoading } = useManageBorrows();
  const [filter, setFilter] = useState("ALL");

  const normalizeDate = (dateString) => {
    if (!dateString) return new Date();
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getDetailedState = (borrow) => {
    const dueDate = normalizeDate(borrow.dueDate);

    if (borrow.status === "RETURNED") {
      const returnDate = borrow.returnDate ? normalizeDate(borrow.returnDate) : normalizeDate(new Date());
      if (returnDate > dueDate) return "RETURNED_LATE"; 
      return "RETURNED_ON_TIME";                        
    }

    const today = normalizeDate(new Date());
    if (today > dueDate) return "OVERDUE_ACTIVE";       
    return "BORROWED_ACTIVE";                           
  };

  const getStatusBadge = (detailedState) => {
    switch (detailedState) {
      case "BORROWED_ACTIVE":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Đang mượn (Trong hạn)</span>;
      case "OVERDUE_ACTIVE":
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1 w-fit border border-rose-200 shadow-sm">🚨 Quá hạn (Chưa trả)</span>;
      case "RETURNED_ON_TIME":
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Đã trả (Đúng hạn)</span>;
      case "RETURNED_LATE":
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Đã trả (Bị trễ hạn)</span>;
      default:
        return null;
    }
  };

  // UI DÀNH CHO BACK-OFFICE (Không có thao tác trả sách ở đây)
  const renderActionButtons = (detailedState) => {
    if (detailedState.includes("RETURNED")) {
      return <span className="text-slate-400 text-sm italic">Lưu trữ</span>;
    }
    
    if (detailedState === "OVERDUE_ACTIVE") {
      return (
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Thu phạt tại Quầy</span>
          {/* Nút giả lập tính năng gửi nhắc nhở thủ công */}
          <button className="text-xs text-slate-500 hover:text-blue-600 underline transition-colors">
            Gửi email nhắc nhở
          </button>
        </div>
      );
    }
    
    return (
      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">
        Trả sách tại Quầy
      </span>
    );
  };

  const displayData = useMemo(() => {
    return borrows.filter((borrow) => {
      const state = getDetailedState(borrow);
      if (filter === "ALL") return true;
      if (filter === "BORROWED") return state === "BORROWED_ACTIVE";
      if (filter === "OVERDUE") return state === "OVERDUE_ACTIVE";
      if (filter === "RETURNED") return state === "RETURNED_ON_TIME" || state === "RETURNED_LATE";
      return true;
    });
  }, [borrows, filter]);

  const TABS = [
    { id: "ALL", label: "Tất cả báo cáo" }, 
    { id: "BORROWED", label: "Sách đang lưu hành" }, 
    { id: "OVERDUE", label: "Sách đang trễ hạn" }, 
    { id: "RETURNED", label: "Lịch sử lưu trữ" }
  ];

  return (
    <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
      
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        {TABS.map(t => (
          <button 
            key={t.id} 
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === t.id ? "bg-slate-800 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Loading text="Đang tải báo cáo..." />
      ) : displayData.length === 0 ? (
        <Empty title="Trống" message="Không có phiếu mượn nào ở mục này." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100 tracking-wider">
                  <th className="p-4 font-bold w-24">Mã Phiếu</th>
                  <th className="p-4 font-bold">Độc giả</th>
                  <th className="p-4 font-bold">Thông tin sách</th>
                  <th className="p-4 font-bold">Kỳ hạn</th>
                  <th className="p-4 font-bold">Đánh giá trạng thái</th>
                  <th className="p-4 font-bold text-right">Hướng xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayData.map((borrow) => {
                  const detailedState = getDetailedState(borrow); 
                  
                  return (
                    <tr key={borrow.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm font-bold text-slate-700">#{borrow.id}</td>
                      <td className="p-4 text-sm font-medium text-slate-800">{borrow.userName}</td>
                      <td className="p-4 text-sm text-slate-600">{borrow.bookTitle}</td>
                      
                      <td className="p-4 flex flex-col gap-0.5">
                        <span className={`text-sm font-bold ${detailedState === 'OVERDUE_ACTIVE' ? 'text-rose-600' : 'text-slate-700'}`}>
                          Hạn: {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString('vi-VN') : "Không có"}
                        </span>
                        
                        {borrow.status === "RETURNED" && borrow.returnDate && (
                          <span className={`text-xs font-medium ${detailedState === 'RETURNED_LATE' ? 'text-orange-600' : 'text-emerald-600'}`}>
                            Trả ngày: {new Date(borrow.returnDate).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </td>
                      
                      <td className="p-4">
                        {getStatusBadge(detailedState)}
                      </td>
                      
                      <td className="p-4 text-right">
                        {renderActionButtons(detailedState)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}