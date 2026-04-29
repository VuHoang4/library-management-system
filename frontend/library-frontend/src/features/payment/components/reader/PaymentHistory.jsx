import React from "react";
import { History, Receipt, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react";
import { Badge, Table } from "../../../../components/ui";
import { Empty } from "../../../../components/common";

function PaymentHistory({ payments }) {
  
  
  const sortedPayments = [...payments].sort((a, b) => {
    
    const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return dateB - dateA; // Sắp xếp giảm dần (Mới nhất -> Cũ nhất)
  });

  const getBadgeConfig = (status) => {
    switch (status) {
      case "SUCCESS": 
        return { text: "Thành công", variant: "success", icon: <CheckCircle size={14} /> };
      case "FAILED": 
        return { text: "Thất bại", variant: "danger", icon: <XCircle size={14} /> };
      case "PENDING": 
        return { text: "Đang chờ", variant: "warning", icon: <Clock size={14} /> };
      default: 
        return { text: status, variant: "default", icon: null };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
          <History size={20} strokeWidth={2.5} />
        </div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Lịch sử giao dịch
        </h2>
      </div>

      {/* DANH SÁCH & EMPTY STATE */}
      <div className="overflow-x-auto custom-scrollbar">
        {sortedPayments.length === 0 ? (
          <div className="py-12">
            <Empty 
              title="Chưa có giao dịch" 
              message="Bạn chưa thực hiện khoản thanh toán nào trên hệ thống." 
              icon={<Receipt size={48} strokeWidth={1.5} />} 
            />
          </div>
        ) : (
          <Table headers={["Khoản thanh toán", "Số tiền", "Phương thức", "Ngày giao dịch", "Trạng thái"]}>
            {sortedPayments.map((payment) => {
              const badge = getBadgeConfig(payment.status);
              
              return (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800 line-clamp-2">
                        {payment.reason || "Thanh toán phí thư viện"}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        Phát sinh: {payment.fine?.createdAt ? new Date(payment.fine.createdAt).toLocaleDateString("vi-VN") : "---"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-black text-slate-700">
                      {payment.amount.toLocaleString("vi-VN")} đ
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="gap-1.5 bg-slate-100 text-slate-600 border-slate-200">
                      <CreditCard size={14} />
                      {payment.method || "VNPay"}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleString("vi-VN") : "---"}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant={badge.variant} className="gap-1.5">
                      {badge.icon}
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

export default PaymentHistory;