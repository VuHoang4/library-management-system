import React, { useState } from "react";
// Import Vũ khí
import { Badge, Table } from "../../../../components/ui";
import { Empty } from "../../../../components/common";

function FinesList({ fines }) {
  const [filter, setFilter] = useState("ALL");

  const filteredFines = fines.filter((fine) => {
    if (filter === "ALL") return true;
    return fine.status === filter;
  });

  // Sử dụng Badge Component
  const getBadgeVariant = (status) => {
    if (status === "UNPAID") return { text: "Chưa thanh toán", variant: "danger" };
    if (status === "PAID") return { text: "Đã thanh toán", variant: "success" };
    return { text: status, variant: "default" };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* HEADER & FILTER */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800">Danh sách phiếu phạt</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["ALL", "UNPAID", "PAID"].map(item => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === item ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {item === "ALL" ? "Tất cả" : item === "UNPAID" ? "Chưa trả" : "Đã trả"}
            </button>
          ))}
        </div>
      </div>

      {/* SỬ DỤNG TABLE & EMPTY */}
      {filteredFines.length === 0 ? (
        <Empty 
          title="Không có dữ liệu" 
          message={filter === "UNPAID" ? "Tuyệt vời! Bạn không có khoản phạt nào chưa thanh toán." : "Không tìm thấy phiếu phạt nào."} 
        />
      ) : (
        <Table headers={["Mã phiếu", "Lý do phạt", "Số tiền", "Ngày ghi nhận", "Trạng thái"]}>
          {filteredFines.map((fine) => {
            const badge = getBadgeVariant(fine.status);
            return (
              <tr key={fine.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">#{fine.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{fine.reason || "Trễ hạn trả sách"}</td>
                <td className="px-6 py-4 font-semibold text-rose-600">{fine.amount.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-slate-500">
                  {fine.updatedAt ? new Date(fine.updatedAt).toLocaleDateString("vi-VN") : "---"}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={badge.variant}>{badge.text}</Badge>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
}

export default FinesList;