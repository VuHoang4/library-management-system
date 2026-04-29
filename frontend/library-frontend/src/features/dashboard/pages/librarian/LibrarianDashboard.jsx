import { useEffect, useState, useCallback } from "react";
import { librarianApi } from "../../../borrow/services/librarianApi";
import {
  BookOpen,
  Users,
  AlertTriangle,
  BarChart3,
  BookCopy,
  Clock,
  RefreshCw,
  Activity
} from "lucide-react";
import { Loading, Empty } from "../../../../components/common";
import { Button, Badge, Table } from "../../../../components/ui";
import { useToast } from "../../../../hooks/useToast";

function LibrarianDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setLoading(true);

      const [s, b] = await Promise.all([
        librarianApi.getDashboardSummary(),
        librarianApi.getRecentBorrows(),
      ]);

      setStats(s.data);
      setBorrows(b.data || []);
      
      if (isRefresh) toast.success("Đã cập nhật số liệu mới nhất!");
    } catch (err) {
      console.error("Lỗi load dashboard:", err);
      toast.error("Không thể tải dữ liệu Dashboard");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "QUEUE":
      case "PENDING":
        return <Badge variant="warning">Đang chờ sách</Badge>;
      case "HOLDING":
        return <Badge variant="info">Đang giữ sách</Badge>;
      case "BORROWED":
        return <Badge variant="success">Đang mượn</Badge>;
      case "OVERDUE":
        return <Badge variant="danger">Quá hạn</Badge>;
      case "RETURNED":
        return <Badge variant="secondary">Đã trả</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading text="Đang thu thập số liệu thư viện..." />
      </div>
    );
  }

  const recentBorrowsHeaders = ["STT", "Độc giả", "Cuốn sách", "Ngày cập nhật", "Trạng thái"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 text-white rounded-xl shadow-sm hidden sm:block">
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Dashboard Thư Viện
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tổng quan hoạt động và luân chuyển sách hôm nay.
            </p>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={() => fetchDashboard(true)}
          disabled={isRefreshing}
          className="gap-2 shadow-sm w-full sm:w-auto"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Đang tải..." : "Làm mới dữ liệu"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 bg-slate-100 rounded-full text-slate-600 shrink-0">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Tổng số đầu sách</p>
            <p className="text-2xl font-black text-slate-800 truncate">
              {stats?.totalBooks?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full shrink-0">
            <BookCopy size={24} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Đang được mượn</p>
            <p className="text-2xl font-black text-blue-600 truncate">
              {stats?.activeBorrows?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-2xl shadow-sm border border-rose-200 flex items-center gap-4 relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          <div className="p-4 bg-rose-100 text-rose-600 rounded-full shrink-0 border border-rose-200/50">
            <AlertTriangle size={24} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-rose-600 truncate">Sách quá hạn</p>
            <p className="text-2xl font-black text-rose-700 truncate">
              {stats?.overdueBorrows?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
            <Users size={24} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Độc giả hoạt động</p>
            <p className="text-2xl font-black text-emerald-600 truncate">
              {stats?.totalReaders?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/50">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Hoạt động mượn sách gần đây
          </h3>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {borrows.length === 0 ? (
            <div className="py-10">
              <Empty 
                title="Chưa có giao dịch" 
                message="Không có hoạt động mượn/trả sách nào gần đây." 
                icon={<Activity size={48} strokeWidth={1.5} />}
              />
            </div>
          ) : (
            <Table headers={recentBorrowsHeaders}>
              {borrows.map((borrow, index) => (
                <tr key={borrow.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  
                  <td className="px-6 py-4 text-center">
                    <p className="font-black text-slate-500">{index + 1}</p>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-800">
                    {borrow.readerName}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {borrow.bookTitle}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {borrow.date ? new Date(borrow.date).toLocaleDateString("vi-VN") : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(borrow.status)}
                  </td>

                </tr>
              ))}
            </Table>
          )}
        </div>
      </div>

    </div>
  );
}

export default LibrarianDashboard;