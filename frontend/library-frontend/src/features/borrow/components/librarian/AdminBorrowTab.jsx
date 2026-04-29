import { useState, useMemo } from "react";
import { Search, FileX } from "lucide-react";
import { Loading, Empty } from "../../../../components/common";
import { Input, Table, Badge } from "../../../../components/ui";
import { useManageBorrows } from "../../hooks/useManageBorrows";

export default function AdminBorrowTab() {
  const { borrows, isLoading } = useManageBorrows();
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

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

  const displayData = useMemo(() => {
    let result = [...borrows];

    result = result.filter((borrow) => {
      const state = getDetailedState(borrow);
      if (filter === "ALL") return true;
      if (filter === "BORROWED") return state === "BORROWED_ACTIVE";
      if (filter === "OVERDUE") return state === "OVERDUE_ACTIVE";
      if (filter === "RETURNED") return state === "RETURNED_ON_TIME" || state === "RETURNED_LATE";
      return true;
    });

    if (searchTerm.trim() !== "") {
      const lowerKeyword = searchTerm.toLowerCase();
      result = result.filter(
        (borrow) =>
          borrow.userName?.toLowerCase().includes(lowerKeyword) ||
          borrow.bookTitle?.toLowerCase().includes(lowerKeyword)
      );
    }

    return result.sort((a, b) => b.id - a.id);
  }, [borrows, filter, searchTerm]);

  const getStatusBadge = (detailedState) => {
    switch (detailedState) {
      case "BORROWED_ACTIVE":
        return <Badge variant="info">Đang mượn (Trong hạn)</Badge>;
      case "OVERDUE_ACTIVE":
        return <Badge variant="danger" className="border-rose-200 shadow-sm flex items-center gap-1 w-fit">🚨 Quá hạn (Chưa trả)</Badge>;
      case "RETURNED_ON_TIME":
        return <Badge variant="success">Đã trả (Đúng hạn)</Badge>;
      case "RETURNED_LATE":
        return <Badge variant="warning">Đã trả (Bị trễ hạn)</Badge>;
      default:
        return null;
    }
  };

  const renderActionButtons = (detailedState) => {
    if (detailedState.includes("RETURNED")) {
      return <span className="text-slate-400 text-sm italic">Lưu trữ</span>;
    }
    
    if (detailedState === "OVERDUE_ACTIVE") {
      return (
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100">Thu phạt tại Quầy</span>
          <button className="text-xs text-slate-500 hover:text-blue-600 underline transition-colors">
            Gửi email nhắc nhở
          </button>
        </div>
      );
    }
    
    return (
      <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1.5 rounded border border-slate-200">
        Trả sách tại Quầy
      </span>
    );
  };

  const TABS = [
    { id: "ALL", label: "Tất cả báo cáo" }, 
    { id: "BORROWED", label: "Sách đang lưu hành" }, 
    { id: "OVERDUE", label: "Sách đang trễ hạn" }, 
    { id: "RETURNED", label: "Lịch sử lưu trữ" }
  ];

  const headers = [
    "STT",
    "Độc giả",
    "Thông tin sách",
    "Kỳ hạn",
    "Đánh giá trạng thái",
    "Hướng xử lý"
  ];

  return (
    <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
      
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {TABS.map(t => (
            <button 
              key={t.id} 
              onClick={() => setFilter(t.id)}
              className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${
                filter === t.id 
                  ? "bg-slate-800 text-white shadow-sm" 
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Độc giả hoặc Tên sách..."
            icon={Search}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20">
          <Loading text="Đang tải báo cáo..." />
        </div>
      ) : displayData.length === 0 ? (
        <div className="py-10">
          <Empty 
            title="Trống" 
            message="Không có phiếu mượn nào khớp với bộ lọc hiện tại." 
            icon={<FileX size={48} strokeWidth={1.5} />} 
          />
        </div>
      ) : (
        <Table headers={headers}>
          {displayData.map((borrow, index) => {
            const detailedState = getDetailedState(borrow); 
            
            return (
              <tr key={borrow.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                
                <td className="px-6 py-4 text-center">
                  <p className="font-black text-slate-500">{index + 1}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">#{borrow.id}</p>
                </td>

                <td className="px-6 py-4 text-sm font-bold text-slate-800">{borrow.userName}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{borrow.bookTitle}</td>
                
                <td className="px-6 py-4 flex flex-col gap-0.5">
                  <span className={`text-sm font-bold ${detailedState === 'OVERDUE_ACTIVE' ? 'text-rose-600' : 'text-slate-700'}`}>
                    Hạn: {borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString('vi-VN') : "Không có"}
                  </span>
                  
                  {borrow.status === "RETURNED" && borrow.returnDate && (
                    <span className={`text-xs font-bold ${detailedState === 'RETURNED_LATE' ? 'text-orange-600' : 'text-emerald-600'}`}>
                      Trả ngày: {new Date(borrow.returnDate).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  {getStatusBadge(detailedState)}
                </td>
                
                <td className="px-6 py-4 text-right">
                  {renderActionButtons(detailedState)}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}