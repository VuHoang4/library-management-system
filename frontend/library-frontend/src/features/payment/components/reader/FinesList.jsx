import React, { useState } from "react";
import { Receipt, CheckCircle2, AlertCircle, CheckCircle } from "lucide-react";
import { Badge, Table } from "../../../../components/ui";
import { Empty } from "../../../../components/common";

function FinesList({ fines }) {
  const [filter, setFilter] = useState("ALL");

 
  const filteredFines = fines
    .filter((fine) => {
      if (filter === "ALL") return true;
      return fine.status === filter;
    })
    .sort((a, b) => {
      
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA; // Sắp xếp giảm dần (Mới nhất -> Cũ nhất)
    });

  const getBadgeVariant = (status) => {
    if (status === "UNPAID") return { text: "Chưa thanh toán", variant: "danger" };
    if (status === "PAID") return { text: "Đã thanh toán", variant: "success" };
    return { text: status, variant: "default" };
  };

  const getFilterLabel = (item) => {
    switch (item) {
      case "ALL": return "Tất cả";
      case "UNPAID": return "Chưa trả";
      case "PAID": return "Đã trả";
      default: return item;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER & FILTER */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg shadow-sm">
            <Receipt size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Danh sách phiếu phạt
          </h2>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60 w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {["ALL", "UNPAID", "PAID"].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                filter === item 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {getFilterLabel(item)}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH & EMPTY STATE */}
      <div className="overflow-x-auto custom-scrollbar">
        {filteredFines.length === 0 ? (
          <div className="py-12">
            <Empty 
              title={filter === "UNPAID" ? "Không có nợ phí" : "Không có dữ liệu"} 
              message={filter === "UNPAID" ? "Tuyệt vời! Bạn không có khoản phạt nào chưa thanh toán." : "Không tìm thấy phiếu phạt nào trong hệ thống."} 
              icon={filter === "UNPAID" ? <CheckCircle2 size={48} strokeWidth={1.5} className="text-emerald-500" /> : <Receipt size={48} strokeWidth={1.5} />}
            />
          </div>
        ) : (
          <Table headers={["Mã phiếu", "Lý do phạt", "Số tiền", "Ngày ghi nhận", "Trạng thái"]}>
            {filteredFines.map((fine) => {
              const badge = getBadgeVariant(fine.status);
              const isUnpaid = fine.status === "UNPAID";

              return (
                <tr key={fine.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-500">#{fine.id}</span>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-700">
                    {fine.reason || "Trễ hạn trả sách"}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`font-black flex items-center gap-1.5 ${isUnpaid ? 'text-rose-600' : 'text-slate-700'}`}>
                      {fine.amount.toLocaleString("vi-VN")} đ
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {fine.updatedAt ? new Date(fine.updatedAt).toLocaleDateString("vi-VN") : "---"}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant={badge.variant} className="gap-1.5">
                      {isUnpaid ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                      {badge.text}
                    </Badge>
                  </td>

                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
}

export default FinesList;