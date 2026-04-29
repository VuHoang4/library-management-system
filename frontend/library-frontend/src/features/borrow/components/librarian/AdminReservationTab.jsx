import { useState, useMemo } from "react";
import { Search, CalendarX } from "lucide-react";
import { Loading, Empty, ConfirmModal } from "../../../../components/common";
import { Input, Table, Badge, Button } from "../../../../components/ui";
import { useManageReservations } from "../../../reservation/hooks/useManageReservations"; 

export default function AdminReservationTab() {
  const {
    reservations, isLoading,
    handleCancelHold, handleCancelPreOrder,
    confirmConfig, closeConfirmModal
  } = useManageReservations();

  const [filter, setFilter] = useState("ALL"); 
  const [searchTerm, setSearchTerm] = useState("");

  const displayData = useMemo(() => {
    let result = [...reservations];

    if (filter !== "ALL") {
      result = result.filter(r => r.status === filter);
    }

    if (searchTerm.trim() !== "") {
      const lowerKeyword = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.userName?.toLowerCase().includes(lowerKeyword) ||
          r.bookTitle?.toLowerCase().includes(lowerKeyword)
      );
    }

    return result.sort((a, b) => b.id - a.id);
  }, [reservations, filter, searchTerm]);


  const renderHoldDeadline = (expiryDate) => {
    if (!expiryDate) return null;
    const diffDays = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return <span className="text-xs font-semibold text-rose-500 block mt-1">Đã quá hạn giữ sách</span>;
    if (diffDays === 0) return <span className="text-xs font-bold text-orange-600 block mt-1">⏳ Phải lấy trong hôm nay</span>;
    return <span className="text-xs font-medium text-slate-500 block mt-1">Còn {diffDays} ngày để lấy</span>;
  };

  const getStatusBadge = (status, holdExpiryDate) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="default">Đang xếp hàng chờ sách</Badge>;
      case "HOLDING":
        return (
          <div className="flex flex-col items-start gap-1">
            <Badge variant="info">Đã cất giữ chờ Độc giả</Badge>
            {renderHoldDeadline(holdExpiryDate)}
          </div>
        );
      case "COMPLETED":
        return <Badge variant="success">Đã nhận (Đang mượn)</Badge>;
      case "EXPIRED":
        return <Badge variant="danger">Đã hủy / Quá hạn nhận</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const renderActionButtons = (req) => {
    if (req.status === "PENDING") {
      return (
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => handleCancelPreOrder(req.id)} 
          className="shadow-sm px-3 py-1.5"
        >
          Hủy xếp hàng
        </Button>
      );
    }
    
    if (req.status === "HOLDING") {
      return (
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded border border-blue-100 shadow-sm">
            Xử lý tại Quầy POS
          </span>
          <button 
            onClick={() => handleCancelHold(req.id)} 
            className="text-xs font-medium text-slate-400 hover:text-rose-600 underline transition-colors"
          >
            Hủy đơn (Khách không lấy)
          </button>
        </div>
      );
    }

    return <span className="text-slate-400 text-sm font-medium italic">Lịch sử</span>;
  };

  const TABS = [
    { id: "ALL", label: "Tất cả đơn" }, 
    { id: "PENDING", label: "Hàng đợi (Chờ sách)" }, 
    { id: "HOLDING", label: "Đang giữ chờ lấy" },
    { id: "COMPLETED", label: "Lịch sử đã giao" },
    { id: "EXPIRED", label: "Hủy / Quá hạn" }
  ];

  const headers = [
    "STT",
    "Độc giả",
    "Sách yêu cầu",
    "Trạng thái theo dõi",
    "Quản lý ngoại lệ"
  ];

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      
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
          <Loading text="Đang tải dữ liệu hàng đợi..." />
        </div>
      ) : displayData.length === 0 ? (
        <div className="py-10">
          <Empty 
            title="Trống" 
            message="Không có đơn đặt trước nào khớp với bộ lọc hiện tại." 
            icon={<CalendarX size={48} strokeWidth={1.5} />}
          />
        </div>
      ) : (
        <Table headers={headers}>
          {displayData.map((req, index) => (
            <tr key={req.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
              
              <td className="px-6 py-4 text-center">
                <p className="font-black text-slate-500">{index + 1}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">#{req.id}</p>
              </td>
              
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{req.userName}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600">{req.bookTitle}</td>
              
              <td className="px-6 py-4">
                {getStatusBadge(req.status, req.holdExpiryDate)}
              </td>
              
              <td className="px-6 py-4 text-right">
                {renderActionButtons(req)}
              </td>
            </tr>
          ))}
        </Table>
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