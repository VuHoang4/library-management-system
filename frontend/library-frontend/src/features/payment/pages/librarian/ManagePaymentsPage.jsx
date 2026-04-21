import { useState } from "react";

// Dữ liệu giả định cho trang Thanh toán
const MOCK_PAYMENTS = [
  { id: "PAY-1001", readerName: "Nguyễn Văn A", reason: "Phạt trễ hạn (Clean Code)", amount: 15000, date: "2026-04-18", status: "PENDING" },
  { id: "PAY-1002", readerName: "Lê Văn C", reason: "Phí làm lại thẻ độc giả", amount: 50000, date: "2026-04-17", status: "COMPLETED" },
  { id: "PAY-1003", readerName: "Phạm Thị D", reason: "Đền bù mất sách (Deep Work)", amount: 120000, date: "2026-04-15", status: "PENDING" },
  { id: "PAY-1004", readerName: "Trần Thị B", reason: "Phạt trễ hạn (Sapiens)", amount: 10000, date: "2026-04-10", status: "COMPLETED" },
  { id: "PAY-1005", readerName: "Hoàng Văn E", reason: "Phạt trễ hạn (Atomic Habits)", amount: 25000, date: "2026-04-05", status: "CANCELLED" },
];

function ManagePaymentsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Hàm render Badge Trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Chờ thanh toán</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Đã thu tiền</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">Đã hủy</span>;
      default:
        return null;
    }
  };

  // Lọc dữ liệu kết hợp cả Tab và Tìm kiếm
  const filteredPayments = MOCK_PAYMENTS.filter((payment) => {
    const matchTab = activeTab === "ALL" || payment.status === activeTab;
    const matchSearch = 
      payment.readerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  // Tính tổng doanh thu (Chỉ tính các khoản COMPLETED)
  const totalRevenue = MOCK_PAYMENTS.filter(p => p.status === "COMPLETED").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = MOCK_PAYMENTS.filter(p => p.status === "PENDING").reduce((acc, curr) => acc + curr.amount, 0);

  const tabs = [
    { key: "ALL", label: "Tất cả giao dịch" },
    { key: "PENDING", label: "Chờ thanh toán" },
    { key: "COMPLETED", label: "Đã thu tiền" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & THỐNG KÊ NHANH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi phí phạt trễ hạn, đền bù mất sách và thu phí dịch vụ.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-end">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đang chờ thu</span>
            <span className="text-lg font-bold text-yellow-600">{formatCurrency(pendingAmount)}</span>
          </div>
          <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-end">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đã thu (Tháng này)</span>
            <span className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* BỘ LỌC TÌM KIẾM VÀ TABS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-72 shrink-0">
          <input 
            type="text" 
            placeholder="Tìm mã phiếu hoặc tên độc giả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium w-28">Mã GD</th>
                <th className="p-4 font-medium">Độc giả</th>
                <th className="p-4 font-medium">Lý do thu</th>
                <th className="p-4 font-medium">Ngày ghi nhận</th>
                <th className="p-4 font-medium text-right">Số tiền</th>
                <th className="p-4 font-medium text-center">Trạng thái</th>
                <th className="p-4 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    Không tìm thấy giao dịch nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-sm font-bold text-slate-700">{payment.id}</td>
                    <td className="p-4 text-sm font-medium text-slate-800">{payment.readerName}</td>
                    <td className="p-4 text-sm text-slate-600">{payment.reason}</td>
                    <td className="p-4 text-sm text-slate-500">{payment.date}</td>
                    <td className="p-4 text-sm font-bold text-slate-800 text-right">{formatCurrency(payment.amount)}</td>
                    <td className="p-4 text-center">{getStatusBadge(payment.status)}</td>
                    <td className="p-4 text-right">
                      {payment.status === "PENDING" ? (
                        <button className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded transition-colors font-medium">
                          Xác nhận thu
                        </button>
                      ) : (
                        <button className="text-sm text-slate-400 hover:text-blue-600 transition-colors font-medium opacity-0 group-hover:opacity-100">
                          Xem chi tiết
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagePaymentsPage;