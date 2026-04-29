import { useEffect, useState, useCallback } from "react";
import { paymentApi } from "../../../payment/services/paymentApi";
import { Search, Banknote, CheckCircle, Wallet, AlertCircle, Receipt } from "lucide-react";
import { Loading, Empty, ConfirmModal } from "../../../../components/common";
import { Button, Input, Table, Badge } from "../../../../components/ui";
import { useToast } from "../../../../hooks/useToast";

function ManagePaymentsPage() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [fines, setFines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    fineId: null,
  });

  // 🌟 Đã bọc bằng useCallback để xử lý cảnh báo vàng
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [payRes, fineRes] = await Promise.all([
        paymentApi.getPayments(),
        paymentApi.getUnpaidFines()
      ]);

      setPayments(payRes.data || []);
      setFines(fineRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu"); 
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // 🌟 Truyền fetchData vào mảng phụ thuộc
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getBadgeConfig = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "Chờ thanh toán", variant: "warning", icon: <AlertCircle size={14} /> };
      case "SUCCESS":
        return { text: "Đã thu tiền", variant: "success", icon: <CheckCircle size={14} /> };
      default:
        return { text: status, variant: "default", icon: null };
    }
  };

  const combinedData = [
    ...fines.map(f => ({
      id: `FINE-${f.id}`,
      readerName: f.userName,
      reason: f.reason,
      amount: f.amount,
      date: f.updatedAt,
      status: "PENDING",
      fineId: f.id
    })),
    ...payments.map(p => ({
      id: `PAY-${p.id}`,
      readerName: p.userName,
      reason: p.reason,
      amount: p.amount,
      date: p.updatedAt,
      status: "SUCCESS"
    }))
  ];

  const filtered = combinedData.filter(item => {
    const matchTab =
      activeTab === "ALL" ||
      (activeTab === "PENDING" && item.status === "PENDING") ||
      (activeTab === "COMPLETED" && item.status === "SUCCESS");

    const matchSearch =
      (item.readerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase());

    return matchTab && matchSearch;
  });

  const totalRevenue = payments.reduce((a, b) => a + b.amount, 0);
  const pendingAmount = fines.reduce((a, b) => a + b.amount, 0);

  const openConfirmPay = (fineId) => {
    setConfirmConfig({ isOpen: true, fineId });
  };

  const handlePayFine = async () => {
    const { fineId } = confirmConfig;
    try {
      await paymentApi.payFineCash(fineId);
      toast.success("Đã thu tiền thành công!"); 
      fetchData(); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi thanh toán");
    } finally {
      setConfirmConfig({ isOpen: false, fineId: null });
    }
  };

  const tabs = [
    { key: "ALL", label: "Tất cả giao dịch" },
    { key: "PENDING", label: "Chờ thu tiền" },
    { key: "COMPLETED", label: "Đã hoàn tất" },
  ];

  const tableHeaders = ["Mã giao dịch", "Độc giả", "Lý do", "Ngày ghi nhận", "Số tiền", "Trạng thái", "Hành động"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      {/* HEADER & STATS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-3 rounded-xl text-white shadow-sm hidden sm:block">
            <Wallet size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Quản lý Thanh toán
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi các khoản phí phạt và giao dịch thu tiền tại quầy.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="bg-amber-50 border border-amber-200/60 px-5 py-3 rounded-xl flex-1 xl:flex-none">
            <p className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5 mb-1">
              <Banknote size={14} strokeWidth={2.5} /> Chờ thu
            </p>
            <p className="text-xl font-black text-amber-700 tracking-tight">
              {formatCurrency(pendingAmount)}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/60 px-5 py-3 rounded-xl flex-1 xl:flex-none">
            <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5 mb-1">
              <CheckCircle size={14} strokeWidth={2.5} /> Đã thu
            </p>
            <p className="text-xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 overflow-hidden">
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60 w-full md:w-auto overflow-x-auto custom-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === t.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
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
            placeholder="Tìm theo tên hoặc mã phiếu..."
            icon={Search}
          />
        </div>
      </div>

      {/* MAIN CONTENT VỚI COMMON COMPONENTS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20">
            <Loading text="Đang tải dữ liệu thanh toán..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16">
            <Empty 
              title="Không có giao dịch" 
              message="Không có dữ liệu giao dịch nào khớp với bộ lọc của bạn." 
              icon={<Receipt size={48} strokeWidth={1.5} />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table headers={tableHeaders}>
              {filtered.map((item) => {
                const badge = getBadgeConfig(item.status);
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-500 text-sm">
                        {item.id}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.readerName}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-600">
                      {item.reason}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className={`font-black ${item.status === "PENDING" ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {formatCurrency(item.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge variant={badge.variant} className="gap-1.5 justify-center">
                        {badge.icon}
                        {badge.text}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.status === "PENDING" ? (
                        <div className="flex justify-end">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openConfirmPay(item.fineId)}
                            className="shadow-sm font-bold"
                          >
                            Thu tiền mặt
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-sm flex items-center justify-end gap-1">
                          <CheckCircle size={14} /> Hoàn tất
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </Table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title="Xác nhận thu tiền"
        message="Bạn có chắc chắn đã nhận đủ số tiền mặt từ Độc giả cho khoản phạt này chưa? Thao tác này không thể hoàn tác."
        onConfirm={handlePayFine}
        onClose={() => setConfirmConfig({ isOpen: false, fineId: null })}
      />

    </div>
  );
}

export default ManagePaymentsPage;