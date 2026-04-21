import React from "react";
// Import Vũ khí
import { Badge, Table } from "../../../../components/ui";
import { Empty } from "../../../../components/common";

function PaymentHistory({ payments }) {
  
  const getBadgeVariant = (status) => {
    switch (status) {
      case "SUCCESS": return { text: "Thành công", variant: "success" };
      case "FAILED": return { text: "Thất bại", variant: "danger" };
      case "PENDING": return { text: "Đang chờ", variant: "warning" };
      default: return { text: status, variant: "default" };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Lịch sử giao dịch</h2>
      </div>

      {payments.length === 0 ? (
        <Empty title="Chưa có giao dịch" message="Bạn chưa thực hiện khoản thanh toán nào." icon="🧾" />
      ) : (
        <Table headers={["Khoản thanh toán", "Số tiền", "Phương thức", "Ngày giao dịch", "Trạng thái"]}>
          {payments.map((payment) => {
            const badge = getBadgeVariant(payment.status);
            return (
              <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-900 line-clamp-2">{payment.reason || "Thanh toán phí thư viện"}</span>
                    <span className="text-xs text-slate-500">
                      Phát sinh: {payment.fine?.createdAt ? new Date(payment.fine.createdAt).toLocaleDateString("vi-VN") : "---"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">{payment.amount.toLocaleString()} đ</td>
                <td className="px-6 py-4"><Badge variant="default">{payment.method || "VNPay"}</Badge></td>
                <td className="px-6 py-4 text-slate-500">
                  {payment.createdAt ? new Date(payment.createdAt).toLocaleString("vi-VN") : "---"}
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

export default PaymentHistory;